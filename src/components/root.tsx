import { h, FunctionalComponent, VNode } from "preact";
import { Store } from "unistore";
import { Provider, connect } from "unistore/preact";
import { SecretState } from "../store";
import { Page } from "../router";
import { Write } from "./write";
import { View } from "./view";
import { NotFound } from "./not-found";
import "./app.css";

interface RootProps {
  store: Store<SecretState>;
}

export const Root: FunctionalComponent<RootProps> = ({ store }): VNode => (
  <Provider store={store}>
    <Content />
  </Provider>
);

const routes = {
  [Page.Write]: <Write />,
  [Page.View]: <View />,
  [Page.NotFound]: <NotFound />
};

const Content = connect<{}, {}, SecretState, SecretState>(["page"])(
  ({ page }) => routes[page]
);
