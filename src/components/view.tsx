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
        <div style={{ wordWrap: "break-word" }}>
          {decrypted ? decrypted : envelope.encrypted}
        </div>
        {decrypted ? (
          <a class="db link underline-hover blue f5 tc" href="/">
            Write new message
          </a>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <div class="mb2 w-100">
              <label class="db f6 mb1">Passphrase</label>
              <input
                type="text"
                class="input-reset w-100 pa2 bn br2"
                value={passphrase}
                onInput={this.handlePassChange}
              />
            </div>
            <div class="flex-auto flex justify-end">
              <input
                class="db ml-auto pv2 ph3 bn br2 bg-black hover-bg-white white hover-black fw5 f6"
                disabled={passphrase.length < 2}
                type="submit"
                value="Save"
              />
            </div>
          </form>
        )}
      </Wrapper>
    );
  }
}

export const View = connect<{}, {}, SecretState, Props>(
  ["envelope", "decrypted", "decryptError"],
  actions
)(ViewComp);
