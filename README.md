# Updated release

Read START-HERE.md first. This release adds the Peak Dispatch logo and sales collaboration popup. The included .env routes submissions to peak.dispatch.pro@gmail.com and uses aplikacijajts@gmail.com as sender. SMTP_PASSWORD is blank.

# Peak Consulting
## Peak Consulting, powered by Peak Dispatch

Complete English-language website source with a vanilla JavaScript frontend and a Node.js/Express contact API. The project is ready for configuration and deployment review, not a claim of independently certified production readiness.

## Quick start
1. Extract the ZIP and open a terminal in the project folder.
2. Use Node.js 22 or newer.
3. Install the locked dependencies:
   ```sh
   npm ci
   ```
4. Copy `.env.example` to `.env`.
   - macOS/Linux: `cp .env.example .env`
   - Windows PowerShell: `Copy-Item .env.example .env`
5. Start the application:
   ```sh
   npm start
   ```
6. Open `http://localhost:3000` in your browser. Use this exact origin, rather than 127.0.0.1, unless you also change FRONTEND_URL.

For a no-install visual preview, open `preview.html` directly. This self-contained preview supports navigation, filters and modals. Its inquiry submission is intentionally disabled; use the Node.js application for the real API.

## Included features
- Sticky header, responsive mobile menu, premium navy/silver styling and preserved original Peak Consulting logo.
- Hero, introduction, four services, three client categories, interactive portfolio, values, five-step process, CTA, contact and footer.
- Nine client records in one `public/clients.js` array.
- Native modal dialogs, Escape closing, outside-click closing, explicit focus wrapping and focus restoration.
- Grayscale-to-color logo interactions on hover, focus and tap; original aspect ratios preserved with object-fit: contain.
- Visible focus indicators, semantic headings, skip link, form error descriptions, live results and reduced-motion support.
- Local system fonts, no tracking scripts, no animation dependencies, lazy-loaded project assets.
- POST /api/contact with validation, allowlisted normalized plain text, size limit, honeypot, minimum-fill-time check, rate limiting, origin restriction and Helmet headers.
- SMTP credentials remain server-side. No database or submission storage is included.
- Confirmation email is implemented but disabled by default.
- SEO metadata, known-field Organization JSON-LD, configurable canonical/social image and a static SEO generation script.

## SMTP configuration
Set these values in `.env` or your hosting provider's secret environment settings:
```env
CONTACT_RECEIVER_EMAIL=peakdispatch@gmail.com
SMTP_HOST=YOUR_SMTP_HOST
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_FROM_EMAIL=YOUR_APPROVED_SENDER_ADDRESS
SEND_CONFIRMATION_EMAIL=false
```
The placeholders above are not working credentials. Use settings from your actual provider. The SMTP sender must be approved by the provider. For immediate TLS, configure the provider's port and SMTP_SECURE=true; otherwise the implementation requires STARTTLS. Certificate verification is not disabled.

When SMTP is not configured, the form returns HTTP 503 with an honest unavailable message. Success is returned only after SMTP accepts the receiver address. SMTP acceptance is not proof of inbox delivery. Verify actual receipt and provider delivery logs before launch. A failed optional confirmation does not cause the already-submitted inquiry to be reported as failed.

Set SEND_CONFIRMATION_EMAIL=true only after testing the transport and reviewing abuse controls. The confirmation never echoes project details.

## Client assets and content
Only the Peak Consulting logo was accessible as a distinct binary file in the build environment. Other logos shown in the conversation were not available as separate usable files. No substitute logos were fabricated. Missing assets display the client's name and “Logo asset pending”.

See `ASSET-GUIDE.md` for exact filenames. Add approved client logos and screenshots to the asset folders. Logo color is preserved in the file; grayscale is only a presentation filter.

All client descriptions are based on the supplied brief. No statistics, testimonials, certifications, results, technical architecture or confidential system details were added. The additional shorthand notes about JTS TMS and Alkaloid applications were not expanded into public claims.

Provided client URLs are configured. Baumarket has an empty websiteUrl because no unambiguous client website was supplied. The Facebook share link was not assigned to a client or social profile because its ownership was not established. The Sansiro preview-page URL is recorded in `ASSET-GUIDE.md`; the client website button uses the supplied main domain. Peak Dispatch, Radovish, Minie's and the shared Facebook page did not return usable content during the web check, so verify these links before publishing.

## Public configuration
Edit `public/config.js`:
- canonicalUrl: your actual HTTPS website URL.
- socialImage: your approved absolute HTTPS sharing-image URL.
- privacyPolicyUrl and cookiePolicyUrl: approved HTTPS policy links.
- socialLinks: verified profile names and HTTPS links only.
- dispatchWebsiteUrl: supplied URL; confirm availability.
- apiBase: leave empty for the recommended same-origin deployment.

Then run:
```sh
npm run seo
```
This writes static canonical/Open Graph tags and JSON-LD to index.html. When a canonical URL is configured, it also creates sitemap.xml and updates robots.txt. Restart the server afterward to refresh the JSON-LD CSP hash. Do not publish example domains or placeholder metadata as real organization data.

Privacy and cookie links are visibly labeled placeholders until configured. They are not legal policies. Have the final policies reviewed for the actual deployment, mail provider, retention practices and jurisdiction. The application sets no cookies and installs no analytics. Hosting and email providers may retain logs and messages; configure their retention separately. No legal-compliance claim is made.

## Production deployment checklist
- Supply all approved logos and screenshots, and verify permission to publish client names, logos and project descriptions.
- Configure SMTP, approved sender, recipient and FRONTEND_URL; test actual receipt.
- Set NODE_ENV=production and use an HTTPS FRONTEND_URL. Terminate HTTPS at a properly configured hosting proxy.
- Set TRUST_PROXY_HOPS only to match your known proxy topology. Default 0 is deliberate.
- Use a single application instance with the included in-memory rate limiter. For multiple instances, implement a shared rate-limit store or enforce a consistent limit at the trusted gateway.
- Publish approved policies and configure canonical URL, sharing image and verified social profiles.
- Run npm ci, npm test, npm run check and npm run seo.
- Run a dependency audit in your environment. The registry advisory endpoint returned HTTP 403 during this build; no clean-audit claim is made.
- Test desktop, tablet, 320px mobile, zoom, keyboard-only operation, screen reader behavior, focus restoration, Escape, outside-click closing and reduced motion.
- Test invalid fields, honeypot, oversized payloads, rate limits, rejected origins, SMTP failure, real SMTP acceptance and actual email receipt.
- Review hosting logs so request bodies and email credentials are not logged. The app logs only safe technical error codes and random references.
- Review sender-domain authentication with your email provider and configure monitoring, backups of source/configuration and a rollback procedure.

## Split hosting
Same-origin hosting is the tested configuration. If the frontend and backend use different origins, set apiBase to the real API origin, FRONTEND_URL to the frontend origin, and explicitly update connect-src in the frontend's CSP to allow that API. Do not use wildcard CORS or broadly relax CSP. The API rejects browser origins other than FRONTEND_URL; requests without an Origin are still validated and rate limited. CORS is not authentication or a complete anti-spam system.

## API responses
- 200: SMTP accepted the inquiry; success:true, code:SUBMITTED.
- 422: validation failed; field-specific English errors.
- 403: unapproved Origin.
- 413: request exceeds the 16kb limit.
- 415: unsupported content type.
- 429: rate limit reached.
- 503: SMTP not configured.
- 502: SMTP submission failed.
- 400: malformed JSON.

The frontend never displays success based only on a click, local validation or a simulated transport. Network uncertainty is reported honestly, with a suggestion to check by email before resubmitting.

## Tests and verification
```sh
npm test
npm run check
```
The included validation/data tests and live local API integration tests passed during creation. See QA-REPORT.txt for the exact output and remaining verification limitations. Browser rendering, WCAG conformance, live SMTP and real-device testing were not independently verified.

## Structure
```text
public/
  index.html
  styles.css
  app.js
  clients.js
  config.js
  robots.txt
  assets/
    logos/
    images/
    icons/
server/
  contact.js
  validation.js
scripts/
  seo.js
tests/
  api.test.js
  validation.test.js
server.js
package.json
package-lock.json
.env.example
preview.html
README.md
ASSET-GUIDE.md
QA-REPORT.txt
```

## Implementation references
- Express security: https://expressjs.com/en/advanced/best-practice-security.html
- Nodemailer SMTP: https://nodemailer.com/smtp
- Nodemailer response behavior: https://nodemailer.com/usage

These references inform implementation choices, not the supplied client relationship claims.
"# peakconsulting" 
