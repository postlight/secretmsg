import createStore, { Store } from "unistore";
import Hashids from "hashids";
import { Page } from "./router";
import { encrypt } from "./crypto";
import { writeVal } from "./kv";

export interface SecretState {
  page: Page;
  pageId?: string;
  envelope?: MsgEnvelope;
  progress: number;
  saveError?: string;
}

export interface MsgEnvelope {
  created: number;
  encrypted: string;
  expires: number;
  id: string;
}

let store;
export function initStore(state: Partial<SecretState>) {
  store = createStore<SecretState>({
    page: Page.Write,
    progress: 0,
    ...state
  });
  return store;
}

export type MsgSaver = (
  message: string,
  passphrase: string,
  ttlHours: number
) => Promise<Partial<SecretState>>;

interface Actions {
  saveMessage: MsgSaver;
  clearMessage: () => void;
}

const hashids = new Hashids(`${Math.random()}`);

export function actions(store: Store<SecretState>): Actions {
  return {
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
        created: Date.now(),
        encrypted,
        expires,
        id: hashids.encode(Date.now())
      };

      try {
        await writeVal(envelope.id, envelope);
      } catch (err) {
        console.error(err);
        return {
          saveError:
            "There was a problem saving your message, please try again."
        };
      }
      return { envelope };
    },

    clearMessage() {
      store.setState({
        envelope: undefined,
        progress: 0,
        saveError: undefined
      });
    }
  };
}
