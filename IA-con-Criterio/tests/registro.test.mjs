import test from 'node:test';
import assert from 'node:assert/strict';
import {compare,validateBackup,validateRecord} from '../dist/registros.mjs';
import {replyTo} from '../dist/knowledge.mjs';
test('comparación emparejada con distintos denominadores y pares incompletos',()=>{
 const a={own:1,total:4,ratings:[1,0,0]},b={own:3,total:4,ratings:[2,2,2]};
 assert.deepEqual(compare(a,b),{points:5,percentage:50});assert.equal(compare(a,null),null);
});
test('copia consistente y fichas inválidas',()=>{
 const r={id:'A/Inicial',rev:1,team:'A',phase:'Inicial',work:'Caso',area:'Diseño',total:2,own:1,ratings:[0,1,2],created:new Date().toISOString()};
 const backup={format:'ia-con-criterio/1',goals:[],entries:[],assessments:[r]};validateBackup(backup);
 assert.throws(()=>validateBackup({...backup,assessments:[r,r]}));assert.throws(()=>validateRecord('assessments',{...r,own:3}));assert.throws(()=>validateBackup({mediciones:[]}));
});
test('orientación específica para entregas de distintas carreras',()=>{
 for(const [q,id] of [['revisar presupuesto','costos'],['analizar un folleto de salud','salud'],['ver un afiche','pieza'],['revisar la normativa','caso'],['ensayar la defensa','defensa']])assert.equal(replyTo(q).id,id);
});
