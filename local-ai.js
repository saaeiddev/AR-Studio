const MODEL_ID='Qwen2.5-1.5B-Instruct-q4f32_1-MLC';
const MODULE_URL='https://esm.run/@mlc-ai/web-llm@0.2.80';
let enginePromise;
function explain(error){const message=String(error?.message||error);if(/memory|out of memory|allocation/i.test(message))return 'Not enough GPU memory to load the local AI. Close other graphics apps and retry.';if(/fetch|network|download/i.test(message))return 'The AI model could not be downloaded. Check your internet connection and retry.';return 'Local AI could not start or generate a valid plan: '+message.slice(0,240)}
export async function generateLocalPlan(prompt,assets,onProgress=()=>{},deps={}){
 const gpu=deps.gpu??globalThis.navigator?.gpu;if(!gpu)throw Error('WebGPU is unavailable. Open AR Studio in an up-to-date WebGPU-enabled desktop browser.');
 try{
  if(deps.engine){return await run(deps.engine,prompt,assets,onProgress)}
  if(!enginePromise){enginePromise=(async()=>{onProgress('Loading the AI engine…');const module=await import(MODULE_URL);if(!module.prebuiltAppConfig.model_list.some(m=>m.model_id===MODEL_ID))throw Error('The required local AI model is unavailable.');return module.CreateMLCEngine(MODEL_ID,{initProgressCallback:p=>onProgress(p.text||'Loading AI model…')})})();enginePromise.catch(()=>{enginePromise=undefined})}
  const engine=await enginePromise;return await run(engine,prompt,assets,onProgress)
 }catch(e){throw Error(explain(e))}
}
export function parseModelJSON(text){
 if(typeof text!=='string')throw Error('The model returned an empty response.');
 let start=-1,depth=0,inString=false,escaped=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];if(start<0){if(c==='{'){start=i;depth=1}continue}
  if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')inString=false;continue}
  if(c==='"')inString=true;else if(c==='{')depth++;else if(c==='}'&&--depth===0){const value=JSON.parse(text.slice(start,i+1));if(!value||typeof value.title!=='string'||typeof value.summary!=='string'||typeof value.limitations!=='string'||!Array.isArray(value.objects))throw Error('AI plan is missing required fields.');return value}
 }
 throw Error('The model did not return a complete JSON object.');
}
async function run(engine,prompt,assets,onProgress){
 onProgress('AI is planning your scene on this device…');
 const catalog=assets.map((a,i)=>({id:i,name:a.name,category:a.category,kind:a.kind}));
 const instructions='You are an AR scene planner. Return one JSON object only, no markdown. Example: {"title":"Brain","summary":"A brain scene","limitations":"No native app","objects":[{"assetIndex":0,"name":"Brain","position":[0,0,0],"size":1,"behavior":"none"}]}. Use only the listed asset indexes, up to 8 objects. position is an array of 3 numbers in meters, size from 0.1 to 5, behavior is none or rotate. Do not invent assets. Brain can show some descriptions; engine and electronics show general text. AR is experimental. Do not claim to build a game, native app, generated geometry or unsupported features. State missing capabilities in limitations. If nothing fits, return an empty objects array. Use the language of the request.';
 const messages=[{role:'system',content:instructions},{role:'user',content:JSON.stringify({request:prompt.slice(0,1500),assets:catalog})}];
 for(let attempt=0;attempt<2;attempt++){
  const response=await engine.chat.completions.create({messages,temperature:0.2,max_tokens:1200});
  if(response.choices?.[0]?.finish_reason==='length')throw Error('The AI response was incomplete. Try a shorter request.');
  try{return parseModelJSON(response.choices?.[0]?.message?.content)}catch(error){if(attempt===1)throw Error('Could not produce a valid scene plan. Try a simpler request.');onProgress('The AI is correcting its response…');messages.push({role:'assistant',content:response.choices?.[0]?.message?.content||''},{role:'user',content:'Return the complete JSON object only. Include title, summary, limitations, and objects.'})}
 }
}
