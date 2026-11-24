# FlowLedger Nexus

A runnable tuition-business operations MVP. Includes a responsive dashboard, students and batches, monthly invoices, partial payments, printable receipts, expenses, payment commitments, cash scenarios, billing-gap detection, and a rule-based Rescue Planner.

## Run on Windows

Install Node.js 22 or later. Open this folder in VS Code, then run:

```powershell
npm start
```

Open http://127.0.0.1:4187 in your browser. Keep the terminal running. No dependency installation or API key is required. If that port is busy, set `$env:PORT=4188` before running `npm start`.

## Test

```powershell
npm test
```

Tests cover payment validation and balances, duplicate-safe monthly billing, promise allocation without double counting, scenario isolation and delayed collection timing, and paid-expense handling.

## Demo walkthrough

1. Explore the sample business overview.
2. Open Students and add a student with a batch and monthly fee.
3. Open Invoices and create an invoice, or use Monthly billing.
4. Open an invoice and record a partial payment. The outstanding amount and available cash update.
5. Open Rescue Planner to review overdue invoices and missing billing. Draft a reminder or save a payment commitment.
6. Open Expenses and add a scheduled rent bill.
7. Open Decision Lab and compare the baseline with a 15-day collection delay. Save the scenario.
8. Open Batches to model contribution and break-even enrollment.
9. Export a backup from Settings. Use Start empty workspace when ready to enter your own records.

## Data and accounting rules

- Records persist in this browser's localStorage. Different browsers, ports, and hosted URLs have separate workspaces. Transfer records through Export backup and Restore backup.
- Available cash = opening balance + recorded payments - expenses marked paid.
- Outstanding = invoice amount - recorded payments. Overpayments and future-dated received payments are rejected.
- Monthly billing creates at most one invoice per active student per selected month, due on the fifth. It does not run on a background schedule.
- Forecasts include saved invoices and unpaid expenses only. They do not silently create future recurring invoices or expenses.
- Overdue fees are assumed collected seven days from today unless covered by a future payment commitment. Uncovered future fees use their due dates. Overdue expenses are scheduled today.
- Commitments affect expected timing, not confirmed cash. The forecast caps commitments at the outstanding amount.
- Scenario changes do not alter real records. Saved scenarios store assumptions and recalculate against current records.
- Whole rupees are supported in this MVP.
- Print / PDF opens the browser print dialog; select Save as PDF to create a document.

## Scope and limitations

This is a browser-local MVP, not the full production SaaS proposed in the earlier specification. There is no database server, multi-user authentication, role enforcement, parent portal, payment gateway, bank reconciliation, OCR, attendance management, advance credit, refunds, or automatic messaging. Reminder drafts and action recommendations are deterministic templates and rules, not a connected AI model. The activity history is a local convenience log, not a tamper-resistant audit trail. Back up data before clearing browser storage. Google Fonts is optional; system-font fallbacks work without it.

## Source layout

- `dist/index.html`: application shell
- `dist/styles.css`: responsive visual design
- `dist/app.js`: screens, forms, local persistence, import/export
- `dist/engine.js`: calculations, payment validation, billing, sample data
- `tests/engine.test.mjs`: financial-engine tests
- `server.mjs`: local static server
- `.openai/hosting.json`: private Site deployment configuration

For a production release, move financial writes into a transactional API and database, add authenticated business-level authorization and server validation, durable backups, payment reversal workflows, and end-to-end tests before accepting real customer payments.
