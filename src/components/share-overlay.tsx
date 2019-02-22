import { h, FunctionalComponent } from "preact";
import { LockIcon } from "./icons";

interface Props {
  id?: string;
}

export const ShareOverlay: FunctionalComponent<Props> = ({ id }) => (
  <div class="share-overlay">
    <LockIcon class="lock-icon" />
    <div class="share-info">
      <time class="share-date">TODO: Feb 21</time>
      <a class="share-link" href={`/${id}`}>{`secretmsg.app/${id}`}</a>
      <div class="share-expire">TODO: Never expires</div>
    </div>
    <button class="copy-btn btn">Copy link</button>
  </div>
);
