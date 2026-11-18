export const stores = ['goals','entries','assessments'];
const phases=['Inicial','Final'];
export const criteria=[
 ['Decisión',['No identifica la decisión','Nombra una decisión','La explica y considera otra opción']],
 ['Comprobación',['Sin comprobación','Describe una prueba','Muestra e interpreta la evidencia']],
 ['Relación con el informe',['No ubica la afirmación','Ubica la afirmación','Relaciona el resultado con el texto y propone un ajuste']]
];
export function measurement(a){
 return {percent:100*a.own/a.total,score:a.ratings.reduce((sum,n)=>sum+n,0)};
}
export function compare(a,b){
 if(!a||!b) return null;
 const first=measurement(a),last=measurement(b);
 return {points:last.score-first.score,percentage:last.percent-first.percent};
}
const required={goals:['area','stage','kind','title','expected','due'],entries:['goalId','attempt','decision','evidence','stage','goalTitle','area','kind'],assessments:['team','phase','area','work']};
export function validateRecord(table,r){
 const bad=()=>{throw Error('Hay una ficha incompleta o incompatible.');};
 if(!r||typeof r!=='object'||typeof r.id!=='string'||!r.id||r.id.length>100||!Number.isSafeInteger(r.rev)||r.rev<1||!Number.isFinite(Date.parse(r.created)))bad();
 for(const key of required[table])if(typeof r[key]!=='string'||!r[key].trim()||r[key].length>3000)bad();
 if(table==='goals'&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.due)||typeof r.closed!=='boolean'))bad();
 if(table==='entries'&&(typeof r.own!=='boolean'||['help','next','reason','pause'].some(k=>typeof r[k]!=='string')))bad();
 if(table==='assessments'&&(!phases.includes(r.phase)||!(/^[A-Z0-9_-]{1,24}$/).test(r.team)||r.id!==r.team+'/'+r.phase||![r.total,r.own].every(Number.isInteger)||r.total<1||r.total>999||r.own<0||r.own>r.total||!Array.isArray(r.ratings)||r.ratings.length!==3||r.ratings.some(n=>![0,1,2].includes(n))))bad();
}
export function validateBackup(b){
 if(b?.format!=='ia-con-criterio/1')throw Error('Selecciona una copia completa de IA con Criterio.');
 for(const s of stores){
  if(!Array.isArray(b[s])||b[s].length>30000)throw Error('Copia incompleta o demasiado grande.');
  const ids=new Set();for(const row of b[s]){validateRecord(s,row);if(ids.has(row.id))throw Error('La copia tiene identificadores repetidos.');ids.add(row.id);}
 }
 const goals=new Set(b.goals.map(g=>g.id));if(b.entries.some(e=>!goals.has(e.goalId)))throw Error('Una ficha referencia una meta ausente.');
 return b;
}
let connection;
function open(){
 if(!connection) connection=new Promise((resolve,reject)=>{
  const req=indexedDB.open('ia-con-criterio-cuaderno',1);
  req.onupgradeneeded=()=>{for(const name of stores){const s=req.result.createObjectStore(name,{keyPath:'id'});if(name==='entries')s.createIndex('goalId','goalId');}};
  req.onsuccess=()=>{req.result.onversionchange=()=>{req.result.close();connection=undefined;};resolve(req.result);};
  req.onerror=()=>{connection=undefined;reject(req.error);};
 });return connection;
}
const request=req=>new Promise((ok,no)=>{req.onsuccess=()=>ok(req.result);req.onerror=()=>no(req.error);});
async function transaction(mode,work){
 const db=await open(),tx=db.transaction(stores,mode);
 const done=new Promise((ok,no)=>{tx.oncomplete=ok;tx.onabort=()=>no(tx.error??Error('Operación cancelada.'));});
 try {const value=await work(tx);await done;return value;}catch(e){try{tx.abort();}catch{}await done.catch(()=>{});throw e;}
}
export async function snapshot(){return transaction('readonly',async tx=>Object.fromEntries(await Promise.all(stores.map(async s=>[s,await request(tx.objectStore(s).getAll())]))));}
export async function save(s,row,rev=0){return transaction('readwrite',async tx=>{
 const store=tx.objectStore(s),old=await request(store.get(row.id));
 if((old?.rev??0)!==rev)throw Error('Esta ficha cambió o ya existe. Actualiza el cuaderno y revisa la versión guardada.');
 if(s==='entries'&&!await request(tx.objectStore('goals').get(row.goalId)))throw Error('La meta ya no existe.');
 const r={...row,created:old?.created??row.created??new Date().toISOString(),rev:rev+1};validateRecord(s,r);await request(store.put(r));
});}
export async function remove(s,row){return transaction('readwrite',async tx=>{
 const st=tx.objectStore(s),old=await request(st.get(row.id));if(old?.rev!==row.rev)throw Error('Actualiza el cuaderno antes de borrar.');
 if(s==='goals'&&await request(tx.objectStore('entries').index('goalId').count(row.id)))throw Error('Esta meta tiene fichas. Puedes cerrarla o borrar primero sus fichas.');
 await request(st.delete(row.id));
});}
export async function clearAll(){return transaction('readwrite',tx=>Promise.all(stores.map(s=>request(tx.objectStore(s).clear()))));}
export async function restore(b){validateBackup(b);return transaction('readwrite',async tx=>{
 const counts=await Promise.all(stores.map(s=>request(tx.objectStore(s).count())));if(counts.some(Boolean))throw Error('La restauración requiere un cuaderno vacío. Exporta tu copia actual antes de borrarlo.');
 await Promise.all(stores.flatMap(s=>b[s].map(row=>request(tx.objectStore(s).add(row)))));
});}
