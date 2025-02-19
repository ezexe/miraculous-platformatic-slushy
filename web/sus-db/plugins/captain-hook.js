/// <reference path="../global.d.ts" />
/// <reference path="../ai/ai.d.ts" />
/** @param {import('fastify').FastifyInstance} fastify */
export default async function (fastify, opts) {
  fastify.platformatic.addEntityHooks("movie", {
    save: async (og, op) => {
      op.input.aicomments = (await op.ctx.reply.request.ai.prompt({
        prompt: `What is your comment on a new movie titled "${op.input.title}"? Put it between brackets, and do not include any additional text or commentary. If there are multiple possibilities, use the correct one.`,
      })).response;
      return og(op);
    },
  });
}
