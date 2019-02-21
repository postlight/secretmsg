import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgSaver, MsgEnvelope } from "../store";
import { Wrapper } from "./wrapper";
import { EncryptInputs } from "./encrypt-inputs";
import { ShareOverlay } from "./share-overlay";

interface Props {
  saveMessage: MsgSaver;
  clearMessage: () => void;
  envelope?: MsgEnvelope;
}

interface State {
  message: string;
  passphrase: string;
  expiration: number;
}

class WriteComp extends Component<Props, State> {
  state = {
    message: "",
    passphrase: "",
    expiration: 0
  };

  handleInput = (e: Event) => {
    if (e.target) {
      this.setState({ message: (e.target as HTMLFormElement).value });
    }
  };

  handlePassChange = (passphrase: string) => this.setState({ passphrase });

  handleExpireChange = (expiration: number) => this.setState({ expiration });

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.saveMessage(
      this.state.message,
      this.state.passphrase,
      this.state.expiration
    );
  };

  handleClear = (e: Event) => {
    e.preventDefault();
    this.setState({ message: "", passphrase: "", expiration: 0 });
    this.props.clearMessage();
  };

  render() {
    const { envelope } = this.props;
    const { message, passphrase, expiration } = this.state;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <div class="relative overflow-hidden br2 mb3">
            <textarea
              autofocus
              class={`db w-100 mw-100 pa3 bn lh-copy input-reset ${
                envelope ? "black-10" : ""
              }`}
              id="msginput"
              onInput={this.handleInput}
              rows={10}
              value={message}
            />
            {envelope && <ShareOverlay id={envelope.id} />}
          </div>
          {!envelope ? (
            <EncryptInputs
              passphrase={passphrase}
              expiration={expiration}
              onPassChange={this.handlePassChange}
              onExpireChange={this.handleExpireChange}
            />
          ) : (
            <a
              class="db link underline-hover blue f5 tc"
              href="/"
              onClick={this.handleClear}
            >
              Write new message
            </a>
          )}
        </form>
      </Wrapper>
    );
  }
}

export const Write = connect<{}, State, SecretState, Props>(
  ["envelope"],
  actions
)(WriteComp);
