import {getCatalog,safeAssetURL} from './library.js';
import {generateLocalPlan} from './local-ai.js';
const $=s=>document.querySelector(s);
export function candidateAssets(prompt,catalog){
 const aliases=[[/مغز|نورون|anatomy|brain|neuro/i,'brain anatomy'],[/موتور|پیستون|engine|motor/i,'engine'],[/ماشین|خودرو|car|vehicle/i,'car vehicle'],[/برد|الکترونیک|مدار|electronics|circuit/i,'circuit electronics'],[/شهر|ساختمان|city|building/i,'city building']];
 let text=prompt.toLowerCase();for(const [pattern,words] of aliases)if(pattern.test(text))text+=' '+words;
 const words=text.match(/[a-z\d]{3,}/g)||[];
 return catalog.map((asset,index)=>({asset,index,score:words.reduce((n,w)=>n+((asset.name+' '+asset.category).toLowerCase().includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,60).map(x=>x.asset);
}
// Normalize harmless model formatting differences before strict validation.
// Never guess missing asset IDs or accept arbitrary URLs or executable behaviors.
export function normalizePlan(plan,assets){
 if(!plan||!Array.isArray(plan.objects)||plan.objects.length>12)throw Error('AI returned an invalid plan.');
 const notices=[];
 const number=value=>{if(typeof value==='string'){value=value.trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))return NaN;value=Number(value)}return typeof value==='number'&&Number.isFinite(value)?value:NaN};
 const objects=[];
 for(const raw of plan.objects){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)){notices.push('An invalid object was skipped.');continue}
  const index=number(raw.assetIndex);
  if(!Number.isInteger(index)||index<0||!assets[index]||!safeAssetURL(assets[index].file)){notices.push('An object referencing an unavailable model was skipped.');continue}
  let corrected=false;
  let name=typeof raw.name==='string'&&raw.name.trim()?raw.name.trim():assets[index].name;
  if(name!==raw.name)corrected=true;if(name.length>120){name=name.slice(0,120);corrected=true}
  let pos=raw.position;if(pos&&typeof pos==='object'&&!Array.isArray(pos))pos=[pos.x,pos.y,pos.z];
  if(!Array.isArray(pos)||pos.length!==3){pos=[0,0,0];corrected=true}else pos=pos.map(v=>{const n=number(v);if(!Number.isFinite(n)){corrected=true;return 0}const bounded=Math.max(-10,Math.min(10,n));if(bounded!==n||typeof v!=='number')corrected=true;return bounded});
  let size=number(raw.size);if(!Number.isFinite(size)){size=1.6;corrected=true}else{const bounded=Math.max(.1,Math.min(5,size));if(bounded!==size||typeof raw.size!=='number')corrected=true;size=bounded}
  let behavior=typeof raw.behavior==='string'?raw.behavior.trim().toLowerCase():'none';
  if(!['none','rotate'].includes(behavior)){behavior='none';corrected=true} else if(behavior!==raw.behavior)corrected=true;
  if(corrected)notices.push(name+': some object settings were adjusted to supported values.');
  objects.push({assetIndex:index,name,position:pos,size,behavior});
 }
 const clean=(value,fallback,max)=>typeof value==='string'?value.slice(0,max):fallback;
 return {title:clean(plan.title,'AI scene',120),summary:clean(plan.summary,'Review the proposed scene.',1500),limitations:clean(plan.limitations,'',1500),objects,notices};
}
export function validatePlan(plan,assets){
 if(!plan||typeof plan.title!=='string'||typeof plan.summary!=='string'||typeof plan.limitations!=='string'||!Array.isArray(plan.objects)||plan.objects.length>12)throw Error('AI returned an invalid plan.');
 if(plan.title.length>120||plan.summary.length>1500||plan.limitations.length>1500)throw Error('AI plan text is too long.');
 const objects=plan.objects.map(o=>{if(!Number.isInteger(o.assetIndex)||!assets[o.assetIndex]||!safeAssetURL(assets[o.assetIndex].file))throw Error('AI selected an unavailable asset.');if(typeof o.name!=='string'||o.name.length>120||!Array.isArray(o.position)||o.position.length!==3||!o.position.every(n=>Number.isFinite(n)&&Math.abs(n)<=10)||!Number.isFinite(o.size)||o.size<.1||o.size>5||!['none','rotate'].includes(o.behavior))throw Error('AI returned invalid object settings.');return {item:assets[o.assetIndex],name:o.name,position:o.position,size:o.size,behavior:o.behavior}});
 return {title:plan.title,summary:plan.summary,limitations:plan.limitations,objects};
}
export function setupCopilot(onApply,onUndo){let plan=null;const dialog=$('#copilotDialog'),status=$('#aiStatus'),output=$('#aiPlan'),generate=$('#generateAi');
 $('#openCopilot').onclick=()=>dialog.showModal();$('#closeCopilot').onclick=()=>dialog.close();document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{$('#aiPrompt').value=b.dataset.prompt;$('#aiPrompt').focus()});
 generate.onclick=async()=>{const prompt=$('#aiPrompt').value.trim();if(!prompt){status.textContent='Please describe the experience you want to build.';return}generate.disabled=true;output.hidden=true;plan=null;status.textContent='Searching the asset collection and requesting a scene plan…';try{const catalog=await getCatalog();const assets=candidateAssets(prompt,catalog).slice(0,24);const generated=await generateLocalPlan(prompt,assets,msg=>status.textContent=msg);const normalized=normalizePlan(generated,assets);plan=validatePlan(normalized,assets);plan.notices=normalized.notices;$('#aiTitle').textContent=plan.title;$('#aiSummary').textContent=plan.summary;$('#aiLimitations').textContent=[plan.limitations,...plan.notices].filter(Boolean).join(' ');const list=$('#aiObjects');list.replaceChildren();for(const o of plan.objects){const li=document.createElement('li');li.textContent=o.name+' — '+o.item.name;list.append(li)}$('#applyAi').disabled=plan.objects.length===0;output.hidden=false;status.textContent='Review the plan before adding it to your scene.'}catch(e){status.textContent=e.message||'Unable to generate a scene.'}finally{generate.disabled=false}};
 $('#applyAi').onclick=async()=>{if(!plan)return;$('#applyAi').disabled=true;status.textContent='Loading models and creating the scene…';try{await onApply(plan);status.textContent='Scene added. Use Preview to test supported interactions.';$('#undoAi').hidden=false;output.hidden=true;plan=null;dialog.close()}catch(e){status.textContent='Could not apply scene: '+e.message}finally{$('#applyAi').disabled=false}};
 $('#undoAi').onclick=()=>{onUndo();$('#undoAi').hidden=true;status.textContent='The last AI-added objects were removed.'};
}
