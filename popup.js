function t(key) {
  return chrome.i18n.getMessage(key) || key;
}

function localizePage() {
  document.documentElement.lang = chrome.i18n.getMessage('@@ui_locale').replace('_', '-');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

localizePage();

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
    resultEl.innerHTML = `<div class="empty">${t('noParams')}</div>`;
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
    copyBtn.textContent = t('copy');
    copyBtn.addEventListener('click', () => {
      const text = `${value}`;
      navigator.clipboard?.writeText(text).catch(() => {});
      showToast(t('copied'));
      copyBtn.textContent = t('copied');
      setTimeout(() => {
        copyBtn.textContent = t('copy');
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
    resultEl.innerHTML = `<div class="empty">${t('emptyInput')}</div>`;
    return;
  }
  try {
    const normalized = input.match(/^https?:\/\//i) ? input : `https://${input}`;
    const url = new URL(normalized);
    renderParams(url.searchParams);
  } catch (err) {
    resultEl.innerHTML = `<div class="empty">${t('invalidUrl')}</div>`;
  }
}

parseBtn.addEventListener('click', parseUrl);
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') parseUrl();
});

