import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const output=process.env.PREVIEW_DIR||'/tmp/wells-ui-previews';await mkdir(output,{recursive:true});
const appUrl=process.env.APP_URL||'http://127.0.0.1:5173/wells/';
const tabs=await(await fetch((process.env.CDP_URL||'http://127.0.0.1:9222')+'/json')).json();
const socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.onopen=r);
let id=0;const pending=new Map();const errors=[];
socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));socket.send(JSON.stringify({id:n,method,params}))});
const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const wait=async expression=>{for(let i=0;i<120;i++){if(await ev(`!!(${expression})`))return;await new Promise(r=>setTimeout(r,80))}throw Error('Timeout: '+expression)};
const shot=async(name,clip)=>{const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:!!clip,...(clip?{clip}:{})});await writeFile(output+'/'+name+'.png',Buffer.from(r.data,'base64'))};
try {
 await call('Page.enable');await call('Runtime.enable');await call('Page.bringToFront');await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await call('Network.enable');await call('Network.setCacheDisabled',{cacheDisabled:true});await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:2,mobile:true});
 await call('Page.navigate',{url:appUrl+'?panel='+Date.now()+'#/'});await wait('document.querySelector(".system-entry")?.dataset.progress==="0"');
 await ev('scrollTo(0,document.querySelector(".system-entry").getBoundingClientRect().top+scrollY-innerHeight*.75)');
 await wait('Number(document.querySelector(".system-entry").dataset.progress)>.2');
 const before=await ev('({scroll:scrollY,progress:Number(document.querySelector(".system-entry").dataset.progress),lift:parseFloat(getComputedStyle(document.querySelector(".system-entry")).getPropertyValue("--panel-lift"))})');
 assert(before.progress<.4);assert(await ev('[...document.querySelectorAll(".feature-card")].every(e=>e.dataset.reveal==="waiting")'));
 await shot('22-growing-panel-peek');console.log('PASS rounded panel and title peek before cards appear');
 const touch=await ev('({x:innerWidth/2,y:Math.min(innerHeight-40,document.querySelector(".growing-system").getBoundingClientRect().top+40)})');
 await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...touch,id:1}]});
 for(let step=1;step<=18;step++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touch.x,y:touch.y-step*20,id:1}]});await new Promise(r=>setTimeout(r,20))}
 await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await wait(`scrollY>${before.scroll+150}`);await wait('Number(document.querySelector(".system-entry").dataset.progress)>.95');
 assert(await ev(`parseFloat(getComputedStyle(document.querySelector('.system-entry')).getPropertyValue('--panel-lift'))<${before.lift}`));assert(await ev('!document.querySelector("dialog[open]")'));console.log('PASS real touch swipe moves document and lifts whole panel');
 for(let i=0;i<6;i++){await ev(`document.querySelectorAll('.feature-card')[${i}].scrollIntoView({block:'center',behavior:'instant'})`);await wait(`document.querySelectorAll('.feature-card')[${i}].dataset.reveal==='shown'`);await wait(`Number(getComputedStyle(document.querySelectorAll('.feature-card')[${i}]).opacity)>.99`)}
 await wait('document.querySelector(".moss-foreground").complete');
 assert(await ev('(async()=>{const im=document.querySelector(".moss-foreground");await im.decode();const c=document.createElement("canvas");c.width=im.naturalWidth;c.height=im.naturalHeight;const ctx=c.getContext("2d");ctx.drawImage(im,0,0);return ctx.getImageData(0,0,1,1).data[3]===0})()'));console.log('PASS foreground moss is truly transparent');
 for(const width of[320,390,480,768]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:780,deviceScaleFactor:1,mobile:width<500});await new Promise(r=>setTimeout(r,180));
  assert(await ev(`innerWidth===${width}`));
  assert(await ev('(()=>{const m=document.querySelector(".moss-foreground").getBoundingClientRect();return [...document.querySelectorAll(".feature-card h3,.feature-card p")].every(e=>e.getBoundingClientRect().bottom+18<m.top)&&[...document.querySelectorAll(".feature-stack .feature-card")].every(e=>e.getBoundingClientRect().bottom+8<m.top)})()'));
  assert(await ev('document.documentElement.scrollWidth<=innerWidth'));console.log('PASS moss overlaps only reserved blank area; no text clipped',width);
 }
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:2,mobile:true});await ev('document.querySelector("#system").scrollIntoView({block:"start",behavior:"instant"})');await wait('document.querySelector(".system-entry").dataset.progress==="1"');await new Promise(r=>setTimeout(r,150));
 const clip=await ev('(()=>{const r=document.querySelector("#system").getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()');await shot('23-growing-panel-open',clip);
 await ev('document.querySelector(".feature-card.glass.full").scrollIntoView({block:"center",behavior:"instant"})');await ev('document.querySelector(".feature-card.glass.full").click()');await wait('document.querySelector("dialog[open] .temperature-control")');await ev('document.querySelector("dialog .icon-button").click()');console.log('PASS temperature popup remains connected');
 await ev('scrollTo(0,0)');await ev('document.querySelector(".menu-button").click()');await wait('document.querySelector("dialog[open]")');await ev('[...document.querySelectorAll(".menu-row")].find(e=>e.textContent.includes("사용 방법")).click()');await wait('location.hash.includes("section=system")');await wait('Math.abs(document.querySelector("#system").getBoundingClientRect().top)<3');await wait('document.querySelector(".system-entry").dataset.progress==="1"');console.log('PASS menu scrolls to stable panel anchor');
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await wait('document.querySelector(".system-entry").dataset.progress==="1"');assert(await ev('getComputedStyle(document.querySelector(".growing-system")).transform==="none"'));console.log('PASS reduced-motion disables panel movement');
 assert.deepEqual(errors,[]);console.log('PASS no browser exceptions');
} finally {socket.close()}
