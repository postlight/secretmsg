import { h, FunctionalComponent } from "preact";
import { UnlockIcon } from "./icons";

interface Props {
  passphrase: string;
  expiration: number;
  onPassChange: (update: string) => void;
  onExpireChange: (update: number) => void;
}

export const EncryptInputs: FunctionalComponent<Props> = ({
  passphrase,
  expiration,
  onPassChange,
  onExpireChange
}) => (
  <div class="encrypt-inputs-wrapper">
    <UnlockIcon class="unlock-icon" />
    <div class="encrypt-inputs">
      <div class="pass-group">
        <label class="pass-label" for="pass-input">
          Passphrase
        </label>
        <input
          autocomplete="off"
          type="text"
          id="pass-input"
          value={passphrase}
          onInput={(e: Event) =>
            onPassChange((e.target as HTMLFormElement).value)
          }
        />
      </div>
      <div class="select-group">
        <select
          class="expire-select"
          value={expiration}
          onChange={(e: Event) =>
            onExpireChange(parseInt((e.target as HTMLFormElement).value))
          }
        >
          <option value={0}>Never expires</option>
          <option value={24}>Expires in 24 hours</option>
          <option value={168}>Expires in 1 week</option>
          <option value={720}>Expires in 30 days</option>
          <option value={8760}>Expires in 1 year</option>
        </select>
      </div>
      <div class="submit-group">
        <input
          class="submit-btn btn"
          disabled={passphrase.length < 2}
          type="submit"
          value="Encrypt message"
        />
      </div>
    </div>
  </div>
);
