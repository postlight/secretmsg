export function page(content: string, json: string, clientHash?: string) {
  const hash = clientHash ? `.${clientHash}` : "";
  return `<html>
  <head>
    <title>secretmsg</title>
    <script src="/assets/js/triplesec-3.0.27-min.js" defer></script>
    <script src="/assets/js/client${hash}.js" defer></script>
    <script type="application/json" id="bootstrap">${json}</script>
    <link rel="stylesheet" type="text/css" href="/assets/css/tachyons.4.11.2.min.css">
  </head>
  <body class="flex">${content}</body>
</html>`;
}
