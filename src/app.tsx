import { h, render } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { initStore } from "./store";
import { initRouter } from "./router";
import { Root } from "./components/root";

export function run(path: string) {
  const route = initRouter(path);
  const store = initStore({ page: route.page, pageId: route.id });
  render(<Root store={store} />, document.body, document.body
    .firstElementChild as Element | undefined);
}

export function htmlString(path: string) {
  const route = initRouter(path);
  const store = initStore({ page: route.page, pageId: route.id });
  return renderToString(<Root store={store} />);
}

export function page(content: string, clientHash?: string) {
  const hash = clientHash ? `.${clientHash}` : "";
  return `<html>
  <head>
    <title>secretmsg</title>
    <script src="/assets/js/client${hash}.js" defer></script>
    <link rel="stylesheet" type="text/css" href="/assets/css/tachyons.4.11.2.min.css">
  </head>
  <body>${content}</body>
</html>`;
}
