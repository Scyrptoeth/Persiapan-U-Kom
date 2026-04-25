import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const appUrl = process.env.APP_URL ?? "http://localhost:3000";
const remoteDebuggingPort = 9400 + Math.floor(Math.random() * 500);
const userDataDir = mkdtempSync(join(tmpdir(), "persiapan-u-kom-chrome-"));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, attempts = 80) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Chrome is still starting.
    }
    await sleep(100);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketUrl);
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) {
        return;
      }

      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result ?? {});
      }
    });

    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = { id, method, params };
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.ws.send(JSON.stringify(payload));
    return promise;
  }

  close() {
    this.ws?.close();
  }
}

function pageExpression(body) {
  return `(() => { ${body} })()`;
}

async function evaluate(client, sessionId, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  }, sessionId);

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }

  return result.result?.value;
}

async function expect(client, sessionId, label, expression) {
  const value = await evaluate(client, sessionId, `Boolean(${expression})`);
  if (!value) {
    throw new Error(`Browser check failed: ${label}`);
  }
}

async function clickText(client, sessionId, text) {
  const clicked = await evaluate(client, sessionId, pageExpression(`
    const targetText = ${JSON.stringify(text)};
    const element = [...document.querySelectorAll("button, a")]
      .find((candidate) => candidate.textContent.replace(/\\s+/g, " ").trim().includes(targetText));
    if (!element) return false;
    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
    return true;
  `));

  if (!clicked) {
    throw new Error(`Could not click text: ${text}`);
  }

  await sleep(250);
}

async function clickSelector(client, sessionId, selector) {
  const clicked = await evaluate(client, sessionId, pageExpression(`
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
    return true;
  `));

  if (!clicked) {
    throw new Error(`Could not click selector: ${selector}`);
  }

  await sleep(250);
}

async function configureViewport(client, sessionId, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile
  }, sessionId);
  await client.send("Emulation.setTouchEmulationEnabled", { enabled: viewport.mobile }, sessionId);
}

async function navigate(client, sessionId) {
  await client.send("Page.navigate", { url: appUrl }, sessionId);
  await sleep(1000);
  await evaluate(client, sessionId, `localStorage.clear()`);
  await client.send("Page.navigate", { url: appUrl }, sessionId);
  await sleep(1000);
  await expect(client, sessionId, "document ready", `document.readyState === "complete"`);
}

async function capture(client, sessionId, path) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true }, sessionId);
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
}

async function runDesktopFlow(client, sessionId) {
  await configureViewport(client, sessionId, { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate(client, sessionId);

  await expect(client, sessionId, "home renders Beranda", `document.body.innerText.includes("Beranda")`);
  await expect(client, sessionId, "spider chart exists", `Boolean(document.querySelector(".spider-chart svg"))`);
  await clickText(client, sessionId, "Paket dikerjakan");
  await expect(client, sessionId, "completion scenario active", `document.querySelector(".scenario-switch button:last-child")?.getAttribute("aria-pressed") === "true"`);
  await expect(client, sessionId, "level labels visible", `document.body.innerText.includes("Materi Level 1") && document.body.innerText.includes("Materi Level 2")`);
  await expect(client, sessionId, "source panel hidden", `!document.body.innerText.includes("Sumber Materi")`);

  await clickSelector(client, sessionId, "[aria-label='Ringkas sidebar kategori']");
  await expect(client, sessionId, "sidebar collapses", `document.querySelector(".app-shell")?.classList.contains("is-sidebar-collapsed")`);
  await clickSelector(client, sessionId, "[aria-label='Perluas sidebar kategori']");
  await expect(client, sessionId, "sidebar expands", `!document.querySelector(".app-shell")?.classList.contains("is-sidebar-collapsed")`);

  await clickSelector(client, sessionId, ".mode-switch button:nth-child(2)");
  await expect(client, sessionId, "package picker first", `document.body.innerText.includes("Pilih Paket PPN") && Boolean(document.querySelector(".package-picker")) && !document.querySelector(".study-surface")`);
  await clickText(client, sessionId, "PPN Paket 6");
  for (let index = 0; index < 4; index += 1) {
    await clickText(client, sessionId, "Berikutnya");
  }
  await expect(client, sessionId, "new flipcard question opens", `document.querySelector(".study-surface")?.innerText.includes("NSFP 08002500000000096")`);
  await clickSelector(client, sessionId, ".flipcard");
  await expect(client, sessionId, "flipcard shows answer only", `
    document.querySelector(".flipcard-back")?.innerText.includes("Penyerahan BKP tersebut mendapatkan fasilitas dibebaskan dari pengenaan PPN.") &&
    !document.querySelector(".flipcard-back")?.innerText.includes("Jawaban yang benar")
  `);

  await clickSelector(client, sessionId, ".mode-switch button:nth-child(3)");
  await expect(client, sessionId, "test package stays selected", `document.querySelector(".test-layout")?.innerText.toLowerCase().includes("tes tetap urut")`);
  await clickSelector(client, sessionId, ".question-item:nth-child(5) .option-button:nth-child(3)");
  await clickText(client, sessionId, "Submit tes");
  await expect(client, sessionId, "review shows answer explanation source", `
    document.body.innerText.includes("Jawaban benar: Penyerahan BKP tersebut mendapatkan fasilitas dibebaskan dari pengenaan PPN.") &&
    document.body.innerText.includes("Jawaban yang benar adalah Penyerahan BKP tersebut mendapatkan fasilitas dibebaskan dari pengenaan PPN.") &&
    document.body.innerText.includes("ppn101.pdf nomor 28")
  `);
  await expect(client, sessionId, "localStorage progress saved", `
    JSON.parse(localStorage.getItem("persiapan-u-kom:test-attempts:v1") || "{}")["ppn-paket-6"]?.length === 1
  `);
  await capture(client, sessionId, ".verification-desktop.png");

  return {
    viewport: "desktop",
    package: "PPN Paket 6",
    localStoragePackage: "ppn-paket-6",
    screenshot: ".verification-desktop.png"
  };
}

async function runMobileFlow(client, sessionId) {
  await configureViewport(client, sessionId, { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await navigate(client, sessionId);

  await expect(client, sessionId, "mobile home renders", `document.body.innerText.includes("Beranda") && Boolean(document.querySelector(".spider-chart svg"))`);
  await clickSelector(client, sessionId, ".mode-switch button:nth-child(2)");
  await expect(client, sessionId, "mobile package picker first", `document.body.innerText.includes("Pilih Paket PPN") && document.body.innerText.includes("PPN Paket 6") && !document.querySelector(".study-surface")`);
  await clickText(client, sessionId, "PPN Paket 6");
  for (let index = 0; index < 4; index += 1) {
    await clickText(client, sessionId, "Berikutnya");
  }
  await expect(client, sessionId, "mobile flipcard renders new question", `document.querySelector(".study-surface")?.innerText.includes("NSFP 08002500000000096")`);
  await capture(client, sessionId, ".verification-mobile.png");

  return {
    viewport: "mobile",
    package: "PPN Paket 6",
    screenshot: ".verification-mobile.png"
  };
}

const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${remoteDebuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank"
], { stdio: "ignore" });

let client;

try {
  const version = await waitForJson(`http://127.0.0.1:${remoteDebuggingPort}/json/version`);
  client = new CdpClient(version.webSocketDebuggerUrl);
  await client.connect();
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);

  const desktop = await runDesktopFlow(client, sessionId);
  const mobile = await runMobileFlow(client, sessionId);

  console.log(JSON.stringify({ ok: true, appUrl, checks: [desktop, mobile] }, null, 2));
} finally {
  client?.close();
  chrome.kill("SIGTERM");
}
