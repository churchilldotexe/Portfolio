import { defineAction } from "astro:actions";
import { z } from "zod";

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input, ctx) => {
      console.log("action action action action action");

      const url = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${import.meta.env.CLIENT_ID}`;

      return new Response(null, { status: 302, headers: { Location: url } });
    },
  }),
};
