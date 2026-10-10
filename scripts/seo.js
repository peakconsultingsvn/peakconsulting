import{readFile,writeFile}from'node:fs/promises';
import{siteConfig}from'../public/config.js';
const url=value=>{if(!value)return '';const u=new URL(value);if(u.protocol!=='https:')throw new Error('SEO URLs must use HTTPS.');return u.href;};
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const canonical=url(siteConfig.canonicalUrl),image=url(siteConfig.socialImage);
const schema={'@context':'https://schema.org','@type':'Organization',name:'Peak Consulting',email:'peakdispatch@gmail.com',telephone:'+389 78 395 246',slogan:'Peak Consulting, powered by Peak Dispatch',description:'AI solutions, business process automation, web development, and custom applications.'};
if(canonical){schema.url=canonical;schema.logo=new URL('/assets/logos/peak-consulting.png',canonical).href;}
const tags=[];
if(canonical)tags.push(`<link rel="canonical" href="${escape(canonical)}">`,`<meta property="og:url" content="${escape(canonical)}">`);
if(image)tags.push(`<meta property="og:image" content="${escape(image)}">`,`<meta property="og:image:alt" content="Peak Consulting, powered by Peak Dispatch">`,`<meta name="twitter:image" content="${escape(image)}">`);
tags.push(`<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`);
const file=new URL('../public/index.html',import.meta.url);let html=await readFile(file,'utf8');html=html.replace(/<!-- SEO_CONFIG_START -->[\s\S]*?<!-- SEO_CONFIG_END -->/,`<!-- SEO_CONFIG_START -->\n${tags.join('\n')}\n<!-- SEO_CONFIG_END -->`);await writeFile(file,html);
if(canonical){await writeFile(new URL('../public/sitemap.xml',import.meta.url),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(canonical)}</loc></url></urlset>`);await writeFile(new URL('../public/robots.txt',import.meta.url),`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${new URL('/sitemap.xml',canonical).href}\n`);}
console.log(canonical?'SEO metadata generated. Restart the server to refresh the CSP hash.':'Organization metadata generated. Configure canonicalUrl and socialImage before launch.');
