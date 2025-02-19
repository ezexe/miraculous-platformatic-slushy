/// <reference path="../../global.d.ts" />
/// <reference path="../../ai/ai.d.ts" />
/** @param {import('fastify').FastifyInstance} fastify */
export default async function (fastify, opts) {
  fastify.get("/ai", async (req, rep) => {
    const opening = await req.ai.prompt({
      prompt: `What is the opening line of "The Joe Rogan Experience"? Put it between brackets, and do not include any additional text or commentary. If there are multiple possibilities, use the correct one.`,
    })

    const matched = /\["?(.*)"]?/g.exec(opening.response)

    req.log.info({ opening, matched })

    return matched[1]
  });
}