const steps = [
  "pbkdf2 (pass 1)",
  "scrypt",
  "pbkdf2 (pass 2)",
  "salsa20",
  "twofish",
  "aes",
  "HMAC-SHA512-SHA3"
];

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
        resolve(buff.toString("base64"));
      }
    );
  });
}

export function decrypt(
  data: string,
  passphrase: string,
  progress: (percent: number) => void = () => {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    triplesec.decrypt(
      {
        data: new triplesec.Buffer(data, "base64"),
        key: new triplesec.Buffer(passphrase),
        progress_hook({ what, i, total }) {
          const completed = steps.indexOf(what) / steps.length;
          const stepProgress = (i / total) * (1 / steps.length);
          progress(completed + stepProgress);
        }
      },
      (err, buff) => {
        if (err) return reject(err);
        resolve(buff.toString());
      }
    );
  });
}
