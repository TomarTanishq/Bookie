chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
    // Only process bookmarks that have a URL (ignoring folders)
    if (!bookmark.url) return;

    try {
        const { apiUrl, chatId } = await chrome.storage.sync.get(["apiUrl", "chatId"]);

        if (!apiUrl || !chatId) {
            console.warn("Bookmark Digest: API URL or Chat ID not configured.");
            return;
        }

        // Try to grab content directly from the active tab if it's the one being bookmarked
        let tabContent = '';
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0 && tabs[0].url === bookmark.url) {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => document.body.innerText
                });
                if (results && results[0] && results[0].result) {
                    tabContent = results[0].result;
                }
            }
        } catch (scriptErr) {
            console.warn("Bookmark Digest: Could not scrape tab (maybe restricted page)", scriptErr);
        }

        const response = await fetch(`${apiUrl}/api/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: bookmark.url,
                source: "extension",
                title: bookmark.title,
                content: tabContent,
                chatId: chatId
            })
        });

        if (!response.ok) {
            console.error("Bookmark Digest: Failed to sync bookmark. Status: ", response.status);
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.ico",
                title: "Bookmark Sync Failed",
                message: "Could not sync bookmark. Please check your Settings."
            });
        } else {
            console.log("Bookmark Digest: Successfully synced bookmark to backend.");
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.ico",
                title: "Bookmark Saved 🚀",
                message: `Sucessfully sent "${bookmark.title || bookmark.url}" to your Digest.`
            });
        }
    } catch (error) {
        console.error("Bookmark Digest: Error syncing bookmark: ", error);
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.ico",
            title: "Digest Sync Error",
            message: "Request failed. Check if your API URL is correct and server is running."
        });
    }
});
