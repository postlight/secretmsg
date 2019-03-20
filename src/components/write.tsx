import { h, Component, ComponentChild } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgPayload, MsgEnvelope } from "../store";
import { Wrapper } from "./wrapper";
import { EncryptInputs } from "./encrypt-inputs";
import { ShareOverlay } from "./share-overlay";

interface Props {
  saveMessage: (payload: MsgPayload) => void;
  clearMessage: () => void;
  envelope?: MsgEnvelope;
  progress: number;
}

interface State {
  message: string;
  passphrase: string;
  expiration: number;
}

class WriteComp extends Component<Props, State> {
  public readonly state = {
    message: "",
    passphrase: "",
    expiration: 0
  };

  private handleInput = (e: Event) => {
    if (e.target) {
      this.setState({ message: (e.target as HTMLFormElement).value });
    }
  };

  private handlePassChange = (passphrase: string) => {
    this.setState({ passphrase });
  };

  private handleExpireChange = (expiration: number) => {
    this.setState({ expiration });
  };

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.saveMessage({
      message: this.state.message,
      passphrase: this.state.passphrase,
      ttlHours: this.state.expiration
    });
  };

  private handleClear = (e: Event) => {
    e.preventDefault();
    this.setState({ message: "", passphrase: "", expiration: 0 });
    this.props.clearMessage();
  };

  public render(): ComponentChild {
    const { envelope, progress } = this.props;
    const { message, passphrase, expiration } = this.state;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <label class="msg-input-label" for="msg-input">
            {!envelope ? (
              "Message"
            ) : (
              <a href="/" onClick={this.handleClear}>
                &larr; Write new message
              </a>
            )}
          </label>
          <div class="write-group">
            <textarea
              autofocus
              disabled={!!envelope}
              id="msg-input"
              onInput={this.handleInput}
              rows={10}
              value={envelope ? envelope.encrypted : message}
            />
            {!envelope && (
              <div
                class="progress-bar"
                style={{ transform: `scaleX(${progress})` }}
              />
            )}
          </div>
          {!envelope ? (
            <EncryptInputs
              passphrase={passphrase}
              expiration={expiration}
              onPassChange={this.handlePassChange}
              onExpireChange={this.handleExpireChange}
            />
          ) : (
            <ShareOverlay
              id={envelope.id}
              timestamp={envelope.created}
              expireTime={envelope.expires}
            />
          )}
        </form>
      </Wrapper>
    );
  }
}

export const Write = connect<{}, State, SecretState, Props>(
  ["envelope", "progress"],
  actions
)(WriteComp);
