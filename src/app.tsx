import { h, render } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { initStore } from "./store";
import { route, Route } from "./router";
import { KeyValueStore } from "./worker";
import { Root } from "./components/root";

// Client-side starting point
export function run(): void {
  const node = document.getElementById("bootstrap-data");
  if (node && node.textContent) {
    const data = JSON.parse(node.textContent);
    const store = initStore(data);
    const container = document.body;
    const content = container.firstElementChild;
    if (content != null) {
      render(<Root store={store} />, container, content);
    }
  }
}

interface SSRender extends Route {
  html: string;
}

// Used by worker to render page
export async function serverRender(
  path: string,
  kv: KeyValueStore
): Promise<SSRender> {
  const { status, data } = await route(path, kv);
  const store = initStore(data);
  return { status, data, html: renderToString(<Root store={store} />) };
}
