import { SecretState } from "./store";
import { KeyValueStore } from "./worker";
import { getMessage } from "./lib/kv";

export enum Page {
  Write = "WRITE",
  View = "VIEW",
  NotFound = "NOTFOUND"
}

export interface Route {
  status: number;
  data: Pick<SecretState, "page" | "pageId" | "envelope">;
}

export async function route(path: string, kv: KeyValueStore): Promise<Route> {
  const segment = path.split("/");
  if (segment[1] && segment[1].length > 0) {
    // View /:id
    const envelope = await getMessage(kv, segment[1]);
    if (envelope != null) {
      return {
        status: 200,
        data: {
          page: Page.View,
          pageId: segment[1],
          envelope
        }
      };
    }
    // No message found
    return {
      status: 404,
      data: { page: Page.NotFound }
    };
  } else if (segment[1] == "") {
    // Home /
    return {
      status: 200,
      data: { page: Page.Write }
    };
  }

  return {
    status: 404,
    data: { page: Page.NotFound }
  };
}
