/**
 * Filler Content Script
 * Intelligent, silent form-filler for Chrome (Manifest V3).
 * Compatible with standard forms and modern reactive frameworks (React, Vue, Angular, Svelte).
 */

(function () {
    'use strict';

    // Prevent multiple injections
    if (window.__FILLER_CONTENT_SCRIPT_LOADED__) return;
    window.__FILLER_CONTENT_SCRIPT_LOADED__ = true;
    const Engine = window.FillerEngine || window.FakerEngine;

    // Track the last right-clicked element for context menu actions
    let lastRightClickedElement = null;
    document.addEventListener('contextmenu', function (e) {
        lastRightClickedElement = e.target;
    }, true);

    // Track active element focus
    let lastFocusedElement = null;
    document.addEventListener('focusin', function (e) {
        lastFocusedElement = e.target;
    }, true);

    /**
     * Set value on input/textarea with React/Vue/Angular tracker bypass
     */
    function setNativeValue(element, value) {
        if (!element) return;
        const lastValue = element.value;

        // Dispatch keydown before change
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true }));

        // Update prototype setter for React 15/16+
        const prototype = Object.getPrototypeOf(element);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        if (descriptor && descriptor.set) {
            descriptor.set.call(element, value);
        } else {
            element.value = value;
        }

        // React valueTracker
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }

        // Standard DOM events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    /**
     * Set checkbox or radio button state with event triggering
     */
    function setCheckedState(element, checked) {
        if (!element || element.checked === checked) return;
        const lastChecked = element.checked;

        const prototype = Object.getPrototypeOf(element);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'checked');
        if (descriptor && descriptor.set) {
            descriptor.set.call(element, checked);
        } else {
            element.checked = checked;
        }

        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastChecked);
        }

        element.dispatchEvent(new Event('click', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Set select dropdown value
     */
    function setSelectValue(element, value) {
        if (!element) return;
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    /**
     * Check if element should be skipped (hidden, disabled, readonly, captcha)
     */
    function shouldIgnoreElement(el) {
        if (!el) return true;

        // Disabled or readonly
        if (el.disabled || el.readOnly || el.hasAttribute('readonly')) return true;

        // Check if element is invisible or hidden
        const type = (el.type || '').toLowerCase();
        if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset' || type === 'image') {
            return true;
        }

        // CAPTCHA / Anti-bot indicators
        const identifiers = [
            el.id,
            el.name,
            el.className,
            el.getAttribute('placeholder') || '',
            el.getAttribute('aria-label') || ''
        ].join(' ').toLowerCase();

        if (/recaptcha|g-recaptcha|hcaptcha|turnstile|cf-turnstile|botdetect|captcha|challenge/i.test(identifiers)) {
            return true;
        }

        // Invisible in layout
        if (el.offsetWidth === 0 && el.offsetHeight === 0 && !el.getClientRects().length) {
            return true;
        }

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return true;
        }

        return false;
    }

    /**
     * Gather surrounding semantic text cues (name, id, placeholder, label, aria)
     */
    function getElementSemanticContext(el) {
        const parts = [
            el.name || '',
            el.id || '',
            el.placeholder || '',
            el.getAttribute('aria-label') || '',
            el.getAttribute('autocomplete') || '',
            el.getAttribute('data-field') || '',
            el.getAttribute('data-testid') || '',
            el.className || ''
        ];

        // Find associated <label>
        if (el.id) {
            const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
            if (label && label.innerText) parts.push(label.innerText);
        }
        const parentLabel = el.closest('label');
        if (parentLabel && parentLabel.innerText) {
            parts.push(parentLabel.innerText);
        }

        // Previous sibling or parent text header
        const prev = el.previousElementSibling;
        if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN') && prev.innerText) {
            parts.push(prev.innerText);
        }

        return parts.join(' ').toLowerCase();
    }

    /**
     * Main field filler logic for a single element
     */
    function fillSingleField(el, context = {}) {
        if (shouldIgnoreElement(el)) return false;

        const tagName = el.tagName.toLowerCase();
        const type = (el.type || 'text').toLowerCase();
        const textContext = getElementSemanticContext(el);
        const options = context.settings || {};

        // 1. Textarea & Contenteditable
        if (tagName === 'textarea') {
            const sentenceCount = (el.rows && el.rows > 4) ? 4 : 2;
            setNativeValue(el, Engine.loremParagraph(sentenceCount));
            return true;
        }
        if (el.isContentEditable) {
            el.innerText = Engine.loremParagraph(2);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }

        // 2. Select Dropdowns
        if (tagName === 'select') {
            const validOptions = Array.from(el.options).filter(opt => {
                if (opt.disabled) return false;
                const val = (opt.value || '').trim().toLowerCase();
                const txt = (opt.text || '').trim().toLowerCase();
                // Filter out placeholder options like "Select an option...", "Choose...", "None", etc.
                if (!val && !txt) return false;
                if (/^(select|choose|pick|please|none|--|\s*$)/i.test(txt) && !val) return false;
                return true;
            });

            if (validOptions.length > 0) {
                const picked = validOptions[Math.floor(Math.random() * validOptions.length)];
                setSelectValue(el, picked.value);
                return true;
            }
            return false;
        }

        // 3. Radio Buttons
        if (type === 'radio') {
            const name = el.name;
            if (name && context.processedRadios && context.processedRadios.has(name)) {
                return false; // Already handled this radio group
            }
            if (name) {
                if (!context.processedRadios) context.processedRadios = new Set();
                context.processedRadios.add(name);
                const scope = el.form || document;
                const radios = Array.from(scope.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`))
                    .filter(r => !r.disabled);
                if (radios.length > 0) {
                    const picked = radios[Math.floor(Math.random() * radios.length)];
                    setCheckedState(picked, true);
                    return true;
                }
            } else {
                setCheckedState(el, true);
                return true;
            }
            return false;
        }

        // 4. Checkboxes
        if (type === 'checkbox') {
            // If terms / agreement, always check it
            if (/terms|agree|privacy|condition|policy|consent/i.test(textContext)) {
                setCheckedState(el, true);
            } else {
                // Check 70% of checkboxes
                setCheckedState(el, Math.random() < 0.7);
            }
            return true;
        }

        // 5. HTML5 Specific Input Types
        if (type === 'email') {
            setNativeValue(el, Engine.email({ domain: options.emailDomain }));
            return true;
        }

        if (type === 'password') {
            // Check if this is a confirmation field
            const isConfirm = /confirm|confirmation|repeat|retype|re-enter|verify/i.test(textContext);
            if (isConfirm && context.lastPassword) {
                setNativeValue(el, context.lastPassword);
            } else {
                const pwd = Engine.password({ presetPassword: options.presetPassword });
                context.lastPassword = pwd;
                setNativeValue(el, pwd);
            }
            return true;
        }

        if (type === 'tel') {
            setNativeValue(el, Engine.phoneNumber('formatted'));
            return true;
        }

        if (type === 'url') {
            setNativeValue(el, Engine.url());
            return true;
        }

        if (type === 'number' || type === 'range') {
            const min = el.min ? parseFloat(el.min) : 1;
            const max = el.max ? parseFloat(el.max) : 100;
            const step = el.step ? parseFloat(el.step) : 1;
            let val = Math.floor(Math.random() * (max - min + 1)) + min;
            if (step && step > 0 && step < 1) {
                val = parseFloat(val.toFixed(2));
            }
            setNativeValue(el, val.toString());
            return true;
        }

        if (type === 'date') {
            if (/birth|dob|bday/i.test(textContext)) {
                setNativeValue(el, Engine.dateOfBirth());
            } else {
                setNativeValue(el, Engine.futureDate());
            }
            return true;
        }

        if (type === 'datetime-local') {
            setNativeValue(el, Engine.dateTimeLocal());
            return true;
        }

        if (type === 'time') {
            setNativeValue(el, Engine.time());
            return true;
        }

        if (type === 'color') {
            setNativeValue(el, Engine.color());
            return true;
        }

        // 6. Text-like inputs with Semantic Matching
        if (type === 'text' || type === 'search' || !type) {
            // Password confirmation matching for text fields (sometimes type is text temporarily)
            if (/confirm[_-]?pass|password[_-]?confirm|repeat[_-]?pass/i.test(textContext)) {
                if (context.lastPassword) {
                    setNativeValue(el, context.lastPassword);
                    return true;
                }
            }

            // Names
            if (/(^|[^a-z])(first[_-]?name|fname|given[_-]?name)($|[^a-z])/i.test(textContext)) {
                const fname = Engine.firstName();
                context.lastFirstName = fname;
                setNativeValue(el, fname);
                return true;
            }
            if (/(^|[^a-z])(last[_-]?name|lname|surname|family[_-]?name)($|[^a-z])/i.test(textContext)) {
                const lname = Engine.lastName();
                context.lastLastName = lname;
                setNativeValue(el, lname);
                return true;
            }
            if (/(^|[^a-z])(full[_-]?name|your[_-]?name|customer[_-]?name|contact[_-]?name|recipient|author)($|[^a-z])/i.test(textContext)) {
                setNativeValue(el, Engine.fullName());
                return true;
            }

            // Emails
            if (/email|e-mail|mail/i.test(textContext)) {
                setNativeValue(el, Engine.email({
                    domain: options.emailDomain,
                    firstName: context.lastFirstName,
                    lastName: context.lastLastName
                }));
                return true;
            }

            // Username / Login
            if (/username|user_name|login|handle|nickname/i.test(textContext)) {
                setNativeValue(el, Engine.username(context.lastFirstName));
                return true;
            }

            // Phone
            if (/phone|tel|mobile|cell|whatsapp|fax/i.test(textContext)) {
                setNativeValue(el, Engine.phoneNumber('formatted'));
                return true;
            }

            // Credit Cards & Financials
            if (/card[_-]?number|cc[_-]?num|credit[_-]?card|pan|debit/i.test(textContext)) {
                setNativeValue(el, Engine.creditCardFormatted('visa'));
                return true;
            }
            if (/exp[_-]?date|card[_-]?exp|expiration|expiry|cc[_-]?exp/i.test(textContext)) {
                setNativeValue(el, Engine.creditCardExp());
                return true;
            }
            if (/cvv|cvc|security[_-]?code|cid/i.test(textContext)) {
                setNativeValue(el, Engine.creditCardCVV());
                return true;
            }

            // Street & Address
            if (/address[_-]?line|street|address1|address2|address/i.test(textContext)) {
                setNativeValue(el, Engine.streetAddress());
                return true;
            }
            if (/city|town|municipality/i.test(textContext)) {
                setNativeValue(el, Engine.city());
                return true;
            }
            if (/state|province|region/i.test(textContext)) {
                setNativeValue(el, Engine.state());
                return true;
            }
            if (/zip|postal|postcode|pincode/i.test(textContext)) {
                setNativeValue(el, Engine.zipCode());
                return true;
            }
            if (/country|nation/i.test(textContext)) {
                setNativeValue(el, Engine.country());
                return true;
            }

            // Company & Work
            if (/company|organization|org|business|employer/i.test(textContext)) {
                setNativeValue(el, Engine.company());
                return true;
            }
            if (/job[_-]?title|position|role|occupation|designation/i.test(textContext)) {
                setNativeValue(el, Engine.jobTitle());
                return true;
            }
            if (/department|dept|division/i.test(textContext)) {
                setNativeValue(el, Engine.department());
                return true;
            }

            // Internet & Tech
            if (/website|url|homepage|link/i.test(textContext)) {
                setNativeValue(el, Engine.url());
                return true;
            }
            if (/ip[_-]?address|ipv4/i.test(textContext)) {
                setNativeValue(el, Engine.ipv4());
                return true;
            }
            if (/uuid|guid/i.test(textContext)) {
                setNativeValue(el, Engine.uuid());
                return true;
            }

            // Numbers & Monetary
            if (/price|cost|amount|total|salary|budget|rate/i.test(textContext)) {
                setNativeValue(el, Engine.price());
                return true;
            }
            if (/quantity|qty|count|units|item_count/i.test(textContext)) {
                setNativeValue(el, Engine.number(1, 20).toString());
                return true;
            }

            // Fallback for general text fields
            const maxLen = el.maxLength > 0 ? el.maxLength : 255;
            let val = Engine.loremSentence(2, 5).replace(/\.$/, '');
            if (val.length > maxLen) {
                val = val.slice(0, maxLen);
            }
            setNativeValue(el, val);
            return true;
        }

        return false;
    }

    /**
     * Find all form inputs in a container (form or document)
     */
    function getFillableElements(container = document) {
        const selector = 'input, textarea, select, [contenteditable="true"]';
        const raw = Array.from(container.querySelectorAll(selector));
        return raw.filter(el => !shouldIgnoreElement(el));
    }

    /**
     * Fill all forms on the current page
     */
    function fillAllForms(settings = {}) {
        const elements = getFillableElements(document);
        const context = {
            settings: settings,
            processedRadios: new Set(),
            lastPassword: null,
            lastFirstName: null,
            lastLastName: null
        };

        let filledCount = 0;
        elements.forEach(el => {
            if (fillSingleField(el, context)) {
                filledCount++;
            }
        });

        return { success: true, count: filledCount };
    }

    /**
     * Fill only the currently active/focused form
     */
    function fillCurrentForm(settings = {}) {
        let form = null;
        if (lastFocusedElement) {
            form = lastFocusedElement.closest('form');
        }
        if (!form && lastRightClickedElement) {
            form = lastRightClickedElement.closest('form');
        }
        if (!form) {
            // Fallback to first form on page, or body
            form = document.querySelector('form') || document.body;
        }

        const elements = getFillableElements(form);
        const context = {
            settings: settings,
            processedRadios: new Set(),
            lastPassword: null,
            lastFirstName: null,
            lastLastName: null
        };

        let filledCount = 0;
        elements.forEach(el => {
            if (fillSingleField(el, context)) {
                filledCount++;
            }
        });

        return { success: true, count: filledCount };
    }

    /**
     * Fill only the single element under focus or right-click
     */
    function fillSingleActiveElement(settings = {}) {
        const target = lastRightClickedElement || lastFocusedElement || document.activeElement;
        if (!target) return { success: false, count: 0 };

        const context = {
            settings: settings,
            processedRadios: new Set(),
            lastPassword: null
        };

        const success = fillSingleField(target, context);
        return { success: success, count: success ? 1 : 0 };
    }

    /**
     * Clear values in all forms
     */
    function clearAllForms() {
        const elements = getFillableElements(document);
        let clearedCount = 0;

        elements.forEach(el => {
            const tagName = el.tagName.toLowerCase();
            const type = (el.type || '').toLowerCase();

            if (tagName === 'textarea' || el.isContentEditable) {
                setNativeValue(el, '');
                clearedCount++;
            } else if (tagName === 'select') {
                if (el.options.length > 0) {
                    setSelectValue(el, el.options[0].value);
                    clearedCount++;
                }
            } else if (type === 'checkbox' || type === 'radio') {
                setCheckedState(el, false);
                clearedCount++;
            } else {
                setNativeValue(el, '');
                clearedCount++;
            }
        });

        return { success: true, count: clearedCount };
    }

    /**
     * Listener for messages from background worker or popup
     */
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const action = message.action;
        const settings = message.settings || {};

        if (action === 'FILL_ALL_FORMS') {
            const res = fillAllForms(settings);
            sendResponse(res);
            return true;
        }

        if (action === 'FILL_CURRENT_FORM') {
            const res = fillCurrentForm(settings);
            sendResponse(res);
            return true;
        }

        if (action === 'FILL_THIS_FIELD') {
            const res = fillSingleActiveElement(settings);
            sendResponse(res);
            return true;
        }

        if (action === 'CLEAR_ALL_FORMS') {
            const res = clearAllForms();
            sendResponse(res);
            return true;
        }

        if (action === 'GET_STATS') {
            const count = getFillableElements(document).length;
            sendResponse({ count: count });
            return true;
        }

        return false;
    });

})();
