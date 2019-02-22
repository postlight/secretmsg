import { h, FunctionalComponent } from "preact";
import { formatDate, formatExpiration } from "../time";
import { LockIcon } from "./icons";

interface Props {
  id: string;
  timestamp: number;
  expireTime: number;
}

export const ShareOverlay: FunctionalComponent<Props> = ({
  id,
  timestamp,
  expireTime
}) => (
  <div class="share-overlay">
    <LockIcon class="lock-icon" />
    <div class="share-info">
      <time class="share-date">{formatDate(timestamp)}</time>
      <a class="share-link" href={`/${id}`}>{`secretmsg.app/${id}`}</a>
      <div class="share-expire">{formatExpiration(expireTime)}</div>
    </div>
    <button class="copy-btn btn">Copy link</button>
  </div>
);
