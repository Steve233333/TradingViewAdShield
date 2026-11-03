const RULE_SET_ID = "tradingview-ads";
const DEFAULT_SETTINGS = { enabled: true };

async function applyRuleSet(enabled) {
  const currentRuleSets =
    await chrome.declarativeNetRequest.getEnabledRulesets();
  const isEnabled = currentRuleSets.includes(RULE_SET_ID);

  if (enabled && !isEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULE_SET_ID],
    });
  }

  if (!enabled && isEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULE_SET_ID],
    });
  }
}

async function syncRuleSet() {
  const { enabled } = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  await applyRuleSet(enabled !== false);
}

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get("enabled");
  if (typeof stored.enabled !== "boolean") {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
  await syncRuleSet();
});

chrome.runtime.onStartup.addListener(() => {
  void syncRuleSet();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (
    areaName === "sync" &&
    Object.prototype.hasOwnProperty.call(changes, "enabled")
  ) {
    void applyRuleSet(changes.enabled.newValue !== false);
  }
});

void syncRuleSet();
