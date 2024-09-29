import { COOKIES_OPTIONS, COOKIES_PROPERTIES } from "@/lib/constants";
import { ratelimit } from "@/server/ratelimitter";
import { signAccessToken } from "@/server/use-case/auth/token-use-cases";
import type { APIRoute } from "astro";
import { randomBytes } from "node:crypto";

export const prerender = false;

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
 */

export const GET: APIRoute = async ({ redirect, cookies, request }): Promise<Response> => {
  const clientId = import.meta.env.CLIENT_ID;

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

    const state = randomBytes(32).toString("hex");
    const jWTstate = await signAccessToken({ state });
    cookies.set(COOKIES_PROPERTIES.STATE, jWTstate, COOKIES_OPTIONS);

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
