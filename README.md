<div align="center">
  <img src="icons/icon128.png" alt="Filler Logo" width="96" height="96" />
  <h1>Filler</h1>
  <p><strong>Chrome Extension (Manifest V3)</strong></p>
  <p>Universal smart form filler and realistic dummy data generator for developers and QA testers. Fills all inputs on any webpage in 1 click or via keyboard shortcut.</p>
</div>

---

## 🚀 Key Features

### 1. ⚡ Smart Field Detection (English Only)
- **Names**: Intelligently identifies First Name, Last Name, and Full Name from input attributes (`name`, `id`, `placeholder`, `aria-label`, or `<label>`).
- **Emails**: Realistic email addresses with configurable domain (default `@example.com` or custom).
- **Passwords & Confirmations**: Automatically matches the confirmation password field to the generated password so validation succeeds on the first try!
- **Phone Numbers**: Realistic US/International phone formats (e.g. `(555) 234-5678`).
- **Addresses**: Full street addresses, US cities, states, and 5-digit zip codes.
- **Payment & Credit Cards**: Test Visa / Mastercard numbers that strictly pass the **Luhn Algorithm**, complete with future expiration date (`MM/YY`) and 3-digit CVV.
- **Work & Company**: Realistic company names, job titles, and departments.
- **Web & Tech**: Valid URLs, IPv4 addresses, and UUID v4 identifiers.
- **Interactive Elements**:
  - `<select>` dropdowns: Picks a random valid option (skipping placeholder options like "Select...", "Choose...").
  - Radio buttons: Selects 1 random option per radio group.
  - Checkboxes: Randomly checks boxes and always checks required terms/agreement checkboxes.
  - Date & Time: Valid date of birth (18-65 yo) or future dates, datetime-local, and time.
  - Textarea: Realistic multi-sentence reviews or feedback.

### 2. 🤫 Silent & Clean Filling
- Fills forms directly and silently without injecting intrusive banners, toasts, or animations into the page DOM.

### 3. ⚛️ Modern Reactive Framework Ready
- Fully compatible with **React 16+**, **Vue 3**, **Angular**, **Svelte**, and **Alpine.js**.
- Employs native prototype setter overrides and dispatches native `input`, `change`, `keydown`, `keyup`, and `blur` events so reactive state managers immediately capture the new values.

### 4. ⌨️ Multiple Convenient Triggers
- **Keyboard Shortcut**: Press <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> on Mac) to fill all forms on the current page instantly.
- **Right-Click Context Menu**:
  - `Filler: Fill All Inputs on Page`
  - `Filler: Fill Current Form`
  - `Filler: Fill Only This Field`
  - `Filler: Clear Form Data`
- **Popup Action**: Click the extension icon in the toolbar for one-click fill, active form fill, form clear, and instant clipboard mock data generation.

### 5. 📋 Quick Generator & Clipboard
- Open the extension popup to instantly copy single mock data values to your clipboard with 1 click (Full Name, Email, Phone, Strong Password, Valid Credit Card, Address, UUID, Company).

---

## 📁 File Structure

```text
filler/
├── README.md           # Documentation & instructions
├── manifest.json       # Chrome Manifest V3 configuration
├── background.js       # Background service worker (shortcuts & context menus)
├── content.js          # Core form detection and silent form filling logic
├── filler-engine.js    # Standalone realistic English mock data generator
├── popup.html          # Modern dark-mode popup interface
├── popup.css           # Popup styling
├── popup.js            # Popup controller & clipboard generator
├── test-form.html      # Comprehensive sample form for testing
└── icons/              # Generated high-resolution icons (16, 32, 48, 128 px)
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ How to Install in Chrome

1. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the directory:
   ```
   /Users/iwanjeriatno/Sites/JERI/public/extentions/filler
   ```
5. The **Filler** extension will be loaded and active immediately with the custom logo!

---

## 🧪 Testing the Extension

1. Open `test-form.html` in Chrome:
   ```
   file:///Users/iwanjeriatno/Sites/JERI/public/extentions/filler/test-form.html
   ```
2. Press <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> or click **⚡ Fill All Forms** in the Filler popup.
3. Observe all inputs, dropdowns, radios, checkboxes, passwords, and textareas get populated with realistic English dummy data!
