import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const output=process.env.PREVIEW_DIR||'/tmp/wells-image-previews';await mkdir(output,{recursive:true});
const tabs=await(await fetch((process.env.CDP_URL||'http://127.0.0.1:9222')+'/json')).json();
const socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.onopen=r);
let id=0;const pending=new Map();socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));socket.send(JSON.stringify({id:n,method,params}))});
const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const wait=async expression=>{for(let i=0;i<80;i++){if(await evaluate(`!!(${expression})`))return;await new Promise(r=>setTimeout(r,100));}throw Error('Timeout: '+expression)};
const check=async(expression,label)=>{assert(await evaluate(expression),label);console.log('PASS',label)};
const route=async path=>{await evaluate(`location.hash=${JSON.stringify('#'+path)}`);await new Promise(r=>setTimeout(r,200));};
const shot=async name=>{const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(output+'/'+name+'.png',Buffer.from(r.data,'base64'))};
const within=(child,parent)=>`(()=>{const c=document.querySelector(${JSON.stringify(child)}).getBoundingClientRect(),p=document.querySelector(${JSON.stringify(parent)}).getBoundingClientRect();return c.left>=p.left-.5&&c.right<=p.right+.5&&c.top>=p.top-.5&&c.bottom<=p.bottom+.5})()`;
try {
await call('Page.enable');await call('Network.enable');await call('Network.setCacheDisabled',{cacheDisabled:true});await call('Page.navigate',{url:(process.env.APP_URL||'http://127.0.0.1:5174/wells/')+'#/'});await wait('location.hash==="#/"');await call('Page.reload',{ignoreCache:true});await new Promise(r=>setTimeout(r,600));await wait('document.querySelector(".product-card img")?.complete');
await check(`(async()=>{const im=new Image();im.src=document.querySelector('.fami-button img').src;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let white=0;for(let i=0;i<p.length;i+=4)if(p[i]>230&&p[i+1]>230&&p[i+2]>230&&p[i+3]>250)white++;return p[3]===0&&p[(c.width-1)*4+3]===0&&white>100})()`,'mascot has real alpha transparency and retains white body details');
for(const width of [320,390,480,768,1440]) {
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
 await call('Page.reload',{ignoreCache:true});await new Promise(r=>setTimeout(r,400));await route('/?section=products');
 await check(`innerWidth===${width}`,`actual viewport is ${width}px`);
 await check(within('.product-picture img','.product-picture'),`product photo inside image area at ${width}px`);
 await check(`(()=>{const t=document.querySelector('.product-tabs').getBoundingClientRect(),i=document.querySelector('.product-picture img').getBoundingClientRect(),h=document.querySelector('.product-card h3').getBoundingClientRect();return i.top>=t.bottom&&i.bottom<=h.top})()`,`product photo does not overlap tabs or caption at ${width}px`);
 await check(within('.fami-button img','.assistant-strip'),`landing mascot stays in strip at ${width}px`);
 await route('/support');await wait('document.querySelector(".support-fami-card img")?.complete');
 await check(within('.support-fami-card img','.support-fami-card'),`support mascot stays in card at ${width}px`);
 await check(`(()=>{const i=document.querySelector('.support-fami-card img').getBoundingClientRect(),t=document.querySelector('.support-fami-card strong').getBoundingClientRect();return t.right<=i.left})()`,`support text does not overlap mascot at ${width}px`);
 await route('/menu');await wait('document.querySelector("dialog[open] .menu-ai img")?.complete');
 await check(within('.menu-ai img','.menu-ai'),`menu mascot stays in card at ${width}px`);
 await check(`(()=>{const i=document.querySelector('.menu-ai img').getBoundingClientRect(),t=document.querySelector('.menu-ai strong').getBoundingClientRect();return t.right<=i.left})()`,`menu text does not overlap mascot at ${width}px`);
 await check('document.documentElement.scrollWidth<=innerWidth',`no page overflow at ${width}px`);
}
await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:2,mobile:true});
await route('/?section=products');await evaluate('document.querySelector(".products").scrollIntoView({block:"start"})');await new Promise(r=>setTimeout(r,200));await shot('14-products-contained');
await evaluate('[...document.querySelectorAll(".product-tabs button")].find(b=>b.textContent.includes("Slim")).click()');await shot('15-slim-contained');await check(within('.missing-product','.product-picture'),'Slim placeholder stays in area');
await route('/support');await shot('01-customer-center');
await route('/menu');await wait('document.querySelector("dialog[open]")');await evaluate('document.querySelector(".menu-ai").scrollIntoView({block:"center"})');await shot('16-menu-contained');
console.log('PASS image containment and transparency validation complete');
} finally {socket.close();}
