const POPUP_W = 400;
const POPUP_H = 540;

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'open-quick-input') return;

  chrome.windows.getCurrent({ populate: false }, (win) => {
    const left = Math.max(0, Math.round(win.left + (win.width - POPUP_W) / 2));
    const top = Math.max(0, Math.round(win.top + (win.height - POPUP_H) / 2));

    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html') + '?mode=window',
      type: 'popup',
      width: POPUP_W,
      height: POPUP_H,
      left,
      top,
      focused: true
    });
  });
});
