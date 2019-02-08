import { h, render } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { initStore } from "./store";
import { initRouter } from "./router";
import { Root } from "./components/root";

export function run(path: string) {
  const route = initRouter(path);
  const store = initStore({ page: route.page, pageId: route.id });
  render(<Root store={store} />, document.body);
}

export function htmlString(path: string) {
  const route = initRouter(path);
  const store = initStore({ page: route.page, pageId: route.id });
  return renderToString(<Root store={store} />);
}

export function page(content: string) {
  return `<html>
  <head>
    <title>secretmsg</title>
    <script src="/js/client.js" defer></script>
    <link rel="stylesheet" type="text/css" href="/css/tachyons.min.css">
  </head>
  <body>${content}</body>
</html>`;
}
