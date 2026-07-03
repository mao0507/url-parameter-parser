# URL 參數解析器 (Chrome 擴充套件)

一個簡單的 Chrome 擴充套件，點擊工具列圖示即可開啟 popup，輸入或貼上網址後解析並列出查詢參數。每個參數可一鍵複製 `key=value` 至剪貼簿。

[點我查看](https://chromewebstore.google.com/detail/jcgpgkhghdihmnodddjgpimmhfegnhdj?utm_source=item-share-cb)

## 功能
- 輸入或貼上網址，自動解析 query string。
- 以卡片式版面清楚列出參數。
- 每個參數旁提供「複製」按鈕，快速複製 `key=value`。
- 多國語系支援：繁體中文（預設）、簡體中文、英文、日文，依瀏覽器語言自動切換。

## 安裝與使用
1. 將本專案下載或複製到本機資料夾。
2. 打開 Chrome，進入 `chrome://extensions`。
3. 開啟右上角「開發人員模式」。
4. 點擊「載入未封裝項目」，選擇本專案資料夾。
5. 點擊工具列的擴充套件圖示，即可看到 popup；輸入或貼上網址後按「解析」。

## 開發筆記
- 主要檔案：
  - `manifest.json`：Manifest V3 設定。
  - `popup.html`：popup UI。
  - `popup.css`：樣式。
  - `popup.js`：解析與複製邏輯。
  - `_locales/`：多國語系翻譯檔（`zh_TW`、`zh_CN`、`en`、`ja`），使用 Chrome i18n API。若要新增語言，複製一份 `messages.json` 到對應語系資料夾並翻譯即可。
- 若要調整外觀，可修改 `popup.css`。若要擴充功能（如自動帶入當前分頁網址、匯出 JSON），可在 `popup.js` 內新增行為。

