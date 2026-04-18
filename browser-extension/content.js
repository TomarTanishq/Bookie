/**
 * Bookmark Digest Content Script
 * Handles the secure handshake between the web app and the browser extension.
 */

// 1. Mark the page so the web app knows the extension is active
document.documentElement.setAttribute('data-bookie-ext', 'true');

// 2. Listen for the setup event dispatched by the web app
document.addEventListener('BOOKIE_EXT_SETUP', (event) => {
    const { apiUrl, chatId } = event.detail;

    if (!apiUrl || !chatId) {
        console.error('Bookie Extension: Invalid setup data received.');
        return;
    }

    // 3. Save to browser storage
    chrome.storage.sync.set({ apiUrl, chatId }, () => {
        console.log('Bookie Extension: Configuration synchronized from web app.');
        
        // 4. Dispatch a confirmation event back to the page
        const confirmEvent = new CustomEvent('BOOKIE_EXT_SETUP_SUCCESS', {
            detail: { timestamp: new Date().getTime() }
        });
        document.dispatchEvent(confirmEvent);
    });
});
