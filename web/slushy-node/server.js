import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'
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
    constraints: { host: 'example.com' },
    preCompressed: true,
    
  })

  // Define routes
  fastify.get('/latest', async (req, reply) => {
    return reply.sendFile('latests.json')
  })

  fastify.get("/download", async (req, rep) => {
    const { ext } = req.query;
    const fileName = `Chameleon.${ext || "7z"}`;
    const filePath = join(__dirname, 'public', fileName);
    // 
    const stats = await fs.promises.stat(filePath);
    // Set response headers
    rep.header("Content-Type", "application/octet-stream");
    rep.header("Content-Length", stats.size);
    rep.header("Content-Disposition", `attachment; filename=${fileName}`);
    // Create a read stream for the file and send it
    return rep.send(fs.createReadStream(filePath));
  });

  fastify.get('/file', async (req, rep) => {
    const { ext } = req.query;
    return rep.sendFile(`Chameleon.${ext || "7z"}`);
  })

  // Counter endpoint using request counter closure
  let count = 0
  fastify.get('/counter', async (req, reply) => {
    return { content: `request count: ${count++}` }
  })

  return fastify
}