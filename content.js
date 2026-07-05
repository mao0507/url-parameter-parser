(function () {
  const HOST_ID = '__url_parser_host__';

  // 已注入過 → toggle 顯示/隱藏
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    const overlay = existing.shadowRoot.querySelector('.overlay');
    if (overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    } else {
    overlay.classList.add('visible');
    setTimeout(() => existing.shadowRoot.querySelector('#urlInput').focus(), 0);
    }
    return;
  }

  // Shadow host：fixed 覆蓋視窗，pointer-events none 不遮擋頁面
  const host = document.createElement('div');
  host.id = HOST_ID;
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // ── 樣式 ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :host {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.18s ease, visibility 0.18s ease;
    }

    .overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .box {
      position: relative;
      font-family: "Noto Sans TC", "Inter", system-ui, -apple-system, sans-serif;
      color: #1f2430;
      width: 420px;
      background: linear-gradient(180deg, #f7f9fc 0%, #eef3ff 100%);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 24px 64px rgba(15, 23, 42, 0.28), 0 4px 16px rgba(15, 23, 42, 0.12);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transform: translateY(10px) scale(0.98);
      transition: transform 0.18s ease;
    }

    .overlay.visible .box {
      transform: translateY(0) scale(1);
    }

    /* Header */
    .hero { display: flex; flex-direction: column; gap: 4px; }

    .hero-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-weight: 800;
      font-size: 18px;
      letter-spacing: 0.3px;
    }

    .subtitle {
      margin: 0;
      color: #596070;
      font-size: 13px;
    }

    /* Close button */
    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      background: transparent;
      border: 1px solid #d1d9e8;
      border-radius: 8px;
      color: #7a8293;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      line-height: 1;
      box-shadow: none;
      transition: background 0.15s, color 0.15s;
    }

    .close-btn:hover { background: #f0f4ff; color: #334155; }

    /* Card */
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 8px 24px rgba(31, 60, 114, 0.08);
      border: 1px solid #e6ebf5;
    }

    .input-card { display: flex; flex-direction: column; gap: 8px; }

    .label { font-size: 12px; color: #5e6a7f; letter-spacing: 0.2px; }

    .input-row { display: flex; gap: 8px; }

    #urlInput {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #c9d4e5;
      border-radius: 10px;
      background: #fdfefe;
      font-size: 13px;
      font-family: inherit;
      color: inherit;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    #urlInput:focus {
      border-color: #3b7cff;
      box-shadow: 0 0 0 3px rgba(59, 124, 255, 0.12);
    }

    /* Buttons */
    button {
      padding: 0 16px;
      height: 40px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #2d7bff, #1a5de6);
      color: #fff;
      font-weight: 700;
      font-family: inherit;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(45, 123, 255, 0.25);
      transition: transform 0.08s, box-shadow 0.2s;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 20px rgba(45, 123, 255, 0.35);
    }

    button:active { transform: translateY(0); }

    /* Result */
    .result-card { display: flex; flex-direction: column; gap: 8px; }

    .result {
      border: 1px dashed #d7ddeb;
      border-radius: 10px;
      padding: 10px;
      min-height: 48px;
      max-height: 240px;
      overflow-y: auto;
      background: #f9fbff;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .kv {
      display: grid;
      grid-template-columns: 1fr 1.2fr auto;
      gap: 8px;
      align-items: center;
      padding: 6px 8px;
      border-radius: 8px;
      background: #fff;
      border: 1px solid #e9eef8;
    }

    .key { font-weight: 700; word-break: break-all; color: #334155; font-size: 13px; }

    .value { word-break: break-all; color: #1f2937; font-size: 13px; }

    .copy-btn {
      border: 1px solid #d7def0;
      background: #f4f7ff;
      color: #1f3a7d;
      border-radius: 8px;
      padding: 4px 10px;
      height: auto;
      font-size: 12px;
      font-weight: 600;
      box-shadow: none;
      transition: background 0.15s;
    }

    .copy-btn:hover { background: #e6edff; transform: none; box-shadow: none; }
    .copy-btn:active { transform: translateY(1px); }

    .empty { color: #7a8293; font-size: 13px; }

    /* Toast */
    .toast {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(31, 60, 114, 0.92);
      color: #fff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }

    .toast.show {
      opacity: 1;
      transform: translate(-50%, -4px);
    }
  `;
  shadow.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'overlay visible';
  overlay.innerHTML = `
    <div class="box">
      <header class="hero">
        <div class="hero-top">
          <div class="logo">URL 參數解析</div>
          <button class="close-btn" title="關閉 (Esc)" aria-label="關閉">✕</button>
        </div>
        <p class="subtitle">輸入或貼上網址，快速取得查詢參數。</p>
      </header>
      <div class="card input-card">
        <div class="label">網址</div>
        <div class="input-row">
          <input id="urlInput" type="text" placeholder="https://example.com?foo=bar&lang=zh-TW" autocomplete="off" />
          <button id="parseBtn">解析</button>
        </div>
      </div>
      <div class="card result-card">
        <div class="label">解析結果</div>
        <div id="result" class="result"></div>
      </div>
      <div class="toast" id="toast" aria-live="polite"></div>
    </div>
  `;
  shadow.appendChild(overlay);

  // ── DOM refs ──────────────────────────────────────────────
  const urlInput = shadow.getElementById('urlInput');
  const parseBtn = shadow.getElementById('parseBtn');
  const resultEl = shadow.getElementById('result');
  const toastEl  = shadow.getElementById('toast');
  const closeBtn = shadow.querySelector('.close-btn');

  // ── 邏輯 ──────────────────────────────────────────────────
  function closeModal() {
    overlay.classList.remove('visible');
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 1200);
  }

  function renderParams(params) {
    resultEl.innerHTML = '';
    if ([...params].length === 0) {
      resultEl.innerHTML = '<div class="empty">沒有查詢參數</div>';
      return;
    }
    params.forEach((value, key) => {
      const row = document.createElement('div');
      row.className = 'kv';

      const k = document.createElement('div');
      k.className = 'key';
      k.textContent = key;

      const v = document.createElement('div');
      v.className = 'value';
      v.textContent = value;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '複製';
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(value).catch(() => {});
        showToast('已複製');
        btn.textContent = '已複製';
        setTimeout(() => { btn.textContent = '複製'; }, 1200);
      });

      row.appendChild(k);
      row.appendChild(v);
      row.appendChild(btn);
      resultEl.appendChild(row);
    });
  }

  function parseUrl() {
    const input = urlInput.value.trim();
    if (!input) {
      resultEl.innerHTML = '<div class="empty">請輸入網址</div>';
      return;
    }
    try {
      const normalized = /^https?:\/\//i.test(input) ? input : `https://${input}`;
      renderParams(new URL(normalized).searchParams);
    } catch {
      resultEl.innerHTML = '<div class="empty">網址格式不正確</div>';
    }
  }

  // 點擊背板關閉
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);
  parseBtn.addEventListener('click', parseUrl);

  // 鍵盤：ESC 關閉、Enter 觸發解析（button 上的 Enter 由瀏覽器轉為 click 處理）
  shadow.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeModal(); }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      parseUrl();
    }
  });

  // 也在 document 層監聽 Escape（焦點不在 shadow 內時仍可關閉）
  const docEscHandler = (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) closeModal();
  };
  document.addEventListener('keydown', docEscHandler);

  // 自動 focus 輸入框
  setTimeout(() => urlInput.focus(), 50);
})();
