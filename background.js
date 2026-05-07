// More Shortcuts - Background Service Worker

const DEFAULT_STATE = {
  shortcuts: {
    "collapse-group-pause-media": true,
    "new-tab-in-group": true,
    "random-site": true
  },
  randomSites: [
    "https://news.ycombinator.com",
    "https://reddit.com",
    "https://github.com/trending"
  ]
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (existing) => {
    if (!existing.shortcuts) {
      chrome.storage.sync.set({ shortcuts: DEFAULT_STATE.shortcuts });
    }
    if (!existing.randomSites) {
      chrome.storage.sync.set({ randomSites: DEFAULT_STATE.randomSites });
    }
  });
});

chrome.commands.onCommand.addListener(async (command) => {
  const data = await chrome.storage.sync.get(["shortcuts", "randomSites"]);
  const shortcuts = data.shortcuts || DEFAULT_STATE.shortcuts;
  const randomSites = data.randomSites || DEFAULT_STATE.randomSites;

  if (!shortcuts[command]) return; // shortcut is toggled off

  if (command === "collapse-group-pause-media") {
    await handleCollapseAndPause();
  } else if (command === "new-tab-in-group") {
    await handleNewTabInGroup();
  } else if (command === "random-site") {
    await handleRandomSite(randomSites);
  }
});

// ── Shortcut 1: Collapse active tab's group + pause media + escape to prev tab
async function handleCollapseAndPause() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) return;

  // Pause ALL media across every tab in the group (not just the active one)
  const groupId = activeTab.groupId;
  const inGroup = groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE;

  if (inGroup) {
    const groupTabs = await chrome.tabs.query({ groupId, windowId: activeTab.windowId });
    for (const tab of groupTabs) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            document.querySelectorAll("video, audio").forEach(el => el.pause());
          }
        });
      } catch (e) { /* tab may not allow scripting */ }
    }
  } else {
    // Not in a group — just pause media on active tab
    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          document.querySelectorAll("video, audio").forEach(el => el.pause());
        }
      });
    } catch (e) { /* ignore */ }
  }

  if (!inGroup) return; // nothing to collapse, we're done

  // Find the best tab to escape to — closest tab outside this group
  const allTabs = await chrome.tabs.query({ windowId: activeTab.windowId });
  const outside = allTabs.filter(t => t.groupId !== groupId);

  let target = null;
  if (outside.length > 0) {
    // Prefer the tab immediately to the left of the group, else right, else any
    const before = outside.filter(t => t.index < activeTab.index);
    const after  = outside.filter(t => t.index > activeTab.index);
    target = before.length > 0
      ? before[before.length - 1]   // closest tab to the left
      : after.length > 0
        ? after[0]                   // closest tab to the right
        : outside[0];                // fallback: any outside tab
  }

  // Collapse the group
  try {
    await chrome.tabGroups.update(groupId, { collapsed: true });
  } catch (e) {
    console.warn("Could not collapse group:", e);
  }

  // Navigate to the escape tab
  if (target) {
    await chrome.tabs.update(target.id, { active: true });
  }
}

// ── Shortcut 2: Open new tab in its own new group ──────────────────────────
async function handleNewTabInGroup() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const newTab = await chrome.tabs.create({ active: true });

  try {
    const groupId = await chrome.tabs.group({ tabIds: [newTab.id] });
    // Give the group a default name so it's clearly from More Shortcuts
    await chrome.tabGroups.update(groupId, { title: "", color: "blue" });
  } catch (e) {
    console.warn("Could not create group:", e);
  }
}

// ── Shortcut 3: Open random site from user's list ─────────────────────────
async function handleRandomSite(sites) {
  if (!sites || sites.length === 0) return;
  const url = sites[Math.floor(Math.random() * sites.length)];
  await chrome.tabs.create({ url, active: true });
}
