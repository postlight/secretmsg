import { KeyValueStore } from "./worker";
import { MsgEnvelope } from "./store";

// Send encrypted message from client to worker, where it is saved to KV
export async function writeVal(key: string, val: any) {
  const res = await fetch(`/save/${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(val)
  });
  if (res.ok) return res;
  throw new Error(`KV write error - ${res.status} ${res.statusText}`);
}

// Message is retrieved directly from KV in the worker
export async function getMessage(
  kv: KeyValueStore,
  key: string
): Promise<MsgEnvelope | null> {
  return (await kv.get(key, "json")) as MsgEnvelope;
}
