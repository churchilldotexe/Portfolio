export const prerender = false;

import { COOKIES_OPTIONS, COOKIES_PROPERTIES } from "@/lib/constants";
import { fetcher } from "@/lib/utils";
import { ratelimit } from "@/server/ratelimitter";
import { validateUserUseCase } from "@/server/use-case/auth";
import { verifyAccessToken } from "@/server/use-case/auth/token-use-cases";
import type { APIRoute } from "astro";
import { z, ZodError } from "zod";

const accessTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  scope: z.string().min(1),
});

const userAuthSchema = z.object({
  email: z.string().optional().nullable(),
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().optional(),
});

export type LoginParamsTypes =
  | { status: "error"; message: string }
  | { status: "success" }
  | { status: "failed" };

const createPathWithParams = (url: string | URL, paramsValue: LoginParamsTypes): string => {
  const params = new URLSearchParams();
  params.set("login", paramsValue.status);

  if (paramsValue.status === "error") {
    params.set("message", paramsValue.message);
  }
  return `${url}?${params.toString()}`;
};

export const GET: APIRoute = async ({ cookies, redirect, request }): Promise<Response> => {
  const githubUrl = new URL(request.url);
  const code = githubUrl.searchParams.get("code");
  const stateParamsValue = githubUrl.searchParams.get("state");

  // to prevent redirect loop and request spam
  const identifier = request.headers.get("X-Forwarded-For") ?? import.meta.env.CLIENT_ID;

  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    const redirectUrl = createPathWithParams("/dashboard", {
      status: "error",
      message: "Rate Limit reach Please wait for another 10mins",
    });
    return redirect(redirectUrl, 307);
  }

  const cookieAccessToken = cookies.get(COOKIES_PROPERTIES.ACCESSTOKEN)?.value;
  if (cookieAccessToken) {
    // accessToken still accessible
    const redirectUrl = createPathWithParams("/dashboard", { status: "success" });
    return redirect(redirectUrl, 307);
  }

  const cookieValue = cookies.get(COOKIES_PROPERTIES.STATE)?.value;
  const verifiedCookie = await verifyAccessToken<{ state: string }>(cookieValue);

  // for errors and redirect
  const redirectToLogin = (errorMessage: string): Response => {
    console.error(errorMessage);
    const redirectUrl = createPathWithParams("/api/redirect", {
      status: "error",
      message: errorMessage,
    });
    return redirect(redirectUrl, 307);
  };

  //redirect cookie if invalid(expired or mismatch)
  if (!verifiedCookie) {
    return redirectToLogin("invalid verifiedCookie");
  }

  //to handle possible cross site attack redirect back to github auth
  if (stateParamsValue !== verifiedCookie.state) {
    return redirectToLogin("cookie mismatched verifiedCookie");
  }
  const response = await fetcher(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: import.meta.env.CLIENT_ID,
        client_secret: import.meta.env.CLIENT_SECRET,
        code,
      }),
    },
    accessTokenSchema
  );
  if (!response.success) {
    if (response.error instanceof ZodError) {
      console.error(response.error);
      const redirectUrl = createPathWithParams("/dashboard", {
        status: "error",
        message: "Parsing Error: unable to get the correct data",
      });
      return redirect(redirectUrl, 307);
    } else {
      console.error(response.error);

      const redirectUrl = createPathWithParams("/dashboard", {
        status: "error",
        message: `${response.error.name} Error occured`,
      });
      return redirect(redirectUrl, 307);
    }
  }

  //to retry and get the correct scope and access_token
  if (response.data.scope.toLowerCase() !== "user:email" || !response.data.access_token) {
    return redirectToLogin("invalid access token and scope");
  }

  const userResponse = await fetcher(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `${response.data.token_type} ${response.data.access_token}`,
      },
    },
    userAuthSchema
  );

  if (!userResponse.success) {
    if (userResponse.error instanceof ZodError) {
      console.error(userResponse.error);
      const redirectUrl = createPathWithParams("/dashboard", {
        status: "error",
        message: "Parsing Error: unable to get the correct data",
      });
      return redirect(redirectUrl, 307);
    } else {
      console.error(userResponse.error);
      const redirectUrl = createPathWithParams("/dashboard", {
        status: "error",
        message: `${userResponse.error.name} Error occured`,
      });
      return redirect(redirectUrl, 307);
    }
  }

  const { email, id, login, avatar_url } = userResponse.data;
  const accessToken = await validateUserUseCase({
    email,
    authId: id,
    avatarUrl: avatar_url,
    displayName: login,
  });

  if (!accessToken) {
    throw new Error("unable to validate the user");
  }

  cookies.set(COOKIES_PROPERTIES.ACCESSTOKEN, accessToken, COOKIES_OPTIONS);
  cookies.delete(COOKIES_PROPERTIES.STATE, COOKIES_OPTIONS);

  const redirectUrl = createPathWithParams("/dashboard", { status: "success" });
  return redirect(redirectUrl, 307);
};
