# Start the updated Peak Consulting website

1. Extract the ZIP into a NEW folder.
2. Install Node.js 22 or newer if not already installed.
3. Windows: double-click START-WINDOWS.bat. Linux/macOS: run sh start.sh.
4. Open http://localhost:3000 after the server starts.

The .env file is included with your sender and receiver settings. SMTP_PASSWORD is intentionally empty. Revoke the password shared in chat, create a new App Password for aplikacijajts@gmail.com, and enter it only in your local .env. Restart the server afterward.

Receiver: peak.dispatch.pro@gmail.com. Sender: aplikacijajts@gmail.com.

Without SMTP credentials the website works, but submissions return an honest unavailable message. No fake email success is shown.

The sales popup opens on each page load and refresh. It can be closed with Escape, the close button, or an outside click. Provide a contact email OR phone number and consent. Reopen it with Become a Sales Partner in the footer.

## Preserve your existing local changes
Your locally added client logos and descriptions were not uploaded here. Copy your existing public/clients.js and client logo/image files into this new folder. Keep the new peak-dispatch.png. If you have other custom changes, back up the old folder first and merge them. Do not replace the new .env with the old exposed password.

## Changes
- Original Peak Dispatch logo beside Powered by throughout visible branding.
- English sales invitation with the supplied 7-country statement, 10% of profit and product P&L visibility.
- POST /api/partnership with email-or-phone validation, consent, size limits, honeypot, rate limiting and SMTP integration.
- No SMTP password included.

The 7-country and commercial statements are supplied by you, not independently verified. Define profit calculation, attribution and payment arrangements in your collaboration agreement before launch. No additional commercial terms were invented.

Live SMTP delivery and visual browser/device testing are not confirmed. See QA-REPORT.txt.
