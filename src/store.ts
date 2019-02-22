import createStore, { Store } from "unistore";
import Hashids from "hashids";
import { Page } from "./router";
import { encrypt, decrypt } from "./crypto";
import { writeVal } from "./kv";

export interface SecretState {
  page: Page;
  pageId?: string;
  envelope?: MsgEnvelope;
  progress: number;
  saveError?: string;
  decrypted?: string;
  decryptError?: string;
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

export interface MsgPayload {
  message: string;
  passphrase: string;
  ttlHours: number;
}

interface Actions {
  saveMessage: (
    state: SecretState,
    payload: MsgPayload
  ) => Promise<Pick<SecretState, "envelope" | "saveError">>;
  decryptMessage: (
    state: SecretState,
    passphrase: string
  ) => Promise<Pick<SecretState, "decrypted" | "decryptError">>;
  clearMessage: () => void;
}

const hashids = new Hashids(`${Math.random()}`);

export function actions(store: Store<SecretState>): Actions {
  return {
    async saveMessage(state, { message, passphrase, ttlHours }) {
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

    async decryptMessage(state, passphrase) {
      if (!state.envelope) {
        return { decrypted: undefined };
      }
      store.setState({ progress: 0 });
      try {
        const decrypted = await decrypt(
          state.envelope.encrypted,
          passphrase,
          percent => store.setState({ progress: percent })
        );
        return { decrypted };
      } catch (err) {
        console.error(err);
        return { decryptError: "Wrong passphrase" };
      }
    },

    clearMessage() {
      return {
        envelope: undefined,
        progress: 0,
        saveError: undefined
      };
    }
  };
}
