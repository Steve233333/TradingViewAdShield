const AD_SELECTOR = [
  "#charting-ad",
  '[id^="div-gpt-ad-toast-ad-"]',
  '[id^="google_ads_iframe_"]',
  '[id="goog_plcm_frame"]',
  'iframe[src*="googlesyndication.com"]',
  'iframe[src*="doubleclick.net"]',
  'iframe[aria-label="广告"]',
].join(",");

const ROOT_ATTRIBUTE = "data-tv-ad-shield";
const HIDDEN_ATTRIBUTE = "data-tv-ad-shield-hidden";
let enabled = true;
let observer;

function hideElement(element) {
  element.setAttribute(HIDDEN_ATTRIBUTE, "true");
}

function restoreElement(element) {
  element.removeAttribute(HIDDEN_ATTRIBUTE);
}

function sweep(root) {
  if (!enabled || !root) {
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE && root.matches(AD_SELECTOR)) {
    hideElement(root);
  }

  root.querySelectorAll?.(AD_SELECTOR).forEach(hideElement);
}

function applyState() {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  if (enabled) {
    root.setAttribute(ROOT_ATTRIBUTE, "on");
    sweep(document);
    observer?.disconnect();
    observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach(sweep);
      }
    });
    observer.observe(document, { childList: true, subtree: true });
    return;
  }

  root.removeAttribute(ROOT_ATTRIBUTE);
  observer?.disconnect();
  observer = undefined;
  document
    .querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`)
    .forEach(restoreElement);
}

chrome.storage.sync.get({ enabled: true }, ({ enabled: storedEnabled }) => {
  enabled = storedEnabled !== false;
  applyState();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (
    areaName === "sync" &&
    Object.prototype.hasOwnProperty.call(changes, "enabled")
  ) {
    enabled = changes.enabled.newValue !== false;
    applyState();
  }
});

document.addEventListener("DOMContentLoaded", () => sweep(document), {
  once: true,
});
