import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateLocalPlan,parseModelJSON} from '../local-ai.js';
const plan={title:'Scene',summary:'A brain {scene}',limitations:'3D only',objects:[{assetIndex:0,name:'Brain',position:[0,0,0],size:1,behavior:'none'}]};
test('local generation avoids GrammarMatcher and parses the plan',async()=>{let request;const engine={chat:{completions:{create:async r=>{request=r;return {choices:[{finish_reason:'stop',message:{content:'```json\n'+JSON.stringify(plan)+'\n```'}}]}}}}};const out=await generateLocalPlan('مغز',[{name:'Brain',category:'Science',kind:'brain'}],()=>{},{gpu:{},engine});assert.deepEqual(out,plan);assert.equal('response_format' in request,false);assert.match(request.messages[1].content,/Brain/)});
test('parsing ignores braces within strings and rejects incomplete data',()=>{assert.deepEqual(parseModelJSON('Here: '+JSON.stringify(plan)),plan);assert.throws(()=>parseModelJSON('{"title":"oops"}'));assert.throws(()=>parseModelJSON('{"title":'));});
test('invalid model response retries and accepts corrected answer',async()=>{let count=0;const engine={chat:{completions:{create:async()=>({choices:[{finish_reason:'stop',message:{content:++count===1?'not json':JSON.stringify(plan)}}]})}}};assert.deepEqual(await generateLocalPlan('a',[],()=>{},{gpu:{},engine}),plan);assert.equal(count,2)});
test('unavailable WebGPU produces an actionable error',async()=>{await assert.rejects(()=>generateLocalPlan('a',[],()=>{},{gpu:false}),/WebGPU/)});
test('incomplete output is rejected',async()=>{const engine={chat:{completions:{create:async()=>({choices:[{finish_reason:'length',message:{content:'{}'}}]})}}};await assert.rejects(()=>generateLocalPlan('a',[],()=>{},{gpu:{},engine}),/incomplete/)});
