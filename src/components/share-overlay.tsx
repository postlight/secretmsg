import { h, FunctionalComponent, VNode } from "preact";
import * as copy from "copy-to-clipboard";
import { formatDate, formatExpiration } from "../lib/time";
import { LockIcon } from "./icons";

interface Props {
  id: string;
  timestamp: number;
  expireTime: number;
}

export const ShareOverlay: FunctionalComponent<Props> = ({
  id,
  timestamp,
  expireTime,
}): VNode => (
  <div class="share-overlay">
    <LockIcon class="lock-icon" />
    <div class="share-info">
      <time class="share-date">{formatDate(timestamp)}</time>
      <a
        class="share-link"
        href={`/${id}`}
        onMouseDown={() => gtag("event", "share_link")}
      >{`secretmsg.app/${id}`}</a>
      <div class="share-expire">{formatExpiration(expireTime)}</div>
    </div>
    <button
      class="copy-btn btn"
      onClick={copier(`https://secretmsg.app/${id}`)}
    >
      Copy link
    </button>
  </div>
);

function copier(link: string): (e: Event) => void {
  return (e: Event) => {
    e.preventDefault();
    gtag("event", "copy_link");
    copy(link);
  };
}
