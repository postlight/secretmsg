import { h, VNode } from "preact";
import { Wrapper } from "./wrapper";

export const NotFound = (): VNode => (
  <Wrapper>
    <div class="not-found">
      <h1>Missing message</h1>
      <p>
        If you&apos;re sure this link is correct, there&apos;s a chance this
        message has expired.
      </p>
      <p>
        <a href="/">Write new message &rarr;</a>
      </p>
    </div>
  </Wrapper>
);
