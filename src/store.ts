import createStore, { Store } from "unistore";
import Hashids from "hashids";
import { Page } from "./router";
import { encrypt } from "./crypto";
import { writeKv } from "./kv";

export interface SecretState {
  page: Page;
  pageId?: string;
  envelope?: MsgEnvelope;
  progress: number;
}

interface MsgEnvelope {
  encrypted: string;
  expires: number;
  id: string;
}

let store;
export function initStore(state: Partial<SecretState>) {
  store = createStore<SecretState>({
    page: Page.Index,
    progress: 0,
    ...state
  });
  return store;
}

export type PageUpdater = (page: Page, id?: string) => Partial<SecretState>;

export type MsgSaver = (
  message: string,
  passphrase: string,
  ttlHours: number
) => Promise<Partial<SecretState>>;

interface Actions {
  updatePage: PageUpdater;
  saveMessage: MsgSaver;
}

const hashids = new Hashids(`${Math.random()}`);

export function actions(store: Store<SecretState>): Actions {
  return {
    updatePage(page, id) {
      return { page, pageId: id };
    },

    async saveMessage(message, passphrase, ttlHours) {
      store.setState({ progress: 0 });
      const encrypted = await encrypt(message, passphrase, percent =>
        store.setState({ progress: percent })
      );
      let expires = 0;
      if (ttlHours > 0) {
        const d = new Date();
        d.setHours(d.getHours() + 24);
        expires = d.getTime();
      }
      const envelope = {
        encrypted,
        expires,
        id: hashids.encode(Date.now())
      };

      console.log("ENVELOPE", envelope);

      try {
        await writeKv(envelope.id, envelope);
      } catch (err) {
        // TODO: update error message in store and display it
        console.log(err);
      }

      // TODO: dispatch route update to share page

      return { envelope };
    }
  };
}
