const path = require("path");
const fastify = require("fastify");
const fastifyStatic = require("fastify-static");
const app = require("./dist/app");

const f = fastify({ logger: true });
f.register(fastifyStatic, { root: __dirname, serve: false });
f.get("/css/*", (req, reply) => {
  reply.sendFile(req.raw.url);
});
f.get("/js/*", (req, reply) => {
  console.log("JS >", path.join("dist", path.basename(req.raw.url)));
  reply.sendFile(path.join("dist", path.basename(req.raw.url)));
});
f.get("*", async (req, reply) => {
  console.log("CSS and JS calls here?", req.raw.url);
  reply.type("text/html; charset=utf-8").code(200);
  return app.page(app.htmlString("/"));
});
f.listen(3030, (err, address) => {
  if (err) throw err;
});
