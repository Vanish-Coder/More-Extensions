# More Shortcuts

A Chrome extension that adds keyboard shortcuts Chrome doesn't have by default.

## Shortcuts
Mac Sh.   Windows Sh.       Description
| `⌘⇧H` | `Ctrl+Shift+H` | Collapse the active tab's group + pause any playing media.|
| `⌘⇧G` | `Ctrl+Shift+G` | Open a new tab and place it in its own new group.|
| `⌘⇧Y` | `Ctrl+Shift+Y` | Open a random site from your custom list.|


### How to set up the shortcuts?

Chrome reserves some shortcuts at the OS level, so extensions can't claim it automatically. Also, you have to set all shortcuts manually in 1.0.

## Installation
1. Clone or download this repo.
2. Open Chrome and go to chrome://extensions.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the correct folder.

## Popup
Click the extension icon to open the popup. From there you can:
- Toggle each shortcut on or off.
- Manage the list of sites for the Random Site Launcher (add/remove URLs).

## Notes
- The **Collapse Group** shortcut only works if the active tab belongs to a tab group. If it doesn't, only media pausing runs.
- The **New Tab in Group** shortcut creates a new group for every new tab — rename/recolor the group in Chrome's tab bar as usual.
- Sites added to the Random Site Launcher are synced across your Chrome profile via chrome.storage.sync.

## Suggestions
Please give suggestions for new shortcuts [here](https://github.com/Vanish-Coder/More-Extensions/issues). 

## License
This software is licensed under [GNU GPL-3.0](https://en.wikipedia.org/wiki/GNU_General_Public_License#Version_3).
