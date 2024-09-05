import { COOKIES_PROPERTIES } from "@/lib/constants";
import { ratelimit } from "@/server/ratelimitter";
import { verifyAccessToken } from "@/server/use-case/auth/token-use-cases";
import type { APIRoute } from "astro";

// TODO:
// make sure to have a check for your scope params when you receive in case the user change it.
// try REDIS for the in:memory unguessable state or do the http only cookie if you cant for the STATE
// dont forget to remove the state from the HTTP ONLY COOKIES after authentication
// check the database first if the user email/profile is already in the DB if already exist get the Refreshtoken
// if no refresh token and/or invalid refresh token create a new one with a useridentifier (uuid perhaps )
// then write the shortlived to the http only cookie
// find out about the versioning that was mentioned

export const prerender = false;

export const GET: APIRoute = async ({ redirect, locals, cookies, request }): Promise<Response> => {
  const githubUrl = new URL(request.url);
  const code = githubUrl.searchParams.get("code");
  const stateParamsValue = githubUrl.searchParams.get("state");

  // to prevent redirect loop and request spam
  const identifier =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("cf-connecting-ip") ??
    import.meta.env.CLIENT_ID;
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response(
      JSON.stringify({
        message: "Rate Limit reach Please wait for another 10mins",
      }),
      { status: 429 }
    );
  }

  const cookieValue = cookies.get(COOKIES_PROPERTIES.STATE)?.value;
  const verifiedCookie = await verifyAccessToken<{ state: string }>(cookieValue);

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
    return logAndRedirect("invalid verifiedCookie");
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
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  //TODO: zod
  const data = (await response.json()) as unknown as {
    access_token: string;
    token_type: string;
    scope: string;
  };

  //to retry and get the correct scope and access_token
  if (data.scope.toLowerCase() !== "user:email" || !data.access_token) {
    return logAndRedirect("invalid verifiedCookie");
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error(`${userResponse.status}: ${userResponse.statusText}`);
  }

  //TODO: zod
  const userData = (await userResponse.json()) as unknown as {
    email?: string;
    login: string;
    id: number;
    avatar_url: string;
  };

  if (!userData.id) {
    return new Response(
      JSON.stringify({
        message: "Unable to Authenticate the user",
      }),
      { status: 401 }
    );
  }

  const isProd = import.meta.env.PROD;
  const domain = isProd ? "churchillexe.pages.dev" : "";
  cookies.delete(COOKIES_PROPERTIES.STATE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    domain,
  });

  return redirect("/dashboard", 302);
};
