export const prerender = false;

import { COOKIES_OPTIONS, COOKIES_PROPERTIES } from "@/lib/constants";
import { ratelimit } from "@/server/ratelimitter";
import { verifyAccessToken } from "@/server/use-case/auth/token-use-cases";
import type { APIRoute } from "astro";
import { z } from "zod";

// TODO:
// check the database first if the user email/profile is already in the DB if already exist get the Refreshtoken
// if no refresh token and/or invalid refresh token create a new one with a useridentifier (uuid perhaps )
// then write the shortlived to the http only cookie
// find out about the versioning that was mentioned

const accessTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  scope: z.string().min(1),
});

const responseReturn = (message: string, status: ResponseInit["status"]) => {
  return new Response(
    JSON.stringify({
      message: message,
    }),
    { status }
  );
};

export const GET: APIRoute = async ({ redirect, locals, cookies, request }): Promise<Response> => {
  const githubUrl = new URL(request.url);
  const code = githubUrl.searchParams.get("code");
  const stateParamsValue = githubUrl.searchParams.get("state");

  // to prevent redirect loop and request spam
  const identifier = request.headers.get("X-Forwarded-For") ?? import.meta.env.CLIENT_ID;

  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return responseReturn("Rate Limit reach Please wait for another 10mins", 429);
  }

  const cookieValue = cookies.get(COOKIES_PROPERTIES.STATE)?.value;
  const verifiedCookie = await verifyAccessToken<{ state: string }>(cookieValue);

  // for errors and redirect
  const logAndRedirect = (errorLogMessage: string): Response => {
    console.error(errorLogMessage);
    return redirect("/api/redirect", 302);
  };

  // cookie is invalid(expired or mismatch)
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

  //TODO: zod
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

  //TODO: zod
  const userData = (await userResponse.json()) as unknown as {
    email?: string;
    login: string;
    id: number;
    avatar_url?: string;
  };

  if (!userData.id) {
    return responseReturn("Unable to Authenticate the user", 401);
  }

  cookies.delete(COOKIES_PROPERTIES.STATE, COOKIES_OPTIONS);

  return redirect("/dashboard", 302);
};
