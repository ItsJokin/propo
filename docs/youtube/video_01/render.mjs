// Renderiza timeline.html fotograma a fotograma y lo envía a ffmpeg (vídeo sin audio).
// Uso: node render.mjs <timeline.html> <salida.mp4> <duración_s> [fps] [inicio_s] [fin_s]
// Con "preview" como salida guarda capturas PNG en los tiempos indicados: node render.mjs t.html preview 0 25 1,5,9
import { createRequire } from "module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { spawn } from "child_process";
const [html, salida, durS, fpsS = "25", a = "0", b] = process.argv.slice(2);
const fps = +fpsS;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + html);
await page.evaluate(() => document.fonts.ready);
if (salida === "preview") {
  for (const t of a.split(",").map(Number)) {
    await page.evaluate((t) => setTime(t), t);
    await page.screenshot({ path: `${b}/prev_${t}.png` });
  }
} else {
  const ini = +a, fin = b ? +b : +durS;
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(fps), salida], { stdio: ["pipe", "inherit", "inherit"] });
  const n0 = Math.round(ini * fps), n1 = Math.round(fin * fps);
  for (let i = n0; i < n1; i++) {
    await page.evaluate((t) => setTime(t), i / fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
}
await browser.close();
