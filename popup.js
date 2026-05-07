// popup.js — More Shortcuts

const DEFAULT_SITES = [
  "https://news.ycombinator.com",
  "https://reddit.com",
  "https://github.com/trending"
];

let shortcuts = {};
let randomSites = [];

// ── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.sync.get(["shortcuts", "randomSites"]);
  shortcuts = data.shortcuts || { "collapse-group-pause-media": true, "new-tab-in-group": true, "random-site": true };
  randomSites = data.randomSites || DEFAULT_SITES;

  applyToggleStates();
  renderSitesList();
  bindToggleListeners();
  bindSitesListeners();
});

// ── Toggles ─────────────────────────────────────────────────────────────────
function applyToggleStates() {
  document.querySelectorAll("[data-shortcut]").forEach(checkbox => {
    const key = checkbox.dataset.shortcut;
    checkbox.checked = !!shortcuts[key];
    updateCardState(key, checkbox.checked);
  });
}

function bindToggleListeners() {
  document.querySelectorAll("[data-shortcut]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const key = checkbox.dataset.shortcut;
      shortcuts[key] = checkbox.checked;
      chrome.storage.sync.set({ shortcuts });
      updateCardState(key, checkbox.checked);
    });
  });
}

function updateCardState(key, enabled) {
  const card = document.querySelector(`[data-key="${key}"]`);
  if (!card) return;
  card.classList.toggle("disabled", !enabled);
}

// ── Sites List ───────────────────────────────────────────────────────────────
function renderSitesList() {
  const list = document.getElementById("sites-list");
  list.innerHTML = "";

  if (randomSites.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color: var(--text-muted); font-size: 12px; padding: 4px 2px;";
    empty.textContent = "No sites yet — add some below.";
    list.appendChild(empty);
    return;
  }

  randomSites.forEach((url, i) => {
    const item = document.createElement("div");
    item.className = "site-item";

    const label = document.createElement("span");
    label.className = "site-url";
    label.title = url;
    label.textContent = url;

    const btn = document.createElement("button");
    btn.className = "site-remove";
    btn.title = "Remove";
    btn.textContent = "×";
    btn.addEventListener("click", () => removeSite(i));

    item.appendChild(label);
    item.appendChild(btn);
    list.appendChild(item);
  });
}

function bindSitesListeners() {
  const input = document.getElementById("new-site-input");
  const addBtn = document.getElementById("add-site-btn");

  addBtn.addEventListener("click", () => addSite(input));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addSite(input);
  });

  // Open chrome://extensions/shortcuts in a new tab
  document.getElementById("open-shortcuts-page").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
}

function addSite(input) {
  let val = input.value.trim();
  if (!val) return;

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(val)) val = "https://" + val;

  if (randomSites.includes(val)) {
    flashInput(input, "Already in list");
    return;
  }

  randomSites.push(val);
  chrome.storage.sync.set({ randomSites });
  input.value = "";
  renderSitesList();
}

function removeSite(index) {
  randomSites.splice(index, 1);
  chrome.storage.sync.set({ randomSites });
  renderSitesList();
}

function flashInput(input, msg) {
  const orig = input.placeholder;
  input.style.borderColor = "var(--red)";
  input.placeholder = msg;
  input.value = "";
  setTimeout(() => {
    input.style.borderColor = "";
    input.placeholder = orig;
  }, 1500);
}
