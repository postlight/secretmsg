import { h, render } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { initStore } from "./store";
import { route } from "./router";
import { KeyValueStore } from "./worker";
import { Root } from "./components/root";

export function run(path: string) {
  const node = document.getElementById("bootstrap");
  if (node && node.textContent) {
    const data = JSON.parse(node.textContent);
    const store = initStore(data);
    render(<Root store={store} />, document.body, document.body
      .firstElementChild as Element | undefined);
  }
}

export async function htmlString(path: string, kv: KeyValueStore) {
  const { status, data } = await route(path, kv);
  const store = initStore(data);
  return { status, data, html: renderToString(<Root store={store} />) };
}
