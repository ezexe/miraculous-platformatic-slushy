import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @param {import('fastify').FastifyInstance} fastify */
export default async function (fastify, opts) {
  fastify.get("/foo", async (request, reply) => {
    return { bar: fastify.baz };
  });

  fastify.get('/yo', async (req, rep) => {
    const name = req.query.name || 'Dude'
    return rep.html`<h1>YO ${name}</h1>`
  })

  fastify.get('/yo/:name', async (req, reply) => {
    const userInfo = await getUserInfoPromise(req.params.name)
    return reply.html`
        <div>
          Welcome, ${req.params.name}.
          <br /><br />
  
          User information:
          <br />
          Age: ${userInfo.age}
          <br />
          Location: ${userInfo.location}
          <br />
  
          <!-- Promises are resolved automatically -->
          !${getUserInfoPromise(req.params.name)}
          <br />
  
          <!-- Streams are supported -->
          <div>
            File content:
            <br />
            !${createReadStream('/Users/dev/gritz/miraculous/web/node/public/latests.json')}
          </div>
        </div>
    `
  })
}

async function getUserInfoPromise(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ age: 33, location: "Kochaav Yaakov", name });
    }, 100);
  });
}