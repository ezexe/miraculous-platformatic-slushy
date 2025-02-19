import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function build() {
  const fastify = Fastify({
    logger: false
  })

  // Register static file serving
  await fastify.register(fastifyStatic, {
    root: join(__dirname, 'public'),
    prefix: '/public/',
    constraints: { host: 'example.com' }
  })

  // Define routes
  fastify.get('/another/path', async (req, reply) => {
    return reply.sendFile('myHtml.html')
  })

  fastify.get('/path/with/different/root', async (req, reply) => {
    return reply.sendFile('myHtml.html', join(__dirname, 'build'))
  })

  fastify.get('/path/with-no-cache', async (req, reply) => {
    return reply.sendFile('myHtml.html', { cacheControl: false })
  })

  // Counter endpoint using request counter closure
  let count = 0
  fastify.get('/counter', async (req, reply) => {
    return { content: `request count: ${count++}` }
  })

  return fastify
}