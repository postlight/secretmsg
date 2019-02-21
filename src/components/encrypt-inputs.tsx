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
  <div class="flex items-center justify-center">
    <UnlockIcon scale={1.6} class="mr3" />
    <div class="flex w-50 flex-wrap">
      <div class="mb2 w-100">
        <label class="db f6 mb1">Passphrase</label>
        <input
          type="text"
          class="input-reset w-100 pa2 bn br2"
          value={passphrase}
          onInput={(e: Event) =>
            onPassChange((e.target as HTMLFormElement).value)
          }
        />
      </div>
      <select
        value={expiration}
        onChange={(e: Event) =>
          onExpireChange((e.target as HTMLFormElement).value)
        }
      >
        <option value={0}>Never expires</option>
        <option value={24}>Expires in 24 hours</option>
        <option value={168}>Expires in 1 week</option>
        <option value={720}>Expires in 30 days</option>
        <option value={8760}>Expires in 1 year</option>
      </select>
      <div class="flex-auto flex justify-end">
        <input
          class="db ml-auto pv2 ph3 bn br2 bg-black hover-bg-white white hover-black fw5 f6"
          disabled={passphrase.length < 2}
          type="submit"
          value="Save"
        />
      </div>
    </div>
  </div>
);
