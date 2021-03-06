interface PageInit {
  title: string;
  content: string;
  scripts?: string[];
  stylesheets?: string[];
  json?: string;
}

export function page({
  title,
  content,
  scripts = [],
  stylesheets = [],
  json = "",
}: PageInit): string {
  const scriptTags = scripts
    .map((script) => `<script src="/assets/${script}" defer></script>`)
    .join("\n");
  const linkTags = stylesheets
    .map(
      (sheet) =>
        `<link rel="stylesheet" type="text/css" href="/assets/${sheet}">`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="secretmsg v1.0.1 - share encrypted messages"/>
    <title>${title}</title>
    <script src="/assets/js/triplesec-3.0.27-min.js" defer></script>
    ${scriptTags}
    <script type="application/json" id="bootstrap-data">${json}</script>
    ${linkTags}
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GJ9GC16D79"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GJ9GC16D79');
    </script>
  </head>
  <body>${content}</body>
</html>`;
}
