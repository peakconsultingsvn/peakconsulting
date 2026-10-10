import'dotenv/config';
import express from'express';
import helmet from'helmet';
import{fileURLToPath}from'node:url';
import path from'node:path';
import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{contactRouter}from'./server/contact.js';
const app=express(),production=process.env.NODE_ENV==='production';
const port=Number(process.env.PORT||3000);
const origin=new URL(process.env.FRONTEND_URL||`http://localhost:${port}`).origin;
if(production&&!origin.startsWith('https://'))throw new Error('FRONTEND_URL must use HTTPS in production.');
const hops=Number(process.env.TRUST_PROXY_HOPS||0);
if(!Number.isInteger(hops)||hops<0||hops>10)throw new Error('Invalid TRUST_PROXY_HOPS.');
const publicPath=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const html=readFileSync(path.join(publicPath,'index.html'),'utf8');
const ld=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
const ldHash=ld?`'sha256-${createHash('sha256').update(ld).digest('base64')}'`:null;
app.set('trust proxy',hops);app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'",...(ldHash?[ldHash]:[])],styleSrc:["'self'"],imgSrc:["'self'",'data:'],fontSrc:["'self'"],connectSrc:["'self'"],objectSrc:["'none'"],baseUri:["'self'"],formAction:["'self'"],frameAncestors:["'none'"],upgradeInsecureRequests:production?[]:null}},strictTransportSecurity:production?undefined:false}));
app.use('/api',(req,res,next)=>{
 res.set('Cache-Control','no-store');const incoming=req.get('Origin');
 if(incoming&&incoming!==origin)return res.status(403).json({success:false,code:'ORIGIN_DENIED',message:'This request origin is not permitted.'});
 if(incoming){res.set('Access-Control-Allow-Origin',origin);res.vary('Origin');}
 if(req.method==='OPTIONS'){res.set('Access-Control-Allow-Methods','POST, OPTIONS');res.set('Access-Control-Allow-Headers','Content-Type');return res.sendStatus(204);}
 next();
});
app.use(express.json({limit:'16kb',strict:true}));app.use('/api/contact',contactRouter());
app.use('/api/partnership',contactRouter(process.env,'partnership'));
app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
app.use('/api',(_req,res)=>res.status(404).json({success:false,code:'NOT_FOUND',message:'The requested endpoint was not found.'}));

app.use(express.static(publicPath,{maxAge:production?'1h':0,dotfiles:'deny',index:'index.html'}));
app.use((_req,res)=>res.status(404).type('text').send('Page not found. Please return to the home page.'));
app.use((err,_req,res,_next)=>{
 const status=err.type==='entity.too.large'?413:err instanceof SyntaxError?400:500;
 if(status===500)console.error(JSON.stringify({event:'request_failed',code:'INTERNAL_ERROR'}));
 res.status(status).json({success:false,code:status===413?'REQUEST_TOO_LARGE':status===400?'INVALID_JSON':'INTERNAL_ERROR',message:status===413?'Your inquiry is too large. Please shorten the project details.':'We could not submit your inquiry. Please review the information and try again.'});
});
const server=app.listen(port,()=>console.log(`Peak Consulting is running on port ${port}.`));
server.requestTimeout=30000;server.headersTimeout=15000;
for(const signal of['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();});
