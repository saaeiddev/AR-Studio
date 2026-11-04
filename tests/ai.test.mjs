import {test} from 'node:test';
import assert from 'node:assert/strict';
import {candidateAssets,validatePlan} from '../ai-copilot.js';
import {validateInput,validateResult} from '../server/ai-server.mjs';
const a=[{name:'Brain anatomy',category:'Science',kind:'brain',file:'https://cdn.jsdelivr.net/gh/itayinbarr/brainproject@2929e94f521a8ddceab26bc100a98dc06b0da060/brain-atlas/models/brain.glb'},{name:'Four-cylinder engine',category:'Automotive',kind:'engine',file:'https://cdn.3dassets.dev/assets/27832/v1/model.glb'}];
const result={title:'Brain lab',summary:'A scene',limitations:'No games',objects:[{assetIndex:0,name:'Brain',position:[0,0,0],size:1,behavior:'none'}]};
test('Persian asset searches select relevant models',()=>{assert.equal(candidateAssets('یه اپ آموزش مغز',a)[0].kind,'brain');assert.equal(candidateAssets('مدل موتور خودرو',a)[0].kind,'engine')});
test('valid AI plan maps only to existing assets',()=>{assert.equal(validatePlan(result,a).objects[0].item.kind,'brain');assert.throws(()=>validatePlan({...result,objects:[{...result.objects[0],assetIndex:6}]},a));assert.throws(()=>validatePlan({...result,objects:[{...result.objects[0],position:[0,999,0]}]},a))});
test('server rejects malformed input and unsupported object data',()=>{assert.throws(()=>validateInput({prompt:'x',assets:[{id:3}]}));assert.doesNotThrow(()=>validateInput({prompt:'x',assets:[{id:0,name:'A',category:'B',kind:'model'}]}));assert.throws(()=>validateResult({...result,objects:[{...result.objects[0],behavior:'execute code'}]},a));assert.doesNotThrow(()=>validateResult(result,a))});
