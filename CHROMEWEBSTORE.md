# Smart Form Filler
### Chrome Web Store Publishing Guide & SEO Metadata

## 📋 Store Listing Information

- **Extension Name**: Smart Form Filler
- **Short Description (< 132 chars)**: Universal smart form filler and realistic dummy data generator for web developers, QA engineers, and testers.
- **Category**: Developer Tools
- **Target Keywords**: form filler, auto form filler, dummy data generator, fake filler, test data, fake data generator, developer tools, qa testing tools, form autocomplete

---

## 📝 Detailed Store Description

Fill entire web forms with realistic test data in one second with a single click or keyboard shortcut!

Smart Form Filler is an indispensable productivity tool for software developers, QA engineers, and product testers. Instead of wasting time typing random text like "asdfgh" into registration forms, checkout fields, or surveys, Smart Form Filler analyzes input fields and injects contextual, realistic mock data.

### 🌟 Key Features:
- **⚡ One-Click Form Filling**: Populate inputs, textareas, checkboxes, radio buttons, dropdowns, and date pickers across any webpage.
- **🧠 Context-Aware Smart Detection**:
  - Automatically recognizes field types: Names, Emails, Phone Numbers, Addresses, ZIP Codes, Passwords, Credit Cards (test dummy), Birthdays, and Companies.
  - Matches field `name`, `id`, `placeholder`, `aria-label`, and surrounding label text.
- **⌨️ Keyboard Shortcut Support**: Press **`Alt+Shift+F`** (or `Option+Shift+F` on macOS) to instantly fill all forms without touching your mouse.
- **🖱️ Context Menu Integration**: Right-click on any individual input or entire form to fill selected targets on demand.
- **🎨 Modern Floating Control**: Easily trigger form population or reset inputs back to empty.
- **🛡️ Safe for Production Testing**: Generates test dummy data (`@example.com`, RFC-reserved phone numbers) preventing accidental real spam during testing.

---

## 🔒 Permissions Justification

| Permission | Technical Need | Plain-English Justification for Reviewers |
| :--- | :--- | :--- |
| `activeTab` | `chrome.tabs` API | Grants temporary access to fill forms only on the currently active tab when invoked. |
| `scripting` | `chrome.scripting` API | Injects the form-filling engine to query form inputs and dispatch native `input` / `change` events. |
| `storage` | `chrome.storage` API | Saves user dummy data preferences and custom field templates locally. |
| `contextMenus` | `chrome.contextMenus` API | Adds right-click shortcuts to fill all forms or single fields. |
| `<all_urls>` | Host Permission & Content Script | Necessary to allow form filling across any web application under development or QA review. |

---

## 🛡️ Privacy & Data Use Disclosure

- **Client-Side Only**: All mock data is generated locally in Javascript. No input data, form contents, or website data are transmitted externally.
- **Zero Tracking**: Does not collect user browsing habits, credentials, or cookies.
