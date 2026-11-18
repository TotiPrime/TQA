import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('inicio, concurrencia, cancelación, vencimiento y restauración de reglas en una API Chrome simulada',async()=>{
 let clock=10000,rules=[],alarm,send;const data={};const hook={addListener(){}};
 const store={get:async()=>({...data}),set:async v=>Object.assign(data,v),remove:async k=>delete data[k]};
 const chrome={declarativeNetRequest:{getSessionRules:async()=>rules,updateSessionRules:async v=>{rules=rules.filter(r=>!v.removeRuleIds.includes(r.id)).concat(v.addRules??[]);}},storage:{session:store,local:store},alarms:{get:async()=>alarm,clear:async()=>{alarm=null;},create:async(n,{when})=>{alarm={scheduledTime:when};},onAlarm:hook},runtime:{id:'local',onMessage:{addListener:fn=>send=m=>new Promise(resolve=>fn(m,{id:'local'},resolve))},onInstalled:hook,onStartup:hook}};
 vm.runInNewContext(readFileSync(new URL('../extension/background.js',import.meta.url),'utf8'),{chrome,Date:{now:()=>clock}});
 assert.ok((await send({type:'start',sites:[],minutes:1})).error);
 const msg={type:'start',sites:['chatgpt','claude'],minutes:1};const [first,second]=await Promise.all([send(msg),send(msg)]);assert.ok(first.active);assert.ok(second.error);
 assert.equal(rules.length,2);assert.equal(rules[0].action.type,'block');assert.equal(rules[0].condition.resourceTypes[0],'main_frame');
 rules=[];await send({type:'state'});assert.equal(rules.length,2);
 clock+=60001;const state=await send({type:'state'});assert.equal(state.active,null);assert.equal(rules.length,0);assert.equal(alarm,null);
 await send(msg);await send({type:'stop'});assert.equal(rules.length,0);assert.equal(data.active,undefined);
});
