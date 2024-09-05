export const prerender = false;

import { state } from "@/lib/utils";
import { ratelimit } from "@/server/ratelimitter";
import { signAccessToken } from "@/server/use-case/auth/token-use-cases";
import type { APIRoute } from "astro";

/**
 * Creating an State for the user and signing it to Cookies
 *
 * This endpoint supports  GET method and performs the following actions:
 * 1. generate a crypto randombytes for unguessable string for security purposes
 * 2. Generates a new access token for the state parameters and sets it as an HTTP-only cookie
 * 3. Redirects to the github 0auth authorization
 *
 * Note: This endpoint has side effects (sets cookies) regardless of the HTTP method used.
 * The GET method is maintained for compatibility with redirects and simple navigation.
 *
 * @param {cookies,locals,redirect} - redirect for redirect, locals for env variable for cloudflare and cookies for signing HTTP-only cookie
 * @returns {Promise<Response>} - Redirects to login on failure, or to the callback URL on success
 */

export const GET: APIRoute = async ({ redirect, locals, cookies, request }): Promise<Response> => {
  const { env } = locals.runtime;

  const clientId = env.CLIENT_ID ?? import.meta.env.CLIENT_ID;

  try {
    const identifier =
      request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip") ?? clientId;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({
          message: "Rate Limit reach Please wait for another 10mins",
        }),
        { status: 429 }
      );
    }

    const jWTstate = await signAccessToken({ state });

    const isProd = env.PROD ?? import.meta.env.PROD;
    const domain = isProd ? "churchillexe.pages.dev" : "";
    cookies.set("state", jWTstate, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
      secure: isProd,
      domain,
    });

    const url = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${clientId}&state=${state}`;

    return redirect(url, 302);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return new Response(JSON.stringify({ error: `${e.name}:${e.cause}. ${e.message} ` }), {
        status: 500,
      });
    }
  }

  return redirect("/dashboard", 302);
};
