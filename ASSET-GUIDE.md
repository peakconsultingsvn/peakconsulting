# Asset Guide

## Included
- public/assets/logos/peak-consulting.png: original uploaded 1254 × 1254 logo, unchanged.
- public/assets/icons/favicon.png: proportional 192 × 192 derivative.

## Add these approved original logo files
- jts-logistics.png: JTS Logistics Inc.
- alkaloid.png: Alkaloid AD
- semos.png: Semos Education
- sansiro.png: Sansiro Parfemi
- minies.png: Minie’s by Sisters
- baumarket.png: Baumarket Sachko
- diabetes.png: Union of Associations of People with Diabetes
- sveti-nikole.png: Municipality of Sveti Nikole
- radovish.png: Municipality of Radovish

Place all files in public/assets/logos/. For another extension, update logoDefault and logoColor in public/clients.js. Do not rename one client's logo to represent another client. The supplied municipal emblems must be matched to the correct municipality before publishing; no emblem was assigned by guessing.

Peak Dispatch's original uploaded logo is included as peak-dispatch.png and used beside Powered by throughout visible branding.

## Screenshots
Place approved screenshots in public/assets/images/. Update projectImages for each client:
```js
projectImages: [
 { src: '/assets/images/client-project.webp', alt: 'Approved descriptive English caption', width: 1200, height: 800 }
]
```
Use actual dimensions and meaningful alt text. The numbers above are an example, not measurements of an existing screenshot. Do not include confidential screens or unsupported results. Empty image arrays display an honest placeholder.

## Additional details
Set additionalDetails only to approved project information. secondaryName is supported but intentionally empty to keep all website text English. The optional Macedonian organization label was not displayed.

## Sharing image
Add an approved social sharing image to public/assets/images/ and configure its absolute HTTPS URL in public/config.js. No fictional project image or fabricated client statement is included.

## Supplied reference page
Sansiro preview reference: https://sansiroperfume.mk/newhomepage/
This reference is not embedded as an iframe or treated as a project screenshot.
