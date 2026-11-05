import {weatherInitial,weatherValidate,weatherExperience,SKINS} from './weather-en.mjs';
export const DEMO_NOTE='[Fictional nursery notice]\nTomorrow: autumn art at 9:30 a.m.\nPlease pack colored paper, a glue stick, and an apron.\nThe class will stay indoors if it rains.';
export const DEMO_FIELDS=Object.freeze([
 {id:'time',label:'When',quote:'Tomorrow: autumn art at 9:30 a.m.'},
 {id:'paper',label:'Colored paper',quote:'Please pack colored paper, a glue stick, and an apron.',art:'paper'},
 {id:'glue',label:'Glue stick',quote:'Please pack colored paper, a glue stick, and an apron.',art:'glue'},
 {id:'apron',label:'Apron',quote:'Please pack colored paper, a glue stick, and an apron.',art:'layer'},
 {id:'plan',label:'Rainy-day plan',quote:'The class will stay indoors if it rains.'},
]);
export function demoInitial(){return {version:1,weather:weatherInitial(),skin:'ivory',reviewed:[],packed:[],weatherPacked:[],moments:[]};}
export function demoRestore(value){const s=demoInitial();if(!value||value.version!==1)return s;if(weatherValidate(value.weather).valid)s.weather={condition:value.weather.condition,temperature:value.weather.temperature,season:value.weather.season,source:value.weather.source,severe:value.weather.severe};if(SKINS.some(x=>x.id===value.skin))s.skin=value.skin;s.reviewed=Array.isArray(value.reviewed)?[...new Set(value.reviewed.filter(x=>DEMO_FIELDS.some(f=>f.id===x)))]:[];s.packed=Array.isArray(value.packed)?[...new Set(value.packed.filter(x=>['paper','glue','apron'].includes(x)))]:[];s.weatherPacked=Array.isArray(value.weatherPacked)?[...new Set(value.weatherPacked.filter(x=>weatherExperience(s.weather).preparations.some(p=>p.id===x)))]:[];s.moments=Array.isArray(value.moments)?value.moments.filter(m=>m&&typeof m.id==='string'&&m.id.length<100&&typeof m.at==='string'&&Number.isFinite(Date.parse(m.at))&&weatherValidate(m.weather).valid&&typeof m.words==='string'&&m.words.length<=160).slice(0,20).map(m=>({id:m.id,at:new Date(m.at).toISOString(),weather:demoRestore({version:1,weather:m.weather}).weather,words:m.words})):[];return s;}
export function demoCommand(input,action,now=new Date().toISOString()){const s=demoRestore(input),toggle=(a,id)=>a.includes(id)?a.filter(x=>x!==id):[...a,id];switch(action.type){
 case 'review':if(!DEMO_FIELDS.some(f=>f.id===action.id))throw Error('Unknown source item.');s.reviewed=toggle(s.reviewed,action.id);break;
 case 'pack':if(!['paper','glue','apron'].includes(action.id))throw Error('Unknown preparation.');if(!s.reviewed.includes(action.id)&&!s.packed.includes(action.id))throw Error('Check this item against the source first.');s.packed=toggle(s.packed,action.id);break;
 case 'weather-pack':if(!weatherExperience(s.weather).preparations.some(p=>p.id===action.id))throw Error('Unknown weather preparation.');s.weatherPacked=toggle(s.weatherPacked,action.id);break;
 case 'weather':if(!weatherValidate(action.value).valid)throw Error('Choose a weather type, season and temperature from -30 to 45°C.');s.weather=demoRestore({version:1,weather:action.value}).weather;s.weatherPacked=[];break;
 case 'skin':if(!SKINS.some(x=>x.id===action.value))throw Error('Unknown skin.');s.skin=action.value;break;
 case 'moment':{if(action.confirmed!==true)throw Error('Confirm the experience before saving.');if(typeof action.words!=='string'||!action.words.trim()||action.words.length>160)throw Error('Use a short suggestion of up to 160 characters.');if(!Number.isFinite(Date.parse(now)))throw Error('Invalid record time.');now=new Date(now).toISOString();const words=action.words.trim(),key=now.slice(0,10)+'|'+JSON.stringify(s.weather)+'|'+words;if(!s.moments.some(m=>m.at.slice(0,10)+'|'+JSON.stringify(m.weather)+'|'+m.words===key)){let suffix=0,id='moment-'+Date.parse(now)+'-'+suffix;while(s.moments.some(m=>m.id===id))id='moment-'+Date.parse(now)+'-'+(++suffix);s.moments.unshift({id,at:now,weather:{...s.weather},words});}s.moments=s.moments.slice(0,20);break;}
 case 'remove-moment':if(action.confirmed!==true)throw Error('Confirm removal.');s.moments=s.moments.filter(m=>m.id!==action.id);break;
 case 'reset':if(action.confirmed!==true)throw Error('Confirm reset.');return demoInitial();
 default:throw Error('Unknown action.');
 }return s;}
