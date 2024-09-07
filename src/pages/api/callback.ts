export const prerender = false;

import { COOKIES_OPTIONS, COOKIES_PROPERTIES } from "@/lib/constants";
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

const responseReturn = (message: string, status: ResponseInit["status"]) => {
  return new Response(
    JSON.stringify({
      message: message,
    }),
    { status }
  );
};

export const GET: APIRoute = async ({ redirect, cookies, request }): Promise<Response> => {
  try {
    const githubUrl = new URL(request.url);
    const code = githubUrl.searchParams.get("code");
    const stateParamsValue = githubUrl.searchParams.get("state");

    // to prevent redirect loop and request spam
    const identifier = request.headers.get("X-Forwarded-For") ?? import.meta.env.CLIENT_ID;

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return responseReturn("Rate Limit reach Please wait for another 10mins", 429);
    }

    const cookieAccessToken = cookies.get(COOKIES_PROPERTIES.ACCESSTOKEN)?.value;
    if (cookieAccessToken) {
      // decode the token
      return redirect("/dashboard", 302);
    }

    const cookieValue = cookies.get(COOKIES_PROPERTIES.STATE)?.value;
    const verifiedCookie = await verifyAccessToken<{ state: string }>(cookieValue);

    // for errors and redirect
    const logAndRedirect = (errorLogMessage: string): Response => {
      console.error(errorLogMessage);
      return redirect("/api/redirect", 302);
    };

    //redirect cookie if invalid(expired or mismatch)
    if (!verifiedCookie) {
      return logAndRedirect("invalid verifiedCookie");
    }

    //to handle possible cross site attack redirect back to github auth
    if (stateParamsValue !== verifiedCookie.state) {
      return logAndRedirect("cookie mismatched verifiedCookie");
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
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
    });

    if (!response.ok) {
      return responseReturn(`${response.status}: ${response.statusText}`, 500);
    }

    const data = (await response.json()) as unknown;
    const parsedData = accessTokenSchema.parse(data);

    //to retry and get the correct scope and access_token
    if (parsedData.scope.toLowerCase() !== "user:email" || !parsedData.access_token) {
      return logAndRedirect("invalid access token and scope");
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `${parsedData.token_type} ${parsedData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return responseReturn(`${userResponse.status}: ${userResponse.statusText}`, 500);
    }

    const userData = (await userResponse.json()) as unknown;
    const parsedUserData = userAuthSchema.parse(userData);
    const { email, id, login, avatar_url } = parsedUserData;
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

    return redirect("/dashboard", 302);
  } catch (e) {
    if (e instanceof Error) {
      responseReturn(`${e.name}: ${e.cause}. ${e.message}. ${e.stack}`, 500);
    }
    if (e instanceof ZodError) {
      responseReturn(`Validation Error: ${e.errors.map((err) => err.message).join(",")}`, 400);
    }
  }

  return redirect("/", 302);
};
