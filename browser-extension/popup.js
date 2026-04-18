document.addEventListener("DOMContentLoaded", () => {
    const setupSection = document.getElementById("setup-section");
    const statusSection = document.getElementById("status-section");
    const displayUrl = document.getElementById("displayUrl");
    const connectBtn = document.getElementById("connectBtn");
    const reconnectBtn = document.getElementById("reconnectBtn");

    const DEFAULT_APP_URL = "http://localhost:3000";

    function updateUI() {
        chrome.storage.sync.get(["apiUrl", "chatId"], (result) => {
            if (result.apiUrl && result.chatId) {
                setupSection.style.display = "none";
                statusSection.style.display = "block";
                displayUrl.textContent = result.apiUrl;
            } else {
                setupSection.style.display = "block";
                statusSection.style.display = "none";
            }
        });
    }

    async function openSetupPage() {
        // Try to find the most likely App URL
        // In a real scenario, this might come from a hardcoded config or the active tab
        chrome.storage.sync.get(["apiUrl"], (result) => {
            const baseUrl = result.apiUrl || DEFAULT_APP_URL;
            const setupUrl = `${baseUrl}/setup-extension`;
            
            chrome.tabs.create({ url: setupUrl });
        });
    }

    connectBtn.addEventListener("click", openSetupPage);
    reconnectBtn.addEventListener("click", openSetupPage);

    // Initial UI load
    updateUI();

    // Listen for storage changes (e.g. from content script success)
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "sync") {
            updateUI();
        }
    });
});
