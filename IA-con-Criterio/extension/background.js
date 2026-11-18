const sites={
 chatgpt:['chatgpt.com','chat.openai.com'],claude:['claude.ai'],gemini:['gemini.google.com'],copilot:['copilot.microsoft.com'],perplexity:['perplexity.ai'],deepseek:['chat.deepseek.com']
};
const alarmName='fin-de-concentracion', rules=chrome.declarativeNetRequest;
const session=chrome.storage.session;
// All writes to the clock and its rules share one queue, including wake-up events.
let queue=Promise.resolve();
function enqueue(fn){const next=queue.then(fn);queue=next.catch(()=>{});return next;}
async function clearSession(){
 const ids=(await rules.getSessionRules()).map(r=>r.id);
 if(ids.length)await rules.updateSessionRules({removeRuleIds:ids});
 await session.remove('active');await chrome.alarms.clear(alarmName);
}
async function reconcile(){
 const {active}=await session.get('active');
 if(!active||active.until<=Date.now()){await clearSession();return null;}
 const expected=active.sites.map((key,i)=>({id:i+1,priority:1,action:{type:'block'},condition:{requestDomains:sites[key],resourceTypes:['main_frame']}}));
 const current=await rules.getSessionRules();
 if(JSON.stringify(current.map(r=>[r.id,r.condition.requestDomains]).sort())!==JSON.stringify(expected.map(r=>[r.id,r.condition.requestDomains]).sort())){
  await rules.updateSessionRules({removeRuleIds:current.map(r=>r.id),addRules:expected});
 }
 const alarm=await chrome.alarms.get(alarmName);if(!alarm||Math.abs(alarm.scheduledTime-active.until)>500)await chrome.alarms.create(alarmName,{when:active.until});
 return active;
}
async function handle(m){
 if(m.type==='state')return reconcile();
 if(m.type==='stop'){await clearSession();return null;}
 if(m.type!=='start')throw Error('Acción desconocida.');
 if(await reconcile())throw Error('Ya hay una pausa activa.');
 if(!Number.isInteger(m.minutes)||m.minutes<1||m.minutes>180||!Array.isArray(m.sites)||!m.sites.length||m.sites.some(k=>!Object.hasOwn(sites,k)))throw Error('Elige uno o más sitios y entre 1 y 180 minutos.');
 const active={sites:[...new Set(m.sites)],until:Date.now()+m.minutes*60000};
 try{await chrome.alarms.create(alarmName,{when:active.until});await session.set({active});await reconcile();await chrome.storage.local.set({preferences:{sites:active.sites,minutes:m.minutes}});return active;}
 catch(err){await clearSession();throw err;}
}
chrome.runtime.onMessage.addListener((msg,sender,respond)=>{
 if(sender.id!==chrome.runtime.id)return false;
 enqueue(()=>handle(msg)).then(active=>respond({active}),err=>respond({error:err.message}));return true;
});
chrome.alarms.onAlarm.addListener(a=>{if(a.name===alarmName)enqueue(reconcile);});
chrome.runtime.onStartup.addListener(()=>enqueue(reconcile));
chrome.runtime.onInstalled.addListener(()=>enqueue(reconcile));
enqueue(reconcile);
