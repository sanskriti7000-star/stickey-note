// background.js
// Listens for the extension icon click and sends a message to the content script
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "addNote" });
});
