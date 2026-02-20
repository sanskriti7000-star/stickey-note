# 📝 Whimsy Notes

A lightweight Chrome Extension that injects draggable, persistent **Neo-Brutalist sticky notes** onto any webpage.

![Whimsy Notes Preview](preview.html)

---

## ✨ Features

- **One-click notes** — a floating **+ New Note** button is injected on every tab
- **Draggable** — grab the black header bar and drag notes anywhere on the page
- **Persistent** — notes are saved per URL using `chrome.storage.local`; they reappear automatically when you revisit the same page
- **Delete with style** — clicking × triggers a gravity fall animation before removing the note
- **Neo-Brutalist design** — `#FFF7AD` yellow, hard black shadow, bold `Inter` typography

---

## 🗂 File Structure

```
whimsy-notes/
├── manifest.json    # Extension config (MV3)
├── background.js    # Handles toolbar icon click → sends message to content script
├── content.js       # Injects FAB + sticky notes, manages drag & persistence
├── styles.css       # All note & FAB styles
└── preview.html     # Standalone HTML demo (no extension needed)
```

---

## 🚀 Installation

### Load in Chrome (Developer Mode)

1. Go to `chrome://extensions`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select the `whimsy-notes/` folder
5. Pin the extension — a 📝 icon appears in your toolbar

### Usage

| Action | Result |
|---|---|
| Click **+ New Note** (bottom-right of any page) | New sticky note appears |
| Click toolbar 📝 icon | Also adds a new note |
| Drag the **black header** | Move the note anywhere |
| Click **×** | Note falls off screen and is deleted |
| Revisit the same URL | All notes reappear exactly where you left them |

---

## 🎨 Design Specs (Neo-Brutalist)

| Property | Value |
|---|---|
| Background | `#FFF7AD` |
| Border | `2px solid #000` |
| Shadow | `6px 6px 0px 0px #000` |
| Font | Inter, 14px, line-height 1.5 |
| Header | Solid black, bold uppercase 12px |
| Delete animation | Gravity fall (`110vh`) over 0.65s |

---

## 📄 License

MIT
