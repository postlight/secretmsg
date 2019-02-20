import { h, FunctionalComponent, ComponentChildren } from "preact";

interface Props {
  children?: ComponentChildren;
}

export const Wrapper: FunctionalComponent<Props> = ({ children }) => (
  <div class="center mw7 mw-none-m mt4 mt0-m sans-serif">{children}</div>
);
