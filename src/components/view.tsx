import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgEnvelope } from "../store";
import { formatDate, formatExpiration } from "../time";
import { Wrapper } from "./wrapper";
import { LockIcon } from "./icons";

interface Props {
  envelope: MsgEnvelope;
  decrypted?: string;
  decryptError?: string;
  decryptMessage: (
    passphrase: string
  ) => Promise<Pick<SecretState, "decrypted" | "decryptError">>;
  progress: number;
}

interface State {
  passphrase: string;
}

class ViewComp extends Component<Props, State> {
  state = {
    passphrase: ""
  };

  handlePassChange = (e: Event) => {
    this.setState({ passphrase: (e.target as HTMLFormElement).value });
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.decryptMessage(this.state.passphrase);
  };

  render() {
    const { passphrase } = this.state;
    const { decrypted, envelope, progress } = this.props;
    return (
      <Wrapper>
        {decrypted ? (
          <a class="msg-input-label" href="/">
            &larr; Write new message
          </a>
        ) : (
          <form class="decrypt-inputs" onSubmit={this.handleSubmit}>
            <LockIcon class="lock-icon" />
            <div class="pass-group">
              <label class="pass-label" for="pass-input">
                Passphrase
              </label>
              <input
                autofocus
                autocomplete="off"
                type="text"
                id="pass-input"
                value={passphrase}
                onInput={this.handlePassChange}
              />
            </div>
            <div class="submit-group">
              <input
                class="submit-btn btn"
                disabled={passphrase.length < 2}
                type="submit"
                value="Decrypt message"
              />
            </div>
          </form>
        )}
        <div class={`view-msg ${decrypted ? "" : "encrypted"}`}>
          {decrypted ? decrypted : envelope.encrypted}
          {!decrypted && (
            <div
              class="progress-bar"
              style={{ transform: `scaleX(${progress})` }}
            />
          )}
        </div>
        <div class="meta">
          <time class="share-date">{formatDate(envelope.created)}</time>
          <div class="share-expire">{formatExpiration(envelope.expires)}</div>
        </div>
      </Wrapper>
    );
  }
}

export const View = connect<{}, {}, SecretState, Props>(
  ["envelope", "decrypted", "decryptError", "progress"],
  actions
)(ViewComp);
