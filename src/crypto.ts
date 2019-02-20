export function encrypt(
  message: string,
  passphrase: string,
  progress: (percent: number) => void = () => {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    triplesec.encrypt(
      {
        data: new triplesec.Buffer(message),
        key: new triplesec.Buffer(passphrase),
        progress_hook({ what, i, total }) {
          const completed = steps.indexOf(what) / steps.length;
          const stepProgress = (i / total) * (1 / steps.length);
          progress(completed + stepProgress);
        }
      },
      (err, buff) => {
        if (err) return reject(err);
        resolve(buff.toString("hex"));
      }
    );
  });
}

const steps = [
  "pbkdf2 (pass 1)",
  "scrypt",
  "pbkdf2 (pass 2)",
  "salsa20",
  "twofish",
  "aes",
  "HMAC-SHA512-SHA3"
];

// Just enough typing to wrap the external lib
declare namespace triplesec {
  const encrypt: (
    options: TripleSecInput,
    callback: (err: any, buff: any) => void
  ) => void;
  const decrypt: (
    options: TripleSecInput,
    callback: (err: any, buff: any) => void
  ) => void;
  const Buffer: any;
}

interface TripleSecInput {
  data: any;
  key: any;
  progress_hook: (progress: { what: string; i: number; total: number }) => void;
}
