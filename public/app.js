import { clients } from './clients.js';
import { siteConfig } from './config.js';
const $=s=>document.querySelector(s);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}};
const localAsset=value=>typeof value==='string'&&/^\/assets\/[a-zA-Z0-9_./-]+$/.test(value)&&!value.includes('..')?value:'';
const categories=['AI & Automation','Web Development','Application Development'];
const categoryIds=['ai-automation','web-development','application-development'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('#year').textContent=new Date().getFullYear();
// Loader never delays initialization or locks the page. No-JS and reduced-motion paths bypass it.
if(!reduced.matches){$('#loader').hidden=false;setTimeout(()=>{$('#loader').hidden=true;},1300);}
const menu=$('#menu-toggle'),nav=$('#navigation');
function closeMenu(restore=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');if(restore)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
matchMedia('(min-width: 961px)').addEventListener('change',()=>closeMenu());
// Local logo paths only. Missing assets are clearly labeled, never replaced by another client's logo.
function logo(client,color=false){
 const box=el('span',color?'modal-logo':'client-logo');
 const fallback=()=>{box.replaceChildren();const p=el('span','logo-placeholder',client.name);p.append(el('small','', 'Logo asset pending'));box.append(p);};
 const src=localAsset(color?client.logoColor:client.logoDefault);
 if(!src){fallback();return box;}
 const img=el('img');img.alt=`${client.name} logo`;img.width=320;img.height=160;img.loading='lazy';img.decoding='async';img.addEventListener('error',fallback,{once:true});img.src=src;box.append(img);return box;
}
function clientCard(client){
 const card=el('button','client-card');card.type='button';card.setAttribute('aria-label',client.accessibilityLabel);card.setAttribute('aria-haspopup','dialog');
 card.append(logo(client),el('span','category-label',client.service),el('span','client-name',client.name),el('span','client-summary',client.shortDescription));
 const view=el('span','view-project','View Project');const arrow=el('span','','↗');arrow.setAttribute('aria-hidden','true');view.append(arrow);card.append(view);
 card.addEventListener('click',()=>openProject(client,card));
 if(client.logoColor!==client.logoDefault){const swap=color=>{const img=card.querySelector('img');const path=localAsset(color?client.logoColor:client.logoDefault);if(img&&path)img.src=path;};card.addEventListener('pointerenter',()=>swap(true));card.addEventListener('pointerleave',()=>swap(false));card.addEventListener('focus',()=>swap(true));card.addEventListener('blur',()=>swap(false));}
 return card;
}
for(const [i,category] of categories.entries()){
 const section=el('section','category');section.id=categoryIds[i];const heading=el('div','category-heading');const h=el('h3','',category.toUpperCase());h.id=`category-${i}`;section.setAttribute('aria-labelledby',h.id);heading.append(h);const grid=el('div','client-grid');clients.filter(c=>c.category===category).forEach(c=>grid.append(clientCard(c)));section.append(heading,grid);$('#client-categories').append(section);
}
function renderProjects(category='All Projects'){
 const selected=clients.filter(c=>category==='All Projects'||c.category===category);$('#portfolio-grid').replaceChildren(...selected.map(clientCard));$('#project-count').textContent=`${selected.length} projects shown.`;
 $('#filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===category)));
}
for(const category of ['All Projects',...categories]){const b=el('button','filter',category);b.type='button';b.setAttribute('aria-pressed',String(category==='All Projects'));b.addEventListener('click',()=>renderProjects(category));$('#filters').append(b);}renderProjects();
const icons=[
 '<circle cx="20" cy="20" r="10"/><path d="M20 4v6m0 20v6M4 20h6m20 0h6M9 9l4 4m14 14 4 4M9 31l4-4m14-14 4-4"/><path d="m15 22 5-10 5 10m-8-3h6"/>',
 '<rect x="3" y="4" width="12" height="10" rx="2"/><rect x="25" y="26" width="12" height="10" rx="2"/><path d="M15 9h16v17M25 31H9V14m18 8 4 4 4-4M5 18l4-4 4 4"/>',
 '<rect x="3" y="6" width="34" height="28" rx="3"/><path d="M3 14h34m-25 7-4 4 4 4m16-8 4 4-4 4m-6-10-4 12"/>',
 '<rect x="4" y="4" width="13" height="13" rx="2"/><rect x="23" y="4" width="13" height="13" rx="2"/><rect x="4" y="23" width="13" height="13" rx="2"/><rect x="23" y="23" width="13" height="13" rx="2"/>'
];
const services=[
 ['Artificial Intelligence','Practical AI solutions designed to support decision-making, improve information processing, enhance customer experiences, and create more efficient business workflows.','ai-automation'],
 ['Process Automation','Automation of repetitive, manual, and time-consuming processes through intelligent workflows, integrations, notifications, approvals, and data-driven systems.','ai-automation'],
 ['Web Development','Professional, responsive, and conversion-focused websites designed to strengthen brands, improve digital presence, and deliver excellent user experiences.','web-development'],
 ['Custom Applications','Purpose-built web and business applications designed around specific organizational processes, operational requirements, and user needs.','application-development']
];
services.forEach(([name,description,target],i)=>{const card=el('article','service-card reveal');const icon=el('span','service-icon');icon.setAttribute('aria-hidden','true');icon.innerHTML=`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${icons[i]}</svg>`;const link=el('a','','Learn More ↗');link.href=`#${target}`;link.setAttribute('aria-label',`Learn more about ${name}`);card.append(icon,el('h3','',name),el('p','',description),link);$('#service-grid').append(card);});
const steps=[['Discover','We learn about the organization, its current processes, challenges, users, and objectives.'],['Define','We identify the right solution, project scope, requirements, and implementation priorities.'],['Design','We create the user experience, technical structure, visual direction, and solution workflow.'],['Develop','We build, integrate, test, and optimize the solution.'],['Deliver','We prepare the final solution for launch and provide the necessary implementation guidance.']];
steps.forEach(([name,description])=>{const li=el('li','reveal');li.append(el('h3','',name),el('p','',description));$('#process-list').append(li);});
// Native modal plus explicit focus wrapping and restoration.
const dialog=$('#project-dialog'),content=$('#modal-content'),close=$('#modal-close');let opener=null;
function showModal(source){opener=source||document.activeElement;dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;close.focus();}
function openProject(client,source){
 content.replaceChildren(logo(client,true),el('p','eyebrow',client.category),el('h2','',client.modalTitle));content.querySelector('h2').id='modal-title';
 if(client.secondaryName)content.append(el('p','',client.secondaryName));content.append(el('p','lead',client.fullDescription));
 const meta=el('dl','modal-meta');for(const [label,value] of [['Project category',client.category],['Service provided',client.service],['Project',client.project],['Market',client.market]]){if(value){const div=el('div');div.append(el('dt','',label),el('dd','',value));meta.append(div);}}content.append(meta);
 const images=client.projectImages.filter(p=>localAsset(typeof p==='string'?p:p.src));
 if(images.length){for(const item of images){const img=el('img','project-image');img.src=localAsset(typeof item==='string'?item:item.src);img.alt=typeof item==='string'?`${client.name} project image`:item.alt||`${client.name} project image`;img.width=typeof item==='object'?item.width||1200:1200;img.height=typeof item==='object'?item.height||800:800;img.loading='lazy';img.addEventListener('error',()=>img.replaceWith(el('p','image-placeholder','Project image is currently unavailable.')),{once:true});content.append(img);}}
 else content.append(el('p','image-placeholder','Project images have not been added yet.'));
 content.append(el('h3','','Additional Project Details'),el('p','',client.additionalDetails||'Additional project details have not been provided.'));
 const url=safeUrl(client.websiteUrl);if(url){const a=el('a','button','Visit Client Website ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`Visit ${client.name} website (opens in a new tab)`);content.append(a);}content.append(el('p','brand-message','Peak Consulting, powered by Peak Dispatch'));showModal(source);
}
close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(opener?.isConnected)opener.focus();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const nodes=[...dialog.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(n=>!n.disabled&&!n.hidden);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
for(const button of document.querySelectorAll('[data-policy]')){
 const type=button.dataset.policy;const url=safeUrl(type==='privacy'?siteConfig.privacyPolicyUrl:siteConfig.cookiePolicyUrl);
 if(url){const a=el('a','policy-button',type==='privacy'?'Privacy Policy':'Cookie Policy');a.href=url;button.replaceWith(a);}else button.addEventListener('click',()=>{const h=el('h2','',type==='privacy'?'Privacy Policy Placeholder':'Cookie Policy Placeholder');h.id='modal-title';content.replaceChildren(h,el('p','','The approved policy has not been configured. This placeholder is not a published legal policy. Please contact peakdispatch@gmail.com for questions about your information.'));showModal(button);});
}
const dispatch=safeUrl(siteConfig.dispatchWebsiteUrl);if(dispatch){$('#dispatch-link').href=dispatch;$('#dispatch-link').target='_blank';$('#dispatch-link').rel='noopener noreferrer';$('#dispatch-link').hidden=false;}
for(const social of siteConfig.socialLinks){const url=safeUrl(social.url);if(url){const a=el('a','text-link',`${social.name} ↗`);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${social.name} profile (opens in a new tab)`);$('#social-links').append(a);}}
// SEO tags are also statically generated by scripts/seo.js for non-JavaScript crawlers.
const canonical=safeUrl(siteConfig.canonicalUrl);if(canonical&&!document.querySelector('link[rel=canonical]')){const link=el('link');link.rel='canonical';link.href=canonical;document.head.append(link);}
const socialImage=safeUrl(siteConfig.socialImage);if(socialImage&&!document.querySelector('meta[property="og:image"]')){const m=el('meta');m.setAttribute('property','og:image');m.content=socialImage;document.head.append(m);}
// Accessible, English-only form controls and validation.
const form=$('#inquiry'),result=$('#form-result');let startedAt=Date.now(),sending=false;
const fields=[['fullName','Full Name','text',2,100,'name'],['company','Company or Organization','text',2,160,'organization'],['email','Business Email','email',3,254,'email'],['phone','Phone Number','tel',5,40,'tel'],['service','Service of Interest','select',1,60,'off'],['budget','Project Budget (optional)','text',0,100,'off'],['details','Project Details','textarea',20,5000,'off']];
const serviceOptions=['Artificial Intelligence','Process Automation','Web Development','Custom Application','Technology Consulting','Other'];
for(const [name,label,type,min,max,autocomplete] of fields){const box=el('div',name==='details'?'field wide':'field');const l=el('label','',label+(min?' *':''));l.htmlFor=name;let input;
 if(type==='select'){input=el('select');const option=el('option','','Select a service');option.value='';input.append(option);for(const value of serviceOptions){const o=el('option','',value);o.value=value;input.append(o);}}
 else if(type==='textarea')input=el('textarea');else{input=el('input');input.type=type;}
 input.id=name;input.name=name;input.autocomplete=autocomplete;input.required=min>0;if(type!=='select'){input.minLength=min;input.maxLength=max;}input.setAttribute('aria-describedby',`error-${name}`);const error=el('span','field-error');error.id=`error-${name}`;box.append(l,input,error);$('#form-fields').append(box);
}
function setErrors(errors={}){for(const name of [...fields.map(f=>f[0]),'consent']){const input=form.elements.namedItem(name);input.setAttribute('aria-invalid',String(Boolean(errors[name])));$(`#error-${name}`).textContent=errors[name]||'';}}
function validate(data){const errors={};for(const [name,,type,min,max] of fields){const value=data[name];if(type==='select'){if(!serviceOptions.includes(value))errors[name]='Please select a service of interest.';}else if(value.length<min||value.length>max)errors[name]=`Please enter ${min} to ${max} characters.`;}
 if(!errors.email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email))errors.email='Please enter a valid business email address.';
 if(!errors.phone&&(!/^[+()\d\s.\-]+$/.test(data.phone)||data.phone.replace(/\D/g,'').length<5))errors.phone='Please enter a valid phone number.';
 if(!data.consent)errors.consent='Please agree to the use of your information to respond to your inquiry.';return errors;
}
form.addEventListener('submit',async e=>{e.preventDefault();if(sending)return;
 const data=Object.fromEntries(fields.map(([name])=>[name,form.elements.namedItem(name).value.trim()]));data.consent=form.elements.consent.checked;data.website=form.elements.website.value;data.startedAt=startedAt;
 const errors=validate(data);setErrors(errors);result.dataset.state='error';
 if(Object.keys(errors).length){result.textContent='Please review the highlighted fields before submitting your inquiry.';form.elements.namedItem(Object.keys(errors)[0]).focus();return;}
 sending=true;const submit=form.querySelector('[type=submit]');submit.disabled=true;form.setAttribute('aria-busy','true');submit.textContent='Sending Your Inquiry…';result.dataset.state='loading';result.textContent='Submitting your project inquiry.';
 try{const response=await fetch(`${siteConfig.apiBase}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const payload=await response.json();
 if(!response.ok||payload.success!==true){setErrors(payload.errors||{});result.dataset.state='error';result.textContent=payload.message||'We could not submit your inquiry. Please review the information and try again.';const first=Object.keys(payload.errors||{}).find(n=>form.elements.namedItem(n));if(first)form.elements.namedItem(first).focus();}
 else{result.dataset.state='success';result.textContent='Thank you. Your inquiry has been submitted successfully.';form.reset();startedAt=Date.now();setErrors();}
 }catch{result.dataset.state='error';result.textContent='We could not confirm submission of your inquiry. Please contact us by email before trying again to avoid a duplicate inquiry.';}
 finally{sending=false;submit.disabled=false;submit.textContent='Send Project Inquiry ↗';form.removeAttribute('aria-busy');}
});
// Only reveal content when observation is available. No hidden content on failure.
if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('pending');entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.08});for(const n of document.querySelectorAll('.reveal')){n.classList.add('pending');observer.observe(n);}reduced.addEventListener('change',()=>{if(reduced.matches){document.querySelectorAll('.pending').forEach(n=>n.classList.remove('pending'));observer.disconnect();}});}
