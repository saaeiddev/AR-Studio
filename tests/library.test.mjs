import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safeAssetURL,BRAIN_MODEL,getCatalog} from '../library.js';

test('catalog allows only pinned model sources',()=>{
 assert.equal(safeAssetURL(BRAIN_MODEL),true);
 assert.equal(safeAssetURL('https://cdn.3dassets.dev/assets/27832/v1/model.glb'),true);
 assert.equal(safeAssetURL('https://example.com/model.glb'),false);
 assert.equal(safeAssetURL('https://cdn.3dassets.dev/assets/27832/v1/model.js'),false);
});
test('catalog keeps valid GLB models and rejects path traversal',async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async()=>({ok:true,json:async()=>({packs:[{name:'Cars',models:[{name:'Good',file:'packs/car/good.glb'}, {name:'Bad',file:'../bad.glb'}, {name:'Not a model',file:'thing.png'}]}]})});
 try{const items=await getCatalog();assert.equal(items.length,4);assert.equal(items.at(-1).name,'Good');assert.equal(safeAssetURL(items.at(-1).file),true)}finally{globalThis.fetch=old}
});
