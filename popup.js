const urlInput = document.getElementById('urlInput');
const parseBtn = document.getElementById('parseBtn');
const resultEl = document.getElementById('result');
const toastEl = document.getElementById('toast');

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 1200);
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
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '複製';
    copyBtn.addEventListener('click', () => {
      const text = `${value}`;
      navigator.clipboard?.writeText(text).catch(() => {});
      showToast('已複製');
      copyBtn.textContent = '已複製';
      setTimeout(() => {
        copyBtn.textContent = '複製';
      }, 1200);
    });
    row.appendChild(k);
    row.appendChild(v);
    row.appendChild(copyBtn);
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
    const normalized = input.match(/^https?:\/\//i) ? input : `https://${input}`;
    const url = new URL(normalized);
    renderParams(url.searchParams);
  } catch (err) {
    resultEl.innerHTML = '<div class="empty">網址格式不正確</div>';
  }
}

parseBtn.addEventListener('click', parseUrl);
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') parseUrl();
});

