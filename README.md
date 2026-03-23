# Maxsight Forms Configuration Prototype

A prototype to **visualise form configuration** in the Maxsight UI. The layout and navigation match the [Moody's Configuration](https://xus.maxsight.com) pattern: top-level **Views** and **Configuration**, with a Configuration sidebar that includes **Data configuration**, **Risk models**, **Form configuration**, and **External forms view**.

## Features

- **Manage forms** – List all forms (internal/external), status, last modified, response count. Actions: Configure, Duplicate, Archive. For external forms: **Send via email**. “New form” button.
- **Form configuration** – Form details (name, description), **Task type**: dropdown of task types (Internal, External, and any custom types). **Add task type**: create further task types (e.g. Compliance review). **Pre-fill with entity data**: allow pre-fill from entity data; field mapping (form field → entity data source). **Form expiry**: links expire after X days (external only); no “Form valid until” date. **External form URL, sender & branding**: sender email address (for form and reminders), external form URL (base URL for links in emails), email branding (sender display name, logo URL, primary colour). **Branding & URL presets (external only)**: save the current sender, URL, and branding as a named preset (stored in the browser) and apply it to any other external form—similar to SurveyJS custom themes; list of saved presets with Apply and Delete. **Automated reminders**: enable reminders before link expiry, predefined reminder email body; sender from the branding card. **Form structure**: add questions (field type, title, field name, mandatory, branching, placeholder/hint, help text, multiple choice for dropdown/radio/checkbox, accept for file). Mandatory fields, mandatory documents & file upload. Branching rules table.
- **External forms** – Shown in **Views → Tasks**: use the **Task type** filter and choose **SC Forms** to see all sent external forms. Table columns: Task (form name, link to form view), Task type, Entity, Sent To, Assessment, Status, Assigned to, Created, Actions (Resend, Remind, Extend expiration, Expire, View). Form name opens the form view (full or side view). **Send form via email** is in the task list when filtered to SC Forms (disabled for V1). Forms management reuses the task platform: users can review status, resend, extend expiration, or expire a form.
- **Send form via email flow** – Step 1: Select form (external forms only). Step 2: Recipient email addresses (+ add more). Step 3: Email subject and message (optional). Step 4: Review & send. Back / Next / Send form. Cancel returns to External forms dashboard.
- **Theme** – Top nav: **Views** | **Configuration**. **Views** sidebar: Portfolio, Risk, **Tasks**. Under **Tasks** (#/views/tasks), a **Task type** filter (All, SC Forms) shows either all tasks or only external/SC forms with columns: Task, Task type, Entity, Sent To, Assessment, Status, Assigned to, Created, Actions. **Configuration** sidebar: Data configuration, Risk models, Form configuration (no separate External forms view).

## Open the prototype (no npm)

**Double-click `open.html`** (in the `maxsight-forms-prototype` folder) or open it from your browser (File → Open File → choose `open.html`).

- No `npm install` or `npm run dev` required.
- Works offline after the first load (Inter font loads from Google Fonts when online).
- Uses hash routing: `#/views`, `#/views/tasks`, `#/views/risk`, `#/forms`, `#/forms/new`, `#/forms/1`, `#/config/data`, `#/config/risk-models`, `#/external/form/:id`, `#/external/send/1`–`4`.

## Run with npm (optional React version)

```bash
cd maxsight-forms-prototype
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). The same UI is also in `src/` for development.

## Routes (standalone: use hash in URL)

| Hash / path | Description |
|-------------|-------------|
| `#/views` | Views (Portfolio landing); Views sidebar: Portfolio, Risk, Tasks |
| `#/views/tasks` | **Tasks** list with **Task type** filter (All, SC Forms). When SC Forms: table of sent forms with Task, Task type, Entity, Sent To, Assessment, Status, Assigned to, Created, Actions (Resend, Remind, Extend expiration, Expire, View) |
| `#/views/risk` | Risk view placeholder |
| `#/forms` | Form configuration → Manage forms |
| `#/forms/new` | New form configuration |
| `#/forms/1` | Configure form (branching, form structure) |
| `#/config/data` | Data configuration (Configuration sidebar) |
| `#/config/risk-models` | Risk models (Configuration sidebar) |
| `#/external/form/:id` | View/complete a single external form (from Tasks when Task type = SC Forms); form opens in full or side view |
| `#/external/send/1` … `#/external/send/4` | Send form via email – 4-step flow |

## Tech stack

- React 18 + TypeScript
- React Router 6
- Vite
- Inline styles using a central `theme` (no CSS-in-JS dependency)

## Design reference

- **Moody's / Maxsight Configuration:** Top nav Views | Configuration; Configuration sidebar: Data configuration, Risk models, Form configuration, External forms view.
- **Figma:** [Monitoring-alerts](https://www.figma.com/design/TRK2ZsSIIhtsWKJ7mRwkvf/Monitoring-alerts?node-id=711-36048); [Views](https://www.figma.com/design/Mj7tH0YmpDD3ZDRRdI2JZo/Views?node-id=0-1).
- Theme tokens in `src/theme.ts`.

## Meeting feedback / design decisions

The prototype reflects decisions from product/design discussions:

- **Task type & form type columns** – Manage forms table shows Task type (Screening, Monitoring, Risk) and Form type (e.g. KYB, MLRO review). Task type is populated for all tasks; form type identifies the form. Filter dropdowns let users create custom views.
- **Three-dot action menu** – Manage forms: Configure, Send via email (external), Duplicate, Archive, Expire. External dashboard: View response, Resend, Remind, Cancel, Expire.
- **Form expiry** – Links expire after X days; no “Form valid until”. Reminders configurable via Automated reminders card.
- **External form URL, sender & branding** – Sender email (form and reminders), external form base URL, sender display name, logo URL, primary colour.
- **Automated reminders** – Enable reminders before expiry; predefined reminder email body; sender from branding card.
- **Pre-fill** – Prefill is captured at time of sending; resending does not update prefilled data. Field mapping enforces type consistency (e.g. string → string).
- **Per-question config** – Placeholder / hint (example answer) and Help text / tooltip for user guidance.
- **Send flow** – Optional “Pre-notification email”; sender, form URL and branding are set in form configuration.
- **Form completion** – Statuses Opened / Started / Completed; auto-save; users can view and reuse previous responses (noted in Form structure card).

## Scope (Q3 V1) — Deduplication, external send, assessments

- **Deduplication**
  - **Same form type only:** Form name is deduplicated when the same form is used in multiple places with the **same form type**. When there is a **different form type**, deduplication does not apply (different form types never share responses).
  - **Time limit (optional):** An option limits deduplication to responses from the last X days so that **historical forms and entities are not impacted**. Leave empty for no limit.
- **External forms — V1 (Q3):** Sending forms via email **manually is not available** in V1. The workflow is not dynamic for manual send. External forms are **auto-sent within a workflow step** only. The prototype disables "Send via email" and "Send form via email" and shows a scope note; manual send may be considered for a later release.
- **Forms in assessments**
  - Forms are raised in a workflow step per entity or assessment. When the same form type is needed for multiple assessments, deduplication can reuse one response (see above).
  - **When new data arrives** and a form impacts multiple assessments (e.g. form raised for one entity but not others already onboarded): configuration option **Accept** vs **Wait**.
    - **Accept:** Accept new data and allow re-request or update; re-request the form where the new data applies so assessments stay in sync.
    - **Wait:** Do not re-request automatically; keep using the existing response until manually overridden (e.g. to avoid re-sending to already-onboarded entities).

## Next steps (production)

- Replace the static “form structure” block with **SurveyJS Creator** (or a schema-driven builder) for full drag-and-drop configuration.
- Connect “Manage forms” to a backend API; wire Save/Cancel and list actions to real data.
- Add filters (e.g. by form type, status) and search on the manage-forms page.
