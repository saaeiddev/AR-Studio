const MODEL_ID='Qwen2.5-1.5B-Instruct-q4f32_1-MLC';
const MODULE_URL='https://esm.run/@mlc-ai/web-llm@0.2.80';
let enginePromise;
const planSchema={type:'object',properties:{title:{type:'string'},summary:{type:'string'},limitations:{type:'string'},objects:{type:'array',items:{type:'object',properties:{assetIndex:{type:'integer'},name:{type:'string'},position:{type:'array',items:{type:'number'}},size:{type:'number'},behavior:{type:'string',enum:['none','rotate']}},required:['assetIndex','name','position','size','behavior']}}},required:['title','summary','limitations','objects']};
function explain(error){const message=String(error?.message||error);if(/memory|out of memory|allocation/i.test(message))return 'Not enough GPU memory to load the local AI. Close other graphics apps and retry.';if(/fetch|network|download/i.test(message))return 'The AI model could not be downloaded. Check your internet connection and retry.';return 'Local AI could not start or generate a valid plan: '+message.slice(0,240)}
export async function generateLocalPlan(prompt,assets,onProgress=()=>{},deps={}){
 const gpu=deps.gpu??globalThis.navigator?.gpu;if(!gpu)throw Error('WebGPU is unavailable. Open AR Studio in an up-to-date WebGPU-enabled desktop browser.');
 try{
  if(deps.engine){return await run(deps.engine,prompt,assets,onProgress)}
  if(!enginePromise){enginePromise=(async()=>{onProgress('Loading the AI engine…');const module=await import(MODULE_URL);if(!module.prebuiltAppConfig.model_list.some(m=>m.model_id===MODEL_ID))throw Error('The required local AI model is unavailable.');return module.CreateMLCEngine(MODEL_ID,{initProgressCallback:p=>onProgress(p.text||'Loading AI model…')})})();enginePromise.catch(()=>{enginePromise=undefined})}
  const engine=await enginePromise;return await run(engine,prompt,assets,onProgress)
 }catch(e){throw Error(explain(e))}
}
async function run(engine,prompt,assets,onProgress){
 onProgress('AI is planning your scene on this device…');
 const catalog=assets.map((a,i)=>({id:i,name:a.name,category:a.category,kind:a.kind}));
 const instructions='You are an AR scene planner. Reply using JSON only, following the required schema. Use only the listed assets by numeric id, with at most 8 objects. Each object needs assetIndex, name, position as three numbers in meters, size from 0.1 to 5, and behavior none or rotate. Make the scene concrete and do not invent assets. Brain can show some anatomy descriptions; engine and electronics show general text. AR placement is experimental. Do not claim to build a game, native app, generated geometry, or features not supported. State missing capabilities in limitations. If nothing fits, use an empty objects array. Use the language of the request.';
 const response=await engine.chat.completions.create({messages:[{role:'system',content:instructions},{role:'user',content:JSON.stringify({request:prompt.slice(0,1500),assets:catalog})}],response_format:{type:'json_object',schema:JSON.stringify(planSchema)},temperature:0.2,max_tokens:1200});
 if(response.choices?.[0]?.finish_reason==='length')throw Error('The AI response was incomplete. Try a shorter request.');const text=response.choices?.[0]?.message?.content;if(typeof text!=='string')throw Error('The model returned an empty response.');return JSON.parse(text);
}
