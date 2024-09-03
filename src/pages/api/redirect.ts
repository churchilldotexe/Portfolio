import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ redirect, locals }) => {
  const { env } = locals.runtime;

  const clientId = env.CLIENT_ID ?? import.meta.env.CLIENT_ID;

  const url = `https://github.com/login/oauth/authorize?scope=user:email,read:user&client_id=${clientId}&state=imAstateOfYours`;

  // http://localhost:4321/?code=0ceb3578664246530667&state=imAstateOfYours

  return redirect(url, 302);
};
