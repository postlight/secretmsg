import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgEnvelope } from "../store";
import { Wrapper } from "./wrapper";

interface Props {
  envelope: MsgEnvelope;
  decrypted?: string;
  decryptError?: string;
  decryptMessage: (
    passphrase: string
  ) => Promise<Pick<SecretState, "decrypted" | "decryptError">>;
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
    const { decrypted, envelope } = this.props;
    return (
      <Wrapper>
        {decrypted ? (
          <a class="msg-input-label" href="/">
            &larr; Write new message
          </a>
        ) : (
          <form class="decrypt-inputs" onSubmit={this.handleSubmit}>
            <div class="pass-group">
              <label class="pass-label" for="pass-input">
                Passphrase
              </label>
              <input
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
        </div>
        <div class="meta">
          <time class="share-date">TODO: Feb 21</time>
          <div class="share-expire">TODO: Never expires</div>
        </div>
      </Wrapper>
    );
  }
}

export const View = connect<{}, {}, SecretState, Props>(
  ["envelope", "decrypted", "decryptError"],
  actions
)(ViewComp);
