import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions, SecretState, MsgSaver } from "../store";
import { Wrapper } from "./wrapper";
import { SaveOverlay } from "./save-overlay";

interface Props {
  saveMessage: MsgSaver;
}

interface State {
  message: string;
  passphrase: string;
  expiration: number;
  saving: boolean;
}

class IndexComp extends Component<Props, State> {
  state = {
    message: "",
    passphrase: "",
    expiration: 0,
    saving: false
  };

  handleInput = (e: Event) => {
    if (e.target) {
      this.setState({ message: (e.target as HTMLFormElement).value });
    }
  };

  handleStartSaving = () => {
    this.setState({ saving: true });
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

  render() {
    const { saving, message, passphrase, expiration } = this.state;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <div class="relative overflow-hidden br2 mb3">
            <textarea
              autofocus
              class={`db w-100 mw-100 pa3 bn lh-copy input-reset ${
                saving ? "black-10" : ""
              }`}
              id="msginput"
              onInput={this.handleInput}
              rows={10}
              value={message}
            />
            {saving && (
              <SaveOverlay
                passphrase={passphrase}
                expiration={expiration}
                onPassChange={this.handlePassChange}
                onExpireChange={this.handleExpireChange}
              />
            )}
          </div>
          {!saving && (
            <button
              class="db ml-auto pv2 ph3 button-reset bn br2 bg-black hover-bg-white white hover-black fw5 f6"
              onClick={this.handleStartSaving}
            >
              Encrypt message
            </button>
          )}
        </form>
      </Wrapper>
    );
  }
}

export const Index = connect<{}, State, SecretState, Props>(
  [],
  actions
)(IndexComp);
