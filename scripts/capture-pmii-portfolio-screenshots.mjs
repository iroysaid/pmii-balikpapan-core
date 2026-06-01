#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync, promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEFAULT_URL = "http://localhost:1960/";
const TARGET_URL = process.argv[2] || process.env.PMII_URL || DEFAULT_URL;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "screenshots",
  "portfolio-preview",
  "pmii"
);

const VIEWPORTS = [
  {
    name: "desktop",
    width: 1440,
    height: 1200,
    mobile: false,
    deviceScaleFactor: Number(process.env.DESKTOP_DSF || 1),
    png: "pmii-desktop-full.png",
    webp: "pmii-desktop-thumbnail.webp",
    thumbnailWidth: 960,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    mobile: true,
    deviceScaleFactor: Number(process.env.MOBILE_DSF || 2),
    png: "pmii-mobile-full.png",
    webp: "pmii-mobile-thumbnail.webp",
    thumbnailWidth: 390,
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CDPConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  connect() {
    if (typeof WebSocket === "undefined") {
      throw new Error(
        "Global WebSocket is not available. Use Node.js 22+ or newer to run this script."
      );
    }

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      const timeout = setTimeout(() => {
        reject(new Error("Timed out while connecting to Chrome DevTools."));
      }, 10_000);

      this.ws.addEventListener("open", () => {
        clearTimeout(timeout);
        resolve();
      });

      this.ws.addEventListener("error", (event) => {
        clearTimeout(timeout);
        reject(new Error(`Chrome DevTools WebSocket error: ${event.message || "unknown"}`));
      });

      this.ws.addEventListener("message", (event) => {
        this.handleMessage(event.data);
      });
    });
  }

  handleMessage(raw) {
    const message = JSON.parse(raw);

    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject, timer, method } = this.pending.get(message.id);
      clearTimeout(timer);
      this.pending.delete(message.id);

      if (message.error) {
        reject(
          new Error(
            `${method} failed: ${message.error.message || JSON.stringify(message.error)}`
          )
        );
      } else {
        resolve(message.result || {});
      }
      return;
    }

    if (message.method) {
      const sessionId = message.sessionId || "";
      const keys = [`${sessionId}:${message.method}`, `:${message.method}`];
      for (const key of keys) {
        const callbacks = this.listeners.get(key);
        if (!callbacks) continue;
        for (const callback of callbacks) callback(message.params || {}, message);
      }
    }
  }

  send(method, params = {}, sessionId = "") {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out.`));
      }, 60_000);

      this.pending.set(id, { resolve, reject, timer, method });
      this.ws.send(JSON.stringify(payload));
    });
  }

  on(method, sessionId, callback) {
    const key = `${sessionId || ""}:${method}`;
    const callbacks = this.listeners.get(key) || new Set();
    callbacks.add(callback);
    this.listeners.set(key, callbacks);

    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) this.listeners.delete(key);
    };
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForEvent(cdp, method, sessionId, timeoutMs = 30_000) {
  return new Promise((resolve, reject) => {
    const off = cdp.on(method, sessionId, (params) => {
      clearTimeout(timer);
      off();
      resolve(params);
    });
    const timer = setTimeout(() => {
      off();
      reject(new Error(`Timed out waiting for ${method}.`));
    }, timeoutMs);
  });
}

async function launchChrome() {
  if (!existsSync(CHROME_PATH)) {
    throw new Error(
      `Google Chrome was not found at ${CHROME_PATH}. Set CHROME_PATH to a valid Chrome binary.`
    );
  }

  const userDataDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "pmii-portfolio-chrome-")
  );
  const args = [
    "--headless=new",
    "--remote-debugging-port=0",
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-popup-blocking",
    "--force-color-profile=srgb",
    `--user-data-dir=${userDataDir}`,
    "--window-size=1440,1200",
    "about:blank",
  ];

  const chrome = spawn(CHROME_PATH, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const wsUrl = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Timed out waiting for Chrome DevTools endpoint. Chrome output:\n${output}`
        )
      );
    }, 15_000);

    const read = (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    };

    chrome.stdout.on("data", read);
    chrome.stderr.on("data", read);
    chrome.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    chrome.once("exit", (code) => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`Chrome exited early with code ${code}.`));
    });
  });

  return { chrome, wsUrl, userDataDir };
}

async function createPage(cdp) {
  const { targetId } = await cdp.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await cdp.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });

  const page = (method, params = {}) => cdp.send(method, params, sessionId);
  await Promise.all([
    page("Page.enable"),
    page("Runtime.enable"),
    page("Network.enable"),
    page("DOM.enable"),
  ]);

  return { page, sessionId, targetId };
}

async function waitForNetworkIdle(cdp, sessionId, idleMs = 900, timeoutMs = 20_000) {
  let inFlight = 0;
  let idleTimer;

  return new Promise((resolve) => {
    const cleanup = () => {
      offRequest();
      offFinished();
      offFailed();
      clearTimeout(idleTimer);
      clearTimeout(maxTimer);
      resolve();
    };

    const scheduleIdle = () => {
      clearTimeout(idleTimer);
      if (inFlight <= 0) idleTimer = setTimeout(cleanup, idleMs);
    };

    const offRequest = cdp.on("Network.requestWillBeSent", sessionId, () => {
      inFlight += 1;
      clearTimeout(idleTimer);
    });
    const offFinished = cdp.on("Network.loadingFinished", sessionId, () => {
      inFlight = Math.max(0, inFlight - 1);
      scheduleIdle();
    });
    const offFailed = cdp.on("Network.loadingFailed", sessionId, () => {
      inFlight = Math.max(0, inFlight - 1);
      scheduleIdle();
    });
    const maxTimer = setTimeout(cleanup, timeoutMs);

    scheduleIdle();
  });
}

async function waitForFontsAndImages(page) {
  const expression = `
    (async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(document.images);
      await Promise.race([
        Promise.all(images.map((img) => {
          if (img.complete) return true;
          return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
        })),
        new Promise((resolve) => setTimeout(resolve, 15000))
      ]);

      return true;
    })();
  `;

  await page("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
}

async function scrollThroughPage(page) {
  await page("Runtime.evaluate", {
    expression: `
      (async () => {
        const root = document.scrollingElement || document.documentElement;
        const maxY = Math.max(0, root.scrollHeight - window.innerHeight);
        const step = Math.max(320, Math.floor(window.innerHeight * 0.72));

        for (let y = 0; y <= maxY; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 160));
        }

        window.scrollTo(0, maxY);
        await new Promise((resolve) => setTimeout(resolve, 300));
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
          scrollHeight: root.scrollHeight,
          viewportHeight: window.innerHeight
        };
      })();
    `,
    awaitPromise: true,
    returnByValue: true,
  });
}

async function getPageReport(page) {
  const { result } = await page("Runtime.evaluate", {
    expression: `
      (() => {
        const images = Array.from(document.images);
        const brokenImages = images
          .filter((img) => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
          .map((img) => ({
            src: img.currentSrc || img.src || "",
            alt: img.alt || "",
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0
          }));

        const footer = document.querySelector("footer");
        const footerByText = Array.from(document.querySelectorAll("body *")).some((node) => {
          const text = (node.textContent || "").trim().toLowerCase();
          return text.includes("copyright") || text.includes("pmii balikpapan");
        });

        return {
          title: document.title,
          imageCount: images.length,
          brokenImages,
          footerDetected: Boolean(footer || footerByText)
        };
      })();
    `,
    returnByValue: true,
  });

  return result.value;
}

async function captureViewport(cdp, viewport) {
  const { page, sessionId, targetId } = await createPage(cdp);

  await page("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  });
  if (viewport.mobile) {
    await page("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 5,
    });
  } else {
    await page("Emulation.setTouchEmulationEnabled", { enabled: false });
  }
  await page("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  const loadPromise = waitForEvent(cdp, "Page.loadEventFired", sessionId, 45_000);
  await page("Page.navigate", { url: TARGET_URL });
  await loadPromise;
  await waitForNetworkIdle(cdp, sessionId);
  await waitForFontsAndImages(page);
  await scrollThroughPage(page);
  await waitForNetworkIdle(cdp, sessionId, 700, 12_000);
  await waitForFontsAndImages(page);

  await page("Runtime.evaluate", {
    expression: "window.scrollTo(0, 0);",
  });
  await sleep(600);

  const pageReport = await getPageReport(page);
  const { contentSize } = await page("Page.getLayoutMetrics");
  const clip = {
    x: 0,
    y: 0,
    width: Math.ceil(contentSize.width),
    height: Math.ceil(contentSize.height),
    scale: 1,
  };

  const screenshot = await page("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip,
  });

  const pngPath = path.join(OUTPUT_DIR, viewport.png);
  await fs.writeFile(pngPath, Buffer.from(screenshot.data, "base64"));
  await cdp.send("Target.closeTarget", { targetId });

  const capturedDimensions = await getPngDimensions(pngPath);

  return {
    viewport: {
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor,
      mobile: viewport.mobile,
    },
    files: {
      png: path.relative(PROJECT_ROOT, pngPath),
      pngAbsolute: pngPath,
    },
    capturedDimensions,
    pageTitle: pageReport.title,
    imageCount: pageReport.imageCount,
    brokenImages: pageReport.brokenImages,
    footerDetected: pageReport.footerDetected,
  };
}

async function getPngDimensions(filePath) {
  const file = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(24);
    await file.read(buffer, 0, 24, 0);
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  } finally {
    await file.close();
  }
}

async function commandExists(command) {
  return new Promise((resolve) => {
    const check = spawn("sh", ["-lc", `command -v ${command}`], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    check.on("exit", (code) => resolve(code === 0));
  });
}

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}:\n${stderr}`));
    });
  });
}

async function generateWebpThumbnails(results) {
  const hasCwebp = await commandExists("cwebp");
  if (!hasCwebp) {
    return {
      generated: false,
      message:
        "cwebp is not installed. Install it with `brew install webp` on macOS, then rerun this script.",
    };
  }

  for (const result of results) {
    const viewport = VIEWPORTS.find((item) => item.name === result.viewport.name);
    const input = path.join(PROJECT_ROOT, result.files.png);
    const output = path.join(OUTPUT_DIR, viewport.webp);

    await runCommand("cwebp", [
      "-quiet",
      "-q",
      "78",
      "-resize",
      String(viewport.thumbnailWidth),
      "0",
      input,
      "-o",
      output,
    ]);

    result.files.webp = path.relative(PROJECT_ROOT, output);
    result.files.webpAbsolute = output;
  }

  return {
    generated: true,
    message: "WebP thumbnails generated with cwebp.",
  };
}

async function createRoundedImage(inputPath, width, height, radius) {
  const sharp = (await import("sharp")).default;
  const resized = await sharp(inputPath)
    .resize(width, height, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const mask = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>
  `);

  return sharp(resized).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function createCombinedPortfolioPreview(results) {
  try {
    const sharp = (await import("sharp")).default;
    const desktop = results.find((item) => item.viewport.name === "desktop");
    const mobile = results.find((item) => item.viewport.name === "mobile");
    if (!desktop || !mobile) return { generated: false, message: "Missing screenshot result." };

    const desktopPath = path.join(PROJECT_ROOT, desktop.files.png);
    const mobilePath = path.join(PROJECT_ROOT, mobile.files.png);
    const outputPath = path.join(OUTPUT_DIR, "pmii-combined-portfolio-preview.png");

    const width = 1800;
    const height = 1200;
    const desktopShot = await createRoundedImage(desktopPath, 1120, 760, 28);
    const mobileShot = await createRoundedImage(mobilePath, 330, 720, 42);

    const background = Buffer.from(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#122562"/>
            <stop offset="0.52" stop-color="#262EED"/>
            <stop offset="1" stop-color="#07123A"/>
          </linearGradient>
          <radialGradient id="gold" cx="75%" cy="22%" r="55%">
            <stop offset="0" stop-color="#F5CA0F" stop-opacity="0.38"/>
            <stop offset="1" stop-color="#F5CA0F" stop-opacity="0"/>
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="30" stdDeviation="36" flood-color="#061133" flood-opacity="0.38"/>
          </filter>
        </defs>
        <rect width="1800" height="1200" fill="url(#bg)"/>
        <rect width="1800" height="1200" fill="url(#gold)"/>
        <circle cx="164" cy="168" r="80" fill="#F5CA0F" opacity="0.16"/>
        <circle cx="1590" cy="1030" r="150" fill="#ffffff" opacity="0.08"/>
        <text x="92" y="104" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">PMII Balikpapan</text>
        <text x="92" y="145" fill="#FFFFFF" opacity="0.76" font-family="Inter, Arial, sans-serif" font-size="20">Portfolio landing page preview</text>
        <rect x="58" y="185" width="1214" height="866" rx="42" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.32)" filter="url(#shadow)"/>
        <rect x="58" y="185" width="1214" height="68" rx="42" fill="rgba(255,255,255,0.20)"/>
        <circle cx="104" cy="219" r="10" fill="#FF6B6B"/>
        <circle cx="136" cy="219" r="10" fill="#FFD166"/>
        <circle cx="168" cy="219" r="10" fill="#06D6A0"/>
        <rect x="1410" y="178" width="374" height="816" rx="56" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.34)" filter="url(#shadow)"/>
        <rect x="1540" y="204" width="114" height="8" rx="4" fill="rgba(255,255,255,0.38)"/>
      </svg>
    `);

    await sharp(background)
      .composite([
        { input: desktopShot, left: 105, top: 265 },
        { input: mobileShot, left: 1432, top: 226 },
      ])
      .png()
      .toFile(outputPath);

    return {
      generated: true,
      file: path.relative(PROJECT_ROOT, outputPath),
      fileAbsolute: outputPath,
    };
  } catch (error) {
    return {
      generated: false,
      message: `Combined preview skipped: ${error.message}`,
    };
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const { chrome, wsUrl, userDataDir } = await launchChrome();
  const cdp = new CDPConnection(wsUrl);
  const results = [];

  try {
    await cdp.connect();

    for (const viewport of VIEWPORTS) {
      results.push(await captureViewport(cdp, viewport));
    }

    const webp = await generateWebpThumbnails(results);
    const combinedPreview = await createCombinedPortfolioPreview(results);

    const report = {
      website: "PMII Balikpapan",
      url: TARGET_URL,
      generatedAt: new Date().toISOString(),
      outputFolder: path.relative(PROJECT_ROOT, OUTPUT_DIR),
      screenshots: results,
      webp,
      combinedPreview,
    };

    console.log(JSON.stringify(report, null, 2));
  } finally {
    try {
      await cdp.send("Browser.close");
    } catch {
      chrome.kill("SIGTERM");
    }
    cdp.close();
    await removeChromeProfile(userDataDir);
  }
}

async function removeChromeProfile(userDataDir) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(userDataDir, { recursive: true, force: true, maxRetries: 3 });
      return;
    } catch {
      await sleep(300 + attempt * 250);
    }
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error.message,
        hint:
          TARGET_URL === DEFAULT_URL
            ? "Make sure the PMII app is running with `npm run dev` on http://localhost:1960/, or pass a URL: `node scripts/capture-pmii-portfolio-screenshots.mjs http://localhost:1960/`."
            : "Check that the target URL is reachable and Chrome can access it.",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
});
