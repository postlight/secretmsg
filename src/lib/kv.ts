/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyValueStore } from "../worker";
import { MsgEnvelope } from "../store";

// Send encrypted message from client to worker, where it is saved to KV
export async function writeVal(key: string, val: any): Promise<Response> {
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
  const envelope = (await kv.get(key, "json")) as MsgEnvelope;
  if (envelope == null) return null;
  if (envelope.expires !== 0 && envelope.expires < Date.now()) {
    kv.delete(key);
    return null;
  }
  return envelope;
}
