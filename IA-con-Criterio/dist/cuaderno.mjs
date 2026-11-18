import {criteria,compare,measurement,snapshot,save,remove,restore,clearAll} from './registros.mjs';
const $=s=>document.querySelector(s);
const make=(tag,value)=>{const el=document.createElement(tag);el.textContent=value??'';return el;};
let data={goals:[],entries:[],assessments:[]},editing=null;
function tell(msg){$('#notice').textContent=msg;if(msg)$('#notice').scrollIntoView({block:'nearest'});}
function safe(fn){return async e=>{try{await fn(e);}catch(err){tell(err.message||'No se pudo guardar. Revisa los permisos del navegador.');}};}
function view(){const name=location.hash.slice(1)||'inicio';const target=document.getElementById(name)?.matches('main>section')?name:'inicio';
 for(const sec of document.querySelectorAll('main>section'))sec.hidden=sec.id!==target;
 for(const link of document.querySelectorAll('nav a')){if(link.hash==='#'+target)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
}
function file(name,obj){
 const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=make('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function action(label,fn){const b=make('button',label);b.type='button';b.className='quiet';b.addEventListener('click',safe(fn));return b;}
function card(target,title,sub,text,buttons=[]){const el=make('div');el.className='rec';el.append(make('small',sub),make('h3',title),make('p',text),...buttons);target.append(el);}
function empty(target,s){if(!target.childElementCount)target.append(make('p',s));}
const gf=$('#goal'),ef=$('#entry'),af=$('#assessment');
function useGoal(id){location.hash='bitacora';ef.elements.goalId.value=id;ef.elements.attempt.focus();}
function editGoal(g){location.hash='metas';editing=g;for(const k of ['title','area','kind','stage','expected','due'])gf.elements[k].value=g[k];$('#goal-title').textContent='Editar meta';gf.elements.title.focus();}
async function del(s,r){if(confirm('¿Borrar este registro del cuaderno?')){await remove(s,r);await changed('Registro borrado.');}}
function listGoals(){const goals=$('#goals'),today=$('#today');goals.replaceChildren();today.replaceChildren();
 for(const g of [...data.goals].sort((a,b)=>a.due.localeCompare(b.due))){
  const tag=g.stage+' · '+g.area+' · '+g.due;
  card(goals,g.title,tag+(g.closed?' · Cerrada':''),g.expected,[action('Editar',()=>editGoal(g)),action(g.closed?'Reabrir':'Cerrar meta',async()=>{await save('goals',{...g,closed:!g.closed},g.rev);await changed('Meta actualizada.');}),action('Borrar',()=>del('goals',g))]);
  if(!g.closed)card(today,g.title,tag,g.expected,[action('Registrar intento',()=>useGoal(g.id))]);
 }
 empty(goals,'Aquí aparecerán las metas que guardes.');empty(today,'Aún no tienes metas abiertas. Crea una para tu próxima entrega.');
 const select=ef.elements.goalId,prev=select.value;select.replaceChildren(new Option('Selecciona una meta',''));for(const g of data.goals)select.add(new Option(g.title+(g.closed?' · cerrada':''),g.id));if(data.goals.some(g=>g.id===prev))select.value=prev;
}
function listEntries(){const target=$('#entries');target.replaceChildren();
 for(const r of [...data.entries].sort((a,b)=>b.created.localeCompare(a.created))){
  if($('#filter').value!=='Todas'&&r.stage!==$('#filter').value)continue;
  const body=['Intento: '+r.attempt,'Ayuda: '+(r.help||'Ninguna registrada'),'Decisión: '+r.decision,'Evidencia: '+r.evidence,r.next&&'Pendiente: '+r.next,r.pause,r.reason].filter(Boolean).join('\n');
  card(target,r.goalTitle,r.area+' · '+r.stage+' · '+r.created.slice(0,10),body,[action('Exportar esta ficha',()=>file('Evidencia-'+r.id+'.json',{formato:'Ficha de evidencia',...r})),action('Borrar',()=>del('entries',r))]);
 }empty(target,'Sin fichas para esta etapa.');
}
function listAssess(){const target=$('#assessments');target.replaceChildren();
 for(const team of [...new Set(data.assessments.map(r=>r.team))].sort()){
  const rows=data.assessments.filter(r=>r.team===team).sort((a,b)=>b.phase.localeCompare(a.phase));const delta=compare(rows.find(r=>r.phase==='Inicial'),rows.find(r=>r.phase==='Final'));
  const lines=rows.map(r=>{const m=measurement(r);return r.phase+' · '+r.own+'/'+r.total+' intentos ('+m.percent.toFixed(0)+' %) · defensa '+m.score+'/6';});
  lines.push(delta?'Cambio: '+delta.percentage.toFixed(1)+' puntos porcentuales · '+delta.points+' puntos de defensa.':'Comparación pendiente.');
  card(target,team,rows[0].area,lines.join('\n'),rows.map(r=>action('Borrar '+r.phase.toLowerCase(),()=>del('assessments',r))));
 }empty(target,'Todavía no hay mediciones.');$('#pilot-export').disabled=!data.assessments.length;
}
async function refresh(){data=await snapshot();listGoals();listEntries();listAssess();const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));const week=data.entries.filter(r=>new Date(r.created)>=monday);const n=week.length,k=week.filter(r=>r.own).length;$('#ratio').textContent=n?Math.round(k/n*100)+' %':'—';$('#counts').textContent=n?k+' de '+n+' fichas de esta semana con intento previo.':'Todavía no hay fichas esta semana.';$('#bar').style.width=(n?k/n*100:0)+'%';}
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('criterio-registros'):null;channel?.addEventListener('message',safe(refresh));
async function changed(msg){await refresh();channel?.postMessage('actualizar');tell(msg);}
function formData(f){return Object.fromEntries([...new FormData(f)].map(([k,v])=>[k,v.trim()]));}
function onSubmit(f,fn){f.addEventListener('submit',safe(async e=>{e.preventDefault();const button=f.querySelector('button:not([type=reset])');if(button.disabled)return;button.disabled=true;try{await fn(formData(f));}finally{button.disabled=false;}}));}
gf.addEventListener('reset',()=>{editing=null;$('#goal-title').textContent='Nueva meta';});
onSubmit(gf,async v=>{await save('goals',{...v,id:editing?.id??crypto.randomUUID(),closed:editing?.closed??false},editing?.rev??0);gf.reset();await changed('Meta guardada.');});
onSubmit(ef,async v=>{const g=data.goals.find(g=>g.id===v.goalId);if(!g)throw Error('Primero crea y selecciona una meta.');await save('entries',{...v,id:crypto.randomUUID(),own:ef.elements.own.checked,area:g.area,goalTitle:g.title,stage:g.stage,kind:g.kind});ef.reset();await changed('Ficha guardada. Ya puedes exportarla para la defensa.');});
for(const [i,[title,options]] of criteria.entries()){const l=make('label',title);const s=make('select');s.name='r'+i;s.required=true;s.add(new Option('Elige un nivel',''));options.forEach((v,i)=>s.add(new Option(i+' · '+v,i)));l.append(s);$('#rubric').append(l);}
onSubmit(af,async v=>{const team=v.team.toUpperCase();const ratings=criteria.map((_,i)=>Number(v['r'+i]));const r={team,area:v.area,phase:v.phase,work:v.work,answers:v.answers,total:+v.total,own:+v.own,ratings,id:team+'/'+v.phase};
 if(r.own>r.total)throw Error('Los intentos propios no pueden superar los avances observados.');
 if(data.assessments.some(a=>a.id===r.id))throw Error('Ya existe esta medición. Si fue un error, borra esa ficha y registra la corrección.');
 await save('assessments',r);af.reset();await changed('Medición guardada.');});
$('#pilot-export').onclick=()=>file('Piloto-IA-con-Criterio.json',{mediciones:data.assessments});
$('#filter').onchange=listEntries;
$('#backup').onclick=safe(async()=>file('IA-con-Criterio-copia.json',{format:'ia-con-criterio/1',...await snapshot()}));
$('#restore').onchange=safe(async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;if(f.size>20e6)throw Error('La copia supera 20 MB.');await restore(JSON.parse(await f.text()));await changed('Copia restaurada.');});
$('#erase').onclick=safe(async()=>{if(confirm('¿Eliminar TODAS las metas, fichas y mediciones de este perfil? Esta acción es definitiva.')){await clearAll();gf.reset();ef.reset();af.reset();await changed('Cuaderno borrado.');}});
const focusLink=make('a');focusLink.className='button';const installed=location.protocol==='chrome-extension:';focusLink.href=installed?'../popup.html':'./Extension-IA-con-Criterio.zip';focusLink.textContent=installed?'Configurar mi pausa':'Descargar extensión para Chrome';$('#focus-action').append(focusLink);
if(!installed)$('#focus-action').append(make('p','Descomprime el ZIP. En chrome://extensions activa el modo de desarrollador y carga la carpeta que contiene manifest.json.'));
window.addEventListener('hashchange',()=>{view();tell('');window.scrollTo(0,0);});view();safe(refresh)();
