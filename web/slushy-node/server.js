import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function build() {
  const fastify = Fastify({
    logger: false,
  });

  // Register static file serving
  await fastify.register(fastifyStatic, {
    root: join(__dirname, "public"),
    prefix: "/public/",
    constraints: { host: "example.com" },
    preCompressed: true,
  });

  // Define routes
  fastify.get("/example", async (req, rep) => {
    return rep.sendFile("example.json");
  });
  //
  fastify.get("/download/:filename", async (req, rep) => {
    const fileName = req.params.filename;
    const filePath = join(__dirname, "public", fileName);
    // Set response headers
    rep.header("Content-Type", "application/octet-stream");
    rep.header("Content-Length", (await fs.promises.stat(filePath)).size);
    rep.header("Content-Disposition", `attachment; filename=${fileName}`);
    // Create a read stream for the file and send it
    return rep.send(fs.createReadStream(filePath));
  });
  //
  fastify.get("/file/:filename", async (req, rep) => {
    return rep.sendFile(req.params.filename);
  });
  //
  fastify.get("/health", async (req, reply) => {
    return `∞`;
  });

  return fastify;
}
