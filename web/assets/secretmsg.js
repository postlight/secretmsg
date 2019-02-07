const go = new Go();
WebAssembly.instantiateStreaming(
  fetch("/assets/secretmsg.wasm"),
  go.importObject
).then(result => {
  go.run(result.instance);
  SecretMsg.run();
});
