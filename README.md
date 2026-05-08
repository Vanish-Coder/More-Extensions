# More Shortcuts
A Chrome extension that adds keyboard shortcuts Chrome doesn't have by default.

## Appearance
<img width="371" height="600" alt="Screenshot 2026-05-06 at 10 45 33 PM" src="https://github.com/user-attachments/assets/9d7d70c0-80c5-44ab-b7d0-9fb29a955bf5" />


## Shortcuts
Mac Sh.   Windows Sh.      ‎ ‎ ‎ ‎ Description

| `⌘⇧H` | `Ctrl+Shift+H` | Collapse the active tab's group + pause any playing media.|

| `⌘⇧G` | `Ctrl+Shift+G` | Open a new tab and place it in its own new group.|

| `⌘⇧Y` | `Ctrl+Shift+Y` | Open a random site from your custom list.|


### Do I need to set up the shortcuts?

Chrome reserves some shortcuts at the OS level, so extensions can't claim it automatically. Also, you have to set all shortcuts manually as of now.

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
- If you are using the Collapse Group shortcut when you aren't in a tab group, it only pauses media.
- Sites added to the Random Site Launcher are synced across your Chrome profile via chrome.storage.sync (though syncing may be inconsistent as of now).

## Suggestions + Feedback
Please give suggestions for new shortcuts and feedback [here](https://forms.gle/BXF48F1YV23LWoGZ6). 

## License
This software is licensed under [GNU GPL-3.0](https://en.wikipedia.org/wiki/GNU_General_Public_License#Version_3).
