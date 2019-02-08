import { h, FunctionalComponent } from "preact";
import { Store } from "unistore";
import { Provider, connect } from "unistore/preact";
import { SecretState } from "../store";
import { Page } from "../router";

interface RootProps {
  store: Store<SecretState>;
}

export const Root: FunctionalComponent<RootProps> = ({ store }) => (
  <Provider store={store}>
    <Content />
  </Provider>
);

const Content = connect<{}, {}, SecretState, Partial<SecretState>>([
  "page",
  "pageId"
])(({ page, pageId }) => {
  switch (page) {
    case Page.Index:
      return <div>home</div>;
    case Page.Share:
      return <div>share {pageId}</div>;
    case Page.View:
      return <div>view {pageId}</div>;
    default:
      return <div>not found</div>;
  }
});
