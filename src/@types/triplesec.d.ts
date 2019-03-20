/* eslint-disable @typescript-eslint/no-explicit-any */
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
