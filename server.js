const fs = require("fs");
const path = require("path");
const http = require("http");
const getRawBody = require("raw-body");
const serveStatic = require("serve-static");
const Cloudworker = require("@dollarshaveclub/cloudworker");

// ------------------
// Static file server
// Worker needs to fetch static assets. In production they come from an
// s3 bucket. Locally this server is the origin.
const staticPort = 3333;
const handler = serveStatic(__dirname);
http
  .createServer((req, res) => {
    if (!req.url.includes("/assets")) {
      return staticNotFound(res);
    }
    req.url = req.url.replace("/assets", "");
    if (fs.existsSync(path.join("dist", path.basename(req.url)))) {
      req.url = req.url.replace("/js", "/dist");
    }
    handler(req, res, err => {
      if (err) {
        res.statusCode = err.status || 500;
        res.end(err.stack);
      }
      staticNotFound(res);
    });
  })
  .listen(staticPort);

function staticNotFound(res) {
  res.statusCode = 404;
  res.end("Not found");
}

// ------------
// Local worker
// Requests are handled by a simple http server then passed into the worker,
// processed, and passed back out.

// Bindings are global variables available in the worker script. You can find the production
// values in worker-metadata.json
const bindings = {
  CLIENT_HASH: null,
  MSG_STORE: new Cloudworker.KeyValueStore()
};
const workerPort = 3030;
const script = fs.readFileSync(path.join("dist", "worker.js"), "utf8");
const worker = new Cloudworker(script, { bindings });
http
  .createServer(async (req, res) => {
    const body = await parseBody(req);
    const workerReq = new Cloudworker.Request(
      `http://localhost:${staticPort}${req.url}`,
      {
        method: req.method,
        body
      }
    );
    const workerRes = await worker.dispatch(workerReq);
    res.writeHead(
      workerRes.status,
      workerRes.statusText,
      workerRes.headers.raw()
    );
    workerRes.buffer().then(buff => {
      res.write(buff);
      res.end();
    });
  })
  .listen(workerPort, err => {
    if (err) {
      return console.log("Server error", err);
    }
    console.log(`Dev server: http://localhost:${workerPort}`);
  });

async function parseBody(req) {
  if (req.method === "GET") return;
  try {
    return await getRawBody(req);
  } catch (err) {
    console.log("Error parsing body", err.message);
  }
}
