import { htmlString, page } from "./app";

// Env var bound to worker during deploy
declare const CLIENT_HASH: string | undefined;

addEventListener("fetch", (e: Event) => {
  const fe = (<FetchEvent>e).request ? (e as FetchEvent) : null;
  if (fe) {
    fe.respondWith(handleRequest(fe.request));
  }
});

async function handleRequest(req: Request) {
  const url = new URL(req.url);

  // First, check if request is for static asset
  const segments = url.pathname.split("/");
  if (segments[1] && segments[1] === "assets") {
    return fetch(req);
  }

  // If not, render page
  return new Response(page(htmlString(url.pathname), CLIENT_HASH), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}
