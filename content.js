// More Shortcuts - Content Script
// Intercepts AudioContext so we can suspend it on demand,
// and also handles <video>/<audio> pause as a fallback.

(function () {
  // ── Intercept AudioContext before the page uses it ──────────────────────
  // We wrap the constructor so every AudioContext the page creates gets
  // tracked. When we receive a "pause" message we suspend them all.
  const trackedContexts = new Set();

  const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
  if (OriginalAudioContext) {
    const PatchedAudioContext = function (...args) {
      const ctx = new OriginalAudioContext(...args);
      trackedContexts.add(ctx);
      return ctx;
    };
    PatchedAudioContext.prototype = OriginalAudioContext.prototype;
    window.AudioContext = PatchedAudioContext;
    window.webkitAudioContext = PatchedAudioContext;
  }

  // ── Listen for pause command from background script ──────────────────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "PAUSE_MEDIA") return;

    // 1. Suspend all tracked AudioContexts (Web Audio API players)
    trackedContexts.forEach(ctx => {
      if (ctx.state === "running") ctx.suspend().catch(() => {});
    });

    // 2. Pause all <video> and <audio> elements
    document.querySelectorAll("video, audio").forEach(el => {
      if (!el.paused) el.pause();
    });

    // 3. Click a pause button only if media is actually playing
    const isAnythingPlaying = [...document.querySelectorAll("video, audio")].some(el => !el.paused);
    if (isAnythingPlaying) {
      const pauseSelectors = [
        '[aria-label*="Pause" i]',
        '[title*="Pause" i]',
        '[data-testid*="pause" i]',
        '.ytp-play-button[aria-label*="Pause" i]',
        'button.pause',
        'button[class*="pause" i]',
      ];
      for (const sel of pauseSelectors) {
        const btn = document.querySelector(sel);
        if (btn) { btn.click(); break; }
      }
    }
  });
})();
