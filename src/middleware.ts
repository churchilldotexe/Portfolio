import { defineMiddleware } from "astro:middleware";
import { getUserId } from "./server/use-case/auth/token-use-cases";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.userId = await getUserId(context.cookies);

  return next();
});
