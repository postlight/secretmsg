import createStore from "unistore";
import { Page } from "./router";

export type SecretState = {
  page: Page;
  pageId?: string;
};

let store;
export function initStore(state: Partial<SecretState>) {
  store = createStore<SecretState>({
    page: Page.Index,
    ...state
  });
  return store;
}

export function updatePage(page: Page, id?: string): Partial<SecretState> {
  return { page, pageId: id };
}
