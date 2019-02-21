import { h, FunctionalComponent } from "preact";
import { LockIcon } from "./icons";

interface Props {
  id?: string;
}

export const ShareOverlay: FunctionalComponent<Props> = ({ id }) => (
  <div class="absolute absolute--fill bg-black-60 br2 flex items-center justify-center">
    <LockIcon scale={1.6} class="mr3" />
    <div class="white">
      <time class="db mb1 f5">TODO: Feb 21</time>
      <a
        class="db link underline-hover light-blue f4 mb1"
        href={`/${id}`}
      >{`secretmsg.app/${id}`}</a>
      <div class="f6 i light-gray">TODO: Never expires</div>
    </div>
    <button class="db ml5 pv2 ph3 button-reset bn br2 bg-black hover-bg-white white hover-black fw5 f6">
      Copy link
    </button>
  </div>
);
