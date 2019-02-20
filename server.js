// ------------------
// Static file server
// Worker needs to fetch static assets. In production they come from an
// s3 bucket. Locally this server is the origin.
const fastify = require("fastify");
const fastifyStatic = require("fastify-static");

const staticPort = 3333;
const f = fastify();
f.register(fastifyStatic, { root: __dirname, serve: false });
f.get("/assets/css/*", (req, reply) => {
  reply.sendFile(path.join("css", path.basename(req.raw.url)));
});
f.get("/assets/js/*", (req, reply) => {
  reply.sendFile(path.join("dist", path.basename(req.raw.url)));
});
f.listen(staticPort, (err, address) => {
  if (err) throw err;
});

// ------------
// Local worker
// Requests are handled by a simple http server then passed into the worker,
// processed, and passed back out.
const fs = require("fs");
const path = require("path");
const http = require("http");
const getRawBody = require("raw-body");
const Cloudworker = require("@dollarshaveclub/cloudworker");

// Bindings are global variables available in the worker script
const bindings = {
  CLIENT_HASH: null,
  MSG_STORE: new Cloudworker.KeyValueStore()
};
const workerPort = 3030;

const server = http.createServer((req, res) => {
  const script = fs.readFileSync(path.join("dist", "worker.js"), "utf8");
  parseBody(req).then(body => {
    const workerReq = new Cloudworker.Request(
      `http://localhost:${staticPort}${req.url}`,
      {
        method: req.method,
        body
      }
    );
    const worker = new Cloudworker(script, { bindings });
    worker.dispatch(workerReq).then(workerRes => {
      res.statusCode = workerRes.status;
      workerRes.headers.forEach((val, key) => res.setHeader(key, val));
      workerRes.text().then(body => {
        res.end(body);
      });
    });
  });
});
server.listen(workerPort, err => {
  if (err) {
    return console.log("Server error", err);
  }
  console.log(`Dev server: http://localhost:${workerPort}`);
});

async function parseBody(req) {
  if (req.method === "GET") return;
  try {
    const buff = await getRawBody(req);
    return buff.toString("utf8");
  } catch (err) {
    console.log("Error parsing body", err.message);
  }
}
