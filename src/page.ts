export function page(content: string, json: string, clientHash?: string) {
  const hash = clientHash ? `.${clientHash}` : "";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>secretmsg</title>
    <script src="/assets/js/triplesec-3.0.27-min.js" defer></script>
    <script src="/assets/js/client${hash}.js" defer></script>
    <script type="application/json" id="bootstrap">${json}</script>
    <link rel="stylesheet" type="text/css" href="/assets/css/secret.css">
  </head>
  <body>${content}</body>
</html>`;
}
