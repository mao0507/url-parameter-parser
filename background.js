chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== 'open-quick-input') return;
  if (!tab?.id || !tab.url || /^chrome(-extension)?:\/\//.test(tab.url)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch {
    // 受限頁面（chrome://、擴充套件頁面）無法注入，靜默忽略
  }
});
