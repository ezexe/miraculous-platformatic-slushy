/** @param {import('fastify').FastifyInstance} fastify */
export default async function (fastify, opts) {
  fastify.decorate("baz", "shmukaz");

  await fastify.register(import("fastify-html"), { async: true });

  fastify.addLayout(function (inner, reply) {
    return fastify.html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/htmx.org@1.9.5"></script>
        </head>
        <body>
          <!-- Prefix expressions with ! if they contain safe HTML or other html tags -->
          !${inner}
        </body>
      </html>
    `
  }, { skipOnHeader: 'hx-request' })
}
