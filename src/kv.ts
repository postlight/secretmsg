export async function writeKv(key: string, val: any) {
  const res = await fetch(`/save/${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(val)
  });
  if (res.ok) return res;
  throw new Error(`KV Write - ${res.status} ${res.statusText}`);
}
