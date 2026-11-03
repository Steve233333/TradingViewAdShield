const enabledInput = document.querySelector("#enabled");
const statusText = document.querySelector("#status");
const reloadButton = document.querySelector("#reload");

function render(enabled) {
  enabledInput.checked = enabled;
  statusText.textContent = enabled ? "已开启" : "已关闭";
}

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  render(enabled !== false);
});

enabledInput.addEventListener("change", () => {
  const enabled = enabledInput.checked;
  chrome.storage.sync.set({ enabled }, () => render(enabled));
});

reloadButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab?.id) {
      chrome.tabs.reload(tab.id);
      window.close();
    }
  });
});
