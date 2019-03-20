import { h, FunctionalComponent, ComponentChildren, VNode } from "preact";

interface Props {
  children?: ComponentChildren;
}

export const Wrapper: FunctionalComponent<Props> = ({ children }): VNode => (
  <div>
    <div class="wrapper">{children}</div>
    <footer class="footer">
      <p>A micro project from your friends at</p>
      <a href="https://postlight.com/labs">
        <img
          id="logo"
          src="/assets/images/postlight-labs.gif"
          alt="Postlight Labs"
          width={204}
          height={45}
        />
      </a>
    </footer>
  </div>
);
