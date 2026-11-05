import {DatabaseSync} from 'node:sqlite';
import {randomBytes,createHash} from 'node:crypto';
import {initialState,command,FAMILY,DomainError} from '../dist/core.mjs';
const digest=s=>createHash('sha256').update(s).digest('hex');
export class Store {
 constructor(filename=':memory:'){this.db=new DatabaseSync(filename);this.db.exec(`PRAGMA foreign_keys=ON;CREATE TABLE IF NOT EXISTS states(family_id TEXT PRIMARY KEY, version INTEGER NOT NULL, payload TEXT NOT NULL);CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, family_id TEXT NOT NULL, actor TEXT NOT NULL, expires INTEGER NOT NULL);`);this.seed(FAMILY);}
 seed(family){const s=initialState(family);this.db.prepare('INSERT OR IGNORE INTO states VALUES(?,?,?)').run(family,s.version,JSON.stringify(s));return s;}
 get(family){const row=this.db.prepare('SELECT payload FROM states WHERE family_id=?').get(family);if(!row)throw new DomainError('NOT_FOUND','가족을 찾을 수 없습니다.',404);return JSON.parse(row.payload);}
 put(family,state,expected){const row=this.db.prepare('UPDATE states SET version=?,payload=? WHERE family_id=? AND version=?').run(state.version,JSON.stringify(state),family,expected);if(!row.changes)throw new DomainError('CONFLICT','다른 보호자 기록이 먼저 저장됐어요. 새로 확인해 주세요.',409);}
 createSession(family,actor){if(!['A','B'].includes(actor))throw new DomainError('ACTOR','보호자 역할 오류');this.seed(family);const token=randomBytes(32).toString('hex');this.db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),family,actor,Date.now()+8*3600000);return token;}
 identity(req){const cookie=req.headers.get('cookie')||'',token=cookie.match(/(?:^|;\s*)hp_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!token)throw new DomainError('AUTH','테스트 세션이 필요합니다.',401);const row=this.db.prepare('SELECT family_id,actor FROM sessions WHERE token_hash=? AND expires>?').get(digest(token),Date.now());if(!row)throw new DomainError('AUTH','세션이 만료되었습니다.',401);return row;}
 close(){this.db.close();}
}
const json=(o,status=200,headers={})=>Response.json(o,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export function createAPI(store){return async request=>{try{const url=new URL(request.url);if(!['127.0.0.1','localhost'].includes(url.hostname))throw new DomainError('LOCAL','이 서버는 로컬 합성 테스트 전용입니다.',403);const origin=request.headers.get('origin');if(origin&&origin!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')throw new DomainError('ORIGIN','교차 출처 요청을 차단했습니다.',403);
 let body={};if(request.method==='POST'){if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw new DomainError('TYPE','JSON이 필요합니다.',415);const raw=await request.text();if(raw.length>25000)throw new DomainError('SIZE','요청이 너무 큽니다.',413);try{body=JSON.parse(raw)}catch{throw new DomainError('JSON','유효한 JSON이 필요합니다.');}if(!body||Array.isArray(body)||typeof body!=='object')throw new DomainError('JSON','객체가 필요합니다.');}
 if(url.pathname==='/api/demo/login'&&request.method==='POST'){if(!['A','B'].includes(body.actor))throw new DomainError('ACTOR','보호자를 선택해 주세요.');const token=store.createSession(FAMILY,body.actor);return json({state:store.get(FAMILY),mode:'LOCAL_SYNTHETIC_TEST'},200,{'Set-Cookie':`hp_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`});}
 const who=store.identity(request);if((url.searchParams.get('family_id')&&url.searchParams.get('family_id')!==who.family_id)||(body.family_id&&body.family_id!==who.family_id))throw new DomainError('SCOPE','다른 가족 데이터에 접근할 수 없습니다.',403);
 if(request.method==='GET'&&url.pathname==='/api/state')return json({state:store.get(who.family_id)});
 if(request.method==='POST'&&url.pathname==='/api/demo/reset'){const prior=store.get(who.family_id),s=initialState(who.family_id);s.version=prior.version+1;store.put(who.family_id,s,prior.version);return json({state:s});}
 if(request.method==='POST'&&url.pathname==='/api/command'){if(!Number.isInteger(body.expected_version))throw new DomainError('VERSION','expected_version이 필요합니다.');const s=store.get(who.family_id),r=command(s,body,who.actor,new Date().toISOString());if(r.state.version!==s.version)store.put(who.family_id,r.state,s.version);return json(r);}
 return json({error:'경로를 찾을 수 없습니다.'},404);
 }catch(e){return json({error:e instanceof DomainError?e.message:'서버 처리 오류',code:e.code||'INTERNAL'},e instanceof DomainError?e.status:500);}};}
