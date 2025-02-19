/// <reference path="../../global.d.ts" />
/// <reference path="../../db/db.d.ts" />
/** @param {import('fastify').FastifyInstance} fastify */
export default async function (fastify, opts) {
  fastify.get("/op", async (req, rep) => {
    return await req.db.getMovieById({id: 1});
  });
  fastify.post("/op", async (req, rep) => {
    return await req.db.createMovie({ title: "poopies" });
  });
}