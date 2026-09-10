/**
 * Filler Background Service Worker (Manifest V3)
 * Handles Context Menus, Keyboard Shortcuts, and Tab Messaging.
 */

// Context menu item definitions
const CONTEXT_MENUS = [
    { id: 'filler_fill_all', title: 'Filler: Fill All Inputs on Page', contexts: ['all'] },
    { id: 'filler_fill_form', title: 'Filler: Fill Current Form', contexts: ['editable'] },
    { id: 'filler_fill_field', title: 'Filler: Fill Only This Field', contexts: ['editable'] },
    { id: 'filler_separator', type: 'separator', contexts: ['all'] },
    { id: 'filler_clear_form', title: 'Filler: Clear Form Data', contexts: ['all'] }
];

// Setup context menus on installation
chrome.runtime.onInstalled.addListener(async () => {
    // Clear existing to avoid duplicate IDs
    chrome.contextMenus.removeAll(() => {
        CONTEXT_MENUS.forEach(menu => {
            chrome.contextMenus.create(menu);
        });
    });

    // Default settings in local storage
    const stored = await chrome.storage.local.get('filler_settings');
    if (!stored.filler_settings) {
        await chrome.storage.local.set({
            filler_settings: {
                emailDomain: 'example.com',
                presetPassword: 'P@ssw0rd123!',
                usePresetPassword: false,
                fillEmptyOnly: true
            }
        });
    }
});

/**
 * Handle Context Menu Clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id) return;

    const data = await chrome.storage.local.get(['filler_settings', 'faker_settings']);
    const settings = data.filler_settings || data.faker_settings || {};

    let action = 'FILL_ALL_FORMS';
    if (info.menuItemId === 'filler_fill_all') action = 'FILL_ALL_FORMS';
    if (info.menuItemId === 'filler_fill_form') action = 'FILL_CURRENT_FORM';
    if (info.menuItemId === 'filler_fill_field') action = 'FILL_THIS_FIELD';
    if (info.menuItemId === 'filler_clear_form') action = 'CLEAR_ALL_FORMS';

    try {
        await chrome.tabs.sendMessage(tab.id, {
            action: action,
            settings: settings
        });
    } catch (err) {
        // In case content script wasn't injected yet, inject programmatically
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['filler-engine.js', 'content.js']
            });
            await chrome.tabs.sendMessage(tab.id, {
                action: action,
                settings: settings
            });
        } catch (e) {
            console.error('Filler background error:', e);
        }
    }
});

/**
 * Handle Keyboard Shortcut Commands (e.g. Alt+Shift+F)
 */
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'fill_all_forms') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) return;

        const data = await chrome.storage.local.get(['filler_settings', 'faker_settings']);
        const settings = data.filler_settings || data.faker_settings || {};

        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'FILL_ALL_FORMS',
                settings: settings
            });
        } catch (err) {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['filler-engine.js', 'content.js']
                });
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'FILL_ALL_FORMS',
                    settings: settings
                });
            } catch (e) {
                console.error('Filler command injection error:', e);
            }
        }
    }
});
