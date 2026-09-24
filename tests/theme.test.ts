import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { THEME_BOOTSTRAP_SCRIPT } from "../src/lib/theme-bootstrap";

function bootTheme(preference: string | null, storageFails = false) {
  const document = { documentElement: { dataset: {} as { theme?: string } } };
  const localStorage = {
    getItem(key: string) {
      assert.equal(key, "netkit-theme");
      if (storageFails) throw new Error("Storage unavailable");
      return preference;
    },
  };
  runInNewContext(THEME_BOOTSTRAP_SCRIPT, { document, localStorage });
  return document.documentElement.dataset.theme;
}

test("pre-paint theme script applies either explicit saved preference", () => {
  assert.equal(bootTheme("light"), "light");
  assert.equal(bootTheme("dark"), "dark");
});

test("pre-paint theme script leaves system preference to CSS when unset or unavailable", () => {
  assert.equal(bootTheme(null), undefined);
  assert.equal(bootTheme("unexpected"), undefined);
  assert.equal(bootTheme("dark", true), undefined);
});
