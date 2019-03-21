import { page } from "./page";
import { match } from "./lib/request-match";
import { serverRender } from "./app";

// Worker bindings defined in metadata via build or env vars
/* eslint-disable @typescript-eslint/ban-types */
declare const JS_FILES: string | undefined;
declare const CSS_FILES: string | undefined;
declare const MSG_STORE: KeyValueStore | undefined;
type ValidType = "text" | "json" | "arrayBuffer" | "stream";
export declare class KeyValueStore {
  public constructor();
  public get(
    key: string,
    type?: ValidType
  ): Promise<string | ArrayBuffer | Object | ReadableStream>;
  public put(
    key: string,
    value: string | ReadableStream | ArrayBuffer | FormData
  ): Promise<undefined>;
  public delete(key: string): Promise<undefined>;
}
/* eslint-enable @typescript-eslint/ban-types */

// CF Worker's version of CacheStorage is a little different
interface CfCacheStorage extends CacheStorage {
  default: CacheStorage;
  put: (request: Request, response: Response) => void;
}

// Handle all requests hitting the worker
addEventListener("fetch", (e: Event) => {
  const fe = e as FetchEvent;
  fe.respondWith(handleFetch(fe.request));
});

async function handleFetch(request: Request): Promise<Response> {
  if (MSG_STORE == null) {
    return new Response("No KV store bound to worker", { status: 500 });
  }

  // TODO: wrap individual routes with try catch

  // Check if request is for static asset. If so, send request on to origin,
  // then add a cache header to the response.
  const staticRoute = match(request, "get", "/assets/*");
  if (staticRoute) {
    try {
      const assetRes = await fetch(request);
      const response = new Response(assetRes.body, assetRes);
      response.headers.set("cache-control", "public, max-age=31536000");
      return response;
    } catch (err) {
      return errorResponse(err, "Problems serving static assets");
    }
  }

  // Check for favicon request and fetch from static assets
  const faviconRoute = match(request, "get", "/favicon.ico");
  if (faviconRoute) {
    faviconRoute.url.pathname = "/assets/images/favicon.ico";
    return fetch(faviconRoute.url.toString());
  }

  // Check if saving message -- /save/:key
  const saveMsgRoute = match(request, "POST", "/save/:key");
  if (saveMsgRoute) {
    try {
      const data = await request.text();
      await MSG_STORE.put(saveMsgRoute.params.key, data);
      return new Response("OK");
    } catch (err) {
      return new Response("Error in post data", { status: 400 });
    }
  }

  // Render page
  try {
    const cache = (caches as CfCacheStorage).default;
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    let scripts;
    let stylesheets;
    const url = new URL(request.url);
    const { status, data, html } = await serverRender(url.pathname, MSG_STORE);
    if (JS_FILES) {
      scripts = JS_FILES.split(" ");
    }
    if (CSS_FILES) {
      stylesheets = CSS_FILES.split(" ");
    }
    const renderedPage = page({
      title: "secretmsg",
      content: html,
      scripts,
      stylesheets,
      json: JSON.stringify(data)
    });
    const response = new Response(renderedPage, {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
    (cache as CfCacheStorage).put(request, response);
    return response;
  } catch (err) {
    return errorResponse(err, "Page rendering error");
  }
}

function errorResponse(statusText: string, msg?: string): Response {
  return new Response(msg || "Internal Server Error", {
    status: 500,
    statusText
  });
}
