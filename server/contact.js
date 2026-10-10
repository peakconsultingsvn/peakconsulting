import{Router}from'express';
import{rateLimit}from'express-rate-limit';
import nodemailer from'nodemailer';
import{randomUUID}from'node:crypto';
import{validateContact,validatePartnership,emailPattern}from'./validation.js';
const failure='We could not submit your inquiry. Please review the information and try again.';
export function contactRouter(env=process.env,kind='project'){
 const router=Router();
 const configured=Boolean(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASSWORD&&emailPattern.test(env.SMTP_FROM_EMAIL||'')&&emailPattern.test(env.CONTACT_RECEIVER_EMAIL||''));
 const transport=configured?nodemailer.createTransport({host:env.SMTP_HOST,port:Number(env.SMTP_PORT||587),secure:env.SMTP_SECURE==='true',requireTLS:env.SMTP_SECURE!=='true',auth:{user:env.SMTP_USER,pass:env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000,logger:false,debug:false,disableFileAccess:true,disableUrlAccess:true}):null;
 router.use(rateLimit({windowMs:15*60*1000,limit:Number(env.CONTACT_RATE_LIMIT||5),standardHeaders:'draft-8',legacyHeaders:false,message:{success:false,code:'RATE_LIMITED',message:'Too many inquiries. Please try again later or contact us by email.'}}));
 router.post('/',async(req,res)=>{
  res.set('Cache-Control','no-store');
  if(!req.is('application/json'))return res.status(415).json({success:false,code:'UNSUPPORTED_MEDIA_TYPE',message:failure});
  const{data,errors}=(kind==='partnership'?validatePartnership:validateContact)(req.body);
  if(Object.keys(errors).length)return res.status(422).json({success:false,code:'VALIDATION_ERROR',message:failure,errors});
  if(!transport)return res.status(503).json({success:false,code:'EMAIL_NOT_CONFIGURED',message:'Online inquiries are currently unavailable. Please email peakdispatch@gmail.com or call +389 78 395 246.'});
  const requestId=randomUUID();
  const text=kind==='partnership'?['Peak Consulting, powered by Peak Dispatch','','Sales collaboration inquiry',`Contact email: ${data.email||'Not provided'}`,`Contact phone: ${data.phone||'Not provided'}`,`Submitted at (UTC): ${new Date().toISOString()}`,`Reference: ${requestId}`].join('\n'):['Peak Consulting, powered by Peak Dispatch','','New project inquiry',`Full name: ${data.fullName}`,`Company or organization: ${data.company}`,`Email: ${data.email}`,`Phone: ${data.phone}`,`Service: ${data.service}`,`Budget: ${data.budget||'Not provided'}`,`Submitted at (UTC): ${new Date().toISOString()}`,`Reference: ${requestId}`,'','Project details:',data.details].join('\n');
  try{
   const info=await transport.sendMail({from:{name:'Peak Consulting',address:env.SMTP_FROM_EMAIL},to:env.CONTACT_RECEIVER_EMAIL,replyTo:data.email||undefined,subject:kind==='partnership'?'Peak Consulting | Sales collaboration inquiry':'Peak Consulting | New project inquiry',text});
   if(!info.accepted?.some(a=>String(a).toLowerCase()===env.CONTACT_RECEIVER_EMAIL.toLowerCase()))throw Object.assign(new Error('Recipient not accepted'),{code:'RECIPIENT_REJECTED'});
  }catch(error){
   const safeCodes=new Set(['EAUTH','ECONNECTION','ETIMEDOUT','EDNS','ESOCKET','ETLS','EENVELOPE','RECIPIENT_REJECTED']);
   console.error(JSON.stringify({event:'contact_email_failed',requestId,code:safeCodes.has(error.code)?error.code:'EMAIL_ERROR'}));
   return res.status(502).json({success:false,code:'EMAIL_ERROR',message:failure,requestId});
  }
  // SMTP acceptance is submission confirmation, not proof of inbox delivery.
  if(env.SEND_CONFIRMATION_EMAIL==='true'&&data.email&&kind==='project'){
   try{await transport.sendMail({from:{name:'Peak Consulting',address:env.SMTP_FROM_EMAIL},to:data.email,subject:'We have received your project inquiry | Peak Consulting',text:'Thank you for contacting Peak Consulting, powered by Peak Dispatch.\n\nYour project inquiry has been submitted successfully. We will use the information you provided to understand your requirements and respond to your inquiry.\n\nPeak Consulting\n+389 78 395 246\npeakdispatch@gmail.com'});}catch{console.error(JSON.stringify({event:'confirmation_email_failed',requestId,code:'EMAIL_ERROR'}));}
  }
  return res.json({success:true,code:'SUBMITTED',message:'Thank you. Your inquiry has been submitted successfully.',requestId});
 });
 router.all('/',(_req,res)=>res.status(405).set('Allow','POST').json({success:false,code:'METHOD_NOT_ALLOWED',message:'Please submit inquiries using the contact form.'}));
 return router;
}
