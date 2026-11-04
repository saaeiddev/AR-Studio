import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateLocalPlan} from '../local-ai.js';
const plan={title:'Scene',summary:'A brain scene',limitations:'3D only',objects:[{assetIndex:0,name:'Brain',position:[0,0,0],size:1,behavior:'none'}]};
test('local model returns structured scene plan',async()=>{let request;const engine={chat:{completions:{create:async r=>{request=r;return {choices:[{finish_reason:'stop',message:{content:JSON.stringify(plan)}}]}}}}};const out=await generateLocalPlan('مغز',[{name:'Brain',category:'Science',kind:'brain'}],()=>{},{gpu:{},engine});assert.deepEqual(out,plan);assert.equal(request.response_format.type,'json_object');assert.match(request.messages[1].content,/Brain/)});
test('unavailable WebGPU produces an actionable error',async()=>{await assert.rejects(()=>generateLocalPlan('a',[],()=>{},{gpu:false}),/WebGPU/)});
test('incomplete output is rejected',async()=>{const engine={chat:{completions:{create:async()=>({choices:[{finish_reason:'length',message:{content:'{}'}}]})}}};await assert.rejects(()=>generateLocalPlan('a',[],()=>{},{gpu:{},engine}),/incomplete/)});
