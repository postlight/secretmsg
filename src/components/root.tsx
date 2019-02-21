import { h, FunctionalComponent } from "preact";
import { Store } from "unistore";
import { Provider, connect } from "unistore/preact";
import { SecretState } from "../store";
import { Page } from "../router";
import { Write } from "./write";

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
      [Page.Write]: <Write />,
      [Page.Share]: <div>share {pageId}</div>,
      [Page.View]: <div>share {pageId}</div>,
      [Page.NotFound]: <div>not found</div>
    };
    return <div class="bg-black-05 flex-auto">{routes[page]}</div>;
  }
);
