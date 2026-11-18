const names={chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini',copilot:'Copilot',perplexity:'Perplexity',deepseek:'DeepSeek'};
const $=s=>document.querySelector(s);let active=null,loading=false;
for(const [key,name] of Object.entries(names)){const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.name='site';c.value=key;l.append(c,' '+name);$('#sites').append(l);}
async function send(m){const r=await chrome.runtime.sendMessage(m);if(r.error)throw Error(r.error);return r.active;}
function show(a){active=a;$('#setup').hidden=!!a;$('#running').hidden=!a;if(a){$('#selected').textContent=a.sites.map(s=>names[s]).join(' · ');tick();}}
async function run(fn){if(loading)return;loading=true;try{await fn();}catch(e){$('#status').textContent=e.message;}finally{loading=false;}}
function tick(){if(!active)return;const seconds=Math.max(0,Math.ceil((active.until-Date.now())/1000));$('#clock').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');if(!seconds)run(async()=>{show(await send({type:'state'}));if(!active)$('#status').textContent='Pausa completada. Ya puedes volver a los sitios.';});}
$('#setup').onsubmit=e=>{e.preventDefault();run(async()=>{const sites=[...document.querySelectorAll('input[name=site]:checked')].map(c=>c.value);show(await send({type:'start',minutes:Number($('#setup').minutes.value),sites}));$('#status').textContent='Pausa iniciada.';});};
$('#stop').onclick=()=>run(async()=>{show(await send({type:'stop'}));$('#status').textContent='Pausa terminada. Ya se puede volver a entrar.';});
run(async()=>{const {preferences:p}=await chrome.storage.local.get('preferences');$('#setup').minutes.value=p?.minutes??20;for(const c of document.querySelectorAll('input[name=site]'))c.checked=(p?.sites??['chatgpt']).includes(c.value);show(await send({type:'state'}));});setInterval(tick,500);
