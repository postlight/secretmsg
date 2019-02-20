import { h, FunctionalComponent } from "preact";
import { Store } from "unistore";
import { Provider, connect } from "unistore/preact";
import { SecretState } from "../store";
import { Page } from "../router";
import { Index } from "./index";

interface RootProps {
  store: Store<SecretState>;
}

export const Root: FunctionalComponent<RootProps> = ({ store }) => (
  <Provider store={store}>
    <Content />
  </Provider>
);

const Content = connect<{}, {}, SecretState, SecretState>(["page", "pageId"])(
  ({ page, pageId }) => {
    const routes = {
      [Page.Index]: <Index />,
      [Page.Share]: <div>share {pageId}</div>,
      [Page.View]: <div>share {pageId}</div>,
      [Page.NotFound]: <div>not found</div>
    };
    return <div class="bg-black-05 flex-auto">{routes[page]}</div>;
  }
);
