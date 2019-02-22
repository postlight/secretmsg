import { h, FunctionalComponent, ComponentChildren } from "preact";

interface Props {
  children?: ComponentChildren;
}

export const Wrapper: FunctionalComponent<Props> = ({ children }) => (
  <div class="wrapper">{children}</div>
);
