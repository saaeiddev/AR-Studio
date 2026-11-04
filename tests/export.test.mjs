import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeWebExport} from '../web-export.js';

test('web export preserves Unicode scene data without injecting HTML', () => {
  const project = {schemaVersion:1,name:'اتاق </script><script>alert(1)</script>',objects:[{name:'مکعب',type:'box',position:[0,1,0],rotation:[0,0,0],scale:[1,1,1],behavior:'rotate'}]};
  const html = makeWebExport(project);
  assert.equal(html.includes(project.name), false);
  const encoded = html.match(/const PROJECT_DATA='([^']+)'/)[1];
  assert.deepEqual(JSON.parse(Buffer.from(encoded,'base64').toString('utf8')), project);
  assert.equal((html.match(/<script\b/g)||[]).length, 2);
  assert.match(html,/immersive-ar/);
  assert.match(html,/Three\.js|three@0\.170\.0/);
});

test('export generated module is syntactically valid', async () => {
  const {writeFile,rm} = await import('node:fs/promises');
  const {execFileSync} = await import('node:child_process');
  const {tmpdir} = await import('node:os');
  const {join} = await import('node:path');
  const html = makeWebExport({schemaVersion:1,name:'Demo',objects:[]});
  const code = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  const file=join(tmpdir(),`ar-studio-export-test-${process.pid}.mjs`);
  try { await writeFile(file,code);execFileSync(process.execPath,['--check',file]); } finally { await rm(file,{force:true}); }
});
