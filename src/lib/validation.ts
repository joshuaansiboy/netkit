export type Validation<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
