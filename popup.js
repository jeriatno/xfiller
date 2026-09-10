/**
 * Faker Popup Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const btnFillAll = document.getElementById('btnFillAll');
    const btnFillCurrent = document.getElementById('btnFillCurrent');
    const btnClearAll = document.getElementById('btnClearAll');
    const fieldsBadge = document.getElementById('fieldsBadge');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const btnRefreshData = document.getElementById('btnRefreshData');
    const btnSaveSettings = document.getElementById('btnSaveSettings');
    const saveToast = document.getElementById('saveToast');

    // Setting inputs
    const settingEmailDomain = document.getElementById('settingEmailDomain');
    const settingPresetPassword = document.getElementById('settingPresetPassword');
    const settingUsePresetPassword = document.getElementById('settingUsePresetPassword');

    // Generator elements
    const genCards = document.querySelectorAll('.gen-card');

    /**
     * Get active tab
     */
    async function getActiveTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    /**
     * Load current settings from storage
     */
    async function loadSettings() {
        const { filler_settings = {} } = await chrome.storage.local.get('filler_settings');
        if (settingEmailDomain) {
            settingEmailDomain.value = filler_settings.emailDomain || 'example.com';
        }
        if (settingPresetPassword) {
            settingPresetPassword.value = filler_settings.presetPassword || 'P@ssw0rd123!';
        }
        if (settingUsePresetPassword) {
            settingUsePresetPassword.checked = !!filler_settings.usePresetPassword;
        }
        return filler_settings;
    }

    /**
     * Save settings to storage
     */
    async function saveSettings() {
        const settings = {
            emailDomain: (settingEmailDomain.value || '').trim() || 'example.com',
            presetPassword: settingPresetPassword.value || 'P@ssw0rd123!',
            usePresetPassword: settingUsePresetPassword.checked
        };
        await chrome.storage.local.set({ filler_settings: settings });

        if (saveToast) {
            saveToast.style.display = 'block';
            setTimeout(() => {
                saveToast.style.display = 'none';
            }, 2000);
        }
        return settings;
    }

    /**
     * Send message to active tab content script
     */
    async function sendTabMessage(action) {
        const tab = await getActiveTab();
        if (!tab || !tab.id) return null;

        const settings = await loadSettings();

        try {
            return await chrome.tabs.sendMessage(tab.id, {
                action: action,
                settings: settings
            });
        } catch (err) {
            // Script may not be injected yet
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['filler-engine.js', 'content.js']
                });
                return await chrome.tabs.sendMessage(tab.id, {
                    action: action,
                    settings: settings
                });
            } catch (e) {
                console.warn('Could not communicate with page:', e);
                return null;
            }
        }
    }

    /**
     * Update fields count badge in header
     */
    async function updateFieldsBadge() {
        if (!fieldsBadge) return;
        const res = await sendTabMessage('GET_STATS');
        if (res && typeof res.count === 'number') {
            fieldsBadge.textContent = `${res.count} input${res.count === 1 ? '' : 's'}`;
            fieldsBadge.style.color = res.count > 0 ? '#10b981' : '#94a3b8';
        } else {
            fieldsBadge.textContent = 'Page Ready';
        }
    }

    /**
     * Refresh generator values in Clipboard tab
     */
    function refreshGeneratorData() {
        const domain = (settingEmailDomain?.value || '').trim() || 'example.com';
        const usePreset = settingUsePresetPassword?.checked;
        const preset = settingPresetPassword?.value;

        const valFullName = document.getElementById('valFullName');
        const valEmail = document.getElementById('valEmail');
        const valPhone = document.getElementById('valPhone');
        const valPassword = document.getElementById('valPassword');
        const valCreditCard = document.getElementById('valCreditCard');
        const valAddress = document.getElementById('valAddress');
        const valUuid = document.getElementById('valUuid');
        const valCompany = document.getElementById('valCompany');

        if (valFullName) valFullName.textContent = (window.FillerEngine || window.FakerEngine).fullName();
        if (valEmail) valEmail.textContent = (window.FillerEngine || window.FakerEngine).email({ domain });
        if (valPhone) valPhone.textContent = (window.FillerEngine || window.FakerEngine).phoneNumber('formatted');
        if (valPassword) valPassword.textContent = usePreset && preset ? preset : (window.FillerEngine || window.FakerEngine).password();
        if (valCreditCard) valCreditCard.textContent = (window.FillerEngine || window.FakerEngine).creditCardFormatted('visa');
        if (valAddress) valAddress.textContent = `${(window.FillerEngine || window.FakerEngine).streetAddress()}, ${(window.FillerEngine || window.FakerEngine).city()}, ${(window.FillerEngine || window.FakerEngine).state(true)}`;
        if (valUuid) valUuid.textContent = (window.FillerEngine || window.FakerEngine).uuid();
        if (valCompany) valCompany.textContent = (window.FillerEngine || window.FakerEngine).company();
    }

    /**
     * Copy value to clipboard with button feedback
     */
    function copyToClipboard(text, cardEl) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const btn = cardEl.querySelector('.copy-btn');
            if (btn) {
                const orig = btn.textContent;
                btn.textContent = '✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.classList.remove('copied');
                }, 1200);
            }
        });
    }

    // Tab Navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Action button listeners
    if (btnFillAll) {
        btnFillAll.addEventListener('click', async () => {
            await sendTabMessage('FILL_ALL_FORMS');
            window.close();
        });
    }

    if (btnFillCurrent) {
        btnFillCurrent.addEventListener('click', async () => {
            await sendTabMessage('FILL_CURRENT_FORM');
            window.close();
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener('click', async () => {
            await sendTabMessage('CLEAR_ALL_FORMS');
            window.close();
        });
    }

    // Clipboard card click
    genCards.forEach(card => {
        card.addEventListener('click', () => {
            const valEl = card.querySelector('.gen-val');
            if (valEl) {
                copyToClipboard(valEl.textContent, card);
            }
        });
    });

    if (btnRefreshData) {
        btnRefreshData.addEventListener('click', refreshGeneratorData);
    }

    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', async () => {
            await saveSettings();
            refreshGeneratorData();
        });
    }

    // Init
    await loadSettings();
    refreshGeneratorData();
    await updateFieldsBadge();
});
