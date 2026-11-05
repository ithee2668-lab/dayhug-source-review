// JavaScript smoke test with a minimal DOM stub; this is NOT browser/render QA.
import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';import * as domain from '../dist/core.mjs';import * as mealDomain from '../dist/meal-core.mjs';
test('UI script seven-scene walkthrough, views, source dialog handlers run in DOM stub',async()=>{
 const nodes=new Map(),listeners=new Map(),storage=new Map();
 const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',checked:false,open:false,classList:{add(){},remove(){}},showModal(){this.open=true},close(){this.open=false}});return nodes.get(s)};
 const sandbox={...domain,...mealDomain,console,structuredClone,Intl,Date,JSON,Blob,URL,setTimeout,clearTimeout,setInterval:()=>0,navigator:{},location:{hostname:'example.test'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{querySelector:node,addEventListener:(k,f)=>listeners.set(k,f),body:{append(){}},createElement:()=>({click(){},remove(){}})},window:{addEventListener(){},scrollTo(){},print(){}}};
 const context=vm.createContext(sandbox);const script=(await readFile(new URL('../dist/app.mjs',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');vm.runInContext(script,context);await new Promise(r=>setTimeout(r,0));
 const click=async dataset=>listeners.get('click')({target:{closest:()=>({dataset})}});
 await click({action:'walk-confirm'});for(let i=1;i<=6;i++)await click({action:'walk-next'});
 const state=JSON.parse(storage.get('harupoom-prototype-v2'));assert.equal(state.tasks.filter(t=>t.status==='done').length,6);assert.match(node('#app').innerHTML,/하루의 한 장/);
 for(const view of ['home','notices','tasks','brief','memory','settings']){await click({action:'view',view});assert.ok(node('#app').innerHTML.length>5000)}
 await click({action:'source',id:'buy-paper'});assert.equal(node('#dialog').open,true);assert.match(node('#dialog').innerHTML,/<mark>/);await click({action:'close'});assert.equal(node('#dialog').open,false);
});
