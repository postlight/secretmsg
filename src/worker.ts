import { htmlString, page } from "./app";

addEventListener("fetch", (e: Event) => {
  const fe = (<FetchEvent>e).request ? (e as FetchEvent) : null;
  if (fe) {
    fe.respondWith(handleRequest(fe.request));
  }
});

async function handleRequest(req: Request) {
  return new Response(page(htmlString("/")), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}
