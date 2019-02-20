import { htmlString, page } from "./app";

addEventListener("fetch", (e: Event) => {
  const fe = (<FetchEvent>e).request ? (e as FetchEvent) : null;
  if (fe) {
    fe.respondWith(handleRequest(fe.request));
  }
});

async function handleRequest(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  // First, check if request is for static asset -- /assets/js/client.js
  if (segments[1] && segments[1] === "assets") {
    return fetch(req);
  }

  // Then check if saving message -- /save/:key
  if (
    segments[1] &&
    segments[2] &&
    segments[1] === "save" &&
    req.method === "POST"
  ) {
    const key = segments[2];
    try {
      const data = await req.text();
      await MSG_STORE.put(key, data);
      return new Response("OK");
    } catch (err) {
      return new Response("Error in post data", { status: 400 });
    }
  }

  // If not, render page
  return new Response(page(htmlString(url.pathname), CLIENT_HASH), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}

declare const CLIENT_HASH: string | undefined;
declare const MSG_STORE: KeyValueStore;
type ValidType = "text" | "json" | "arrayBuffer" | "stream";
declare class KeyValueStore {
  constructor();
  get(
    key: string,
    type?: ValidType
  ): Promise<string | ArrayBuffer | Object | ReadableStream>;
  put(
    key: string,
    value: string | ReadableStream | ArrayBuffer | FormData
  ): Promise<undefined>;
  delete(key: string): Promise<undefined>;
}
