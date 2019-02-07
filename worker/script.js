addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  console.log("Got request", request);
  const response = await fetch(request);
  console.log("Got response", response);
  return response;
}
