// Minimal Chrome DevTools Protocol harness: drives a headless Chrome to look at
// a running app (screenshots, measurements, CSP violations) when no browser
// extension is available. No dependencies — needs Node 22+ (global WebSocket).
//
// Copy it to a scratch folder (never commit it to the project), then:
//   import { launch } from "./cdp-harness.mjs";
//   const { proc, page } = await launch({ width: 390, height: 900 });
//   await page.recordCspViolations();          // before the first navigation
//   await page.goto("http://localhost:3000/login");
//   await page.shot("login-mobile");           // ./shots/login-mobile.png
//   console.log(await page.cspViolations());   // [] when clean
//   proc.kill();
//
// Env overrides: CHROME_PATH (browser binary), CDP_PORT (default 9333).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = Number(process.env.CDP_PORT ?? 9333);
export const SHOTS = join(process.cwd(), "shots");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((path) => existsSync(path));
  if (!found) throw new Error("Chrome not found — set CHROME_PATH");
  return found;
}

export async function launch({ width = 1440, height = 900 } = {}) {
  // A fresh profile per run: a previous run's profile can stay locked for a
  // moment after its process dies, which makes the next launch fail.
  const profile = mkdtempSync(join(tmpdir(), "cdp-profile-"));
  mkdirSync(SHOTS, { recursive: true });
  const proc = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  proc.on("exit", () => rmSync(profile, { recursive: true, force: true, maxRetries: 5 }));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const target = targets.find((candidate) => candidate.type === "page");
      if (target) return { proc, page: await connect(target.webSocketDebuggerUrl, width, height) };
    } catch {
      // not listening yet
    }
    await sleep(200);
  }
  proc.kill();
  throw new Error("Chrome did not start");
}

async function connect(wsUrl, width, height) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let nextId = 1;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    } else if (message.method) {
      for (const listener of listeners) listener(message);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const waitFor = (method, timeout = 15000) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), timeout);
      listeners.push(function handler(message) {
        if (message.method !== method) return;
        clearTimeout(timer);
        listeners.splice(listeners.indexOf(handler), 1);
        resolve(message.params);
      });
    });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });

  const page = {
    send,
    // A URL that differs only by #hash is a same-document navigation and
    // never fires `load` — change the query string instead.
    async goto(url, settleMs = 1500) {
      const loaded = waitFor("Page.loadEventFired");
      await send("Page.navigate", { url });
      await loaded;
      await sleep(settleMs);
    },
    async eval(expression) {
      const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? "eval failed");
      return result.result.value;
    },
    async shot(name, clip) {
      const result = await send("Page.captureScreenshot", {
        format: "png",
        ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
      });
      const file = join(SHOTS, `${name}.png`);
      writeFileSync(file, Buffer.from(result.data, "base64"));
      return file;
    },
    async waitForSelector(selector, timeout = 10000) {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (await page.eval(`!!document.querySelector(${JSON.stringify(selector)})`)) return;
        await sleep(150);
      }
      throw new Error(`selector not found: ${selector}`);
    },
    async click(selector) {
      await page.eval(`document.querySelector(${JSON.stringify(selector)}).click()`);
      await sleep(400);
    },
    async clickText(text, tag = "button") {
      const clicked = await page.eval(
        `(() => { const el = [...document.querySelectorAll(${JSON.stringify(tag)})].find((e) => e.textContent.trim() === ${JSON.stringify(text)}); if (el) el.click(); return !!el; })()`,
      );
      if (!clicked) throw new Error(`no ${tag} with text "${text}"`);
      await sleep(500);
    },
    // Types one character at a time: split digit-box inputs move focus per
    // keystroke, so inserting the whole string lands it in the first box.
    async typeText(text) {
      for (const char of text) {
        await send("Input.insertText", { text: char });
        await sleep(80);
      }
    },
    async setCookie(name, value, { domain = "localhost", path = "/", httpOnly = true } = {}) {
      await send("Network.setCookie", { name, value, domain, path, httpOnly });
    },
    async recordCspViolations() {
      await send("Page.addScriptToEvaluateOnNewDocument", {
        source:
          "window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' <- ' + (e.blockedURI || 'inline')));",
      });
    },
    cspViolations() {
      return page.eval("window.__csp ?? []");
    },
    hasHorizontalScroll() {
      return page.eval("document.documentElement.scrollWidth > innerWidth");
    },
  };
  return page;
}
