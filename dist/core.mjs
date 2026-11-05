// HaruPoom P0 v2: pure deterministic domain engine. No external calls.
export const FAMILY='family-demo-01';
export const MEMBERS=['A','B'];
export const CLOCK='2026-10-20T20:00:00+09:00';
export const NOTICE1='[합성 공지 · 달달이반]\n활동: 가을 만들기 수업\n일시: 2026-10-21 10:00 (Asia/Seoul)\n준비물: 색종이, 풀\n활동비: 5,000원\n색종이와 풀을 가방에 넣어 보내 주세요.';
export const NOTICE2='[합성 수정 공지 · 달달이반]\n가을 만들기 수업은 2026-10-21 09:30 (Asia/Seoul)로 변경됩니다.\n앞치마를 추가로 준비해 가방에 넣어 주세요.\n색종이와 풀은 그대로 필요합니다. 활동비는 5,000원입니다.';
export class DomainError extends Error {constructor(code,message,status=400){super(message);this.code=code;this.status=status;}}
const fail=(c,m,s)=>{throw new DomainError(c,m,s)};
const clone=x=>structuredClone(x);
export const active=t=>!['done','cancelled'].includes(t.status);
export const memberName=id=>id==='A'?'보호자 A':id==='B'?'보호자 B':'담당 미정';
const newTask=(id,label,kind,quote,owner=null)=>({id,event_id:'event-demo-01',kind,label,status:'todo',owner_id:owner,assignment_status:owner?'accepted':'unassigned',due_at:'2026-10-21T09:20:00+09:00',lead_time_minutes:kind==='buy'?60:10,depends_on:[],evidence:[{notice_id:'N1',quote,kind:'source_excerpt'}],completion:null,payment_status:kind==='payment_check'?'unconfirmed':'not_applicable',version:1});
export function initialState(family=FAMILY){return {schema_version:2,family_id:family,version:1,clock:CLOCK,synthetic:true,event:{id:'event-demo-01',title:'가을 만들기 수업',child:'달달이',starts_at:'2026-10-21T10:00:00+09:00',timezone:'Asia/Seoul',status:'scheduled'},notices:[{id:'N1',external_id:'demo-notice-1',revision:1,raw:NOTICE1,source:'합성 공지 입력',written_at:'2026-10-20T16:00:00+09:00',received_at:CLOCK,applied:true,read_by:[]}],tasks:[newTask('buy-paper','색종이 구매','buy','준비물: 색종이, 풀','A'),newTask('pack-paper','색종이 가방에 넣기','pack','색종이와 풀을 가방에 넣어 보내 주세요.'),newTask('pack-glue','풀 가방에 넣기','pack','색종이와 풀을 가방에 넣어 보내 주세요.'),newTask('pay','활동비 5,000원 납부 여부 확인','payment_check','활동비: 5,000원')],impacts:[],audit:[],input_queue:[],connection:{mode:'synthetic',status:'ready',last_success:CLOCK,error:null},model:{mode:'mock',provider:'deterministicMock',last_validation:null},consent:false};}
function log(s,actor,action,detail,at){s.audit.push({id:'log-'+(s.audit.length+1),actor,action,detail,at});}
function task(s,id){return s.tasks.find(t=>t.id===id)||fail('NOT_FOUND','작업을 찾을 수 없습니다.',404);}
function sourceCheck(s,e){const n=s.notices.find(n=>n.id===e.notice_id);return !!n&&!!e.quote&&n.raw.includes(e.quote);}
export function validateState(s){
 const ids=new Set();for(const t of s.tasks){if(ids.has(t.id))fail('DUPLICATE','작업 ID가 중복됩니다.');ids.add(t.id);if(t.event_id!==s.event.id)fail('SCOPE','활동 범위가 다릅니다.');if(!['todo','in_progress','done','cancelled','needs_review'].includes(t.status))fail('STATE','잘못된 상태입니다.');if(t.status==='done'&&(!MEMBERS.includes(t.completion?.confirmed_by)||!t.completion?.confirmed_at||t.completion.basis!=='caregiver_confirmation'))fail('COMPLETION','보호자 확인이 필요합니다.');if(t.assignment_status==='accepted'&&!MEMBERS.includes(t.owner_id))fail('ASSIGNMENT','가족 담당자가 필요합니다.');if(t.kind!=='payment_check'&&t.payment_status!=='not_applicable')fail('PAYMENT','잘못된 지급 상태입니다.');if(t.payment_status==='bank_verified')fail('PAYMENT','기관 납부 검증은 지원하지 않습니다.');for(const e of t.evidence){if(e.kind==='source_excerpt'&&!sourceCheck(s,e))fail('EVIDENCE','원문 근거를 찾을 수 없습니다.');}}
 for(const t of s.tasks)for(const id of t.depends_on)if(!ids.has(id))fail('DEPENDENCY','참조 작업이 없습니다.');
 const visiting=new Set(),visited=new Set();function walk(id){if(visiting.has(id))fail('CYCLE','순환 의존성입니다.');if(visited.has(id))return;visiting.add(id);task(s,id).depends_on.forEach(walk);visiting.delete(id);visited.add(id);}s.tasks.forEach(t=>walk(t.id));return true;
}
export function receiveNotice(state,{external_id,raw,link_event_id=null},actor='A',at=CLOCK){
 if(typeof raw!=='string'||!raw.trim()||raw.length>12000)fail('INPUT','공지는 1~12,000자로 입력해 주세요.');
 if(typeof external_id!=='string'||!external_id.trim()||external_id.length>120)fail('INPUT','출처 ID를 확인해 주세요.');
 if(state.notices.some(n=>n.external_id===external_id&&n.raw===raw))return {state:clone(state),duplicate:true};
 const s=clone(state),related=s.notices.filter(n=>n.external_id===external_id),id='N'+(s.notices.length+1);
 s.notices.push({id,external_id,revision:related.length+1,supersedes_id:related.at(-1)?.id??null,raw,source:'직접 입력 · 합성 시연',written_at:null,received_at:at,applied:false,read_by:[],link_event_id});
 s.input_queue.push({notice_id:id,status:'needs_review',reason:link_event_id===s.event.id?'원문 확인 후 직접 연결한 활동에 반영해 주세요.':'활동·날짜·대상 아이 확인이 필요합니다. 같은 제목만으로 병합하지 않습니다.'});log(s,actor,'notice_received',id,at);return {state:s,duplicate:false};
}
export function extractNotice(input){
 const raw=input.raw??'',questions=[],date=raw.match(/(20\d{2}-\d{2}-\d{2})[ T](\d{2}:\d{2})/),items=['색종이','풀','앞치마'].filter(x=>raw.includes(x)),money=raw.match(/([\d,]+)원/);
 if(!date)questions.push(raw.includes('내일')&&!input.written_at?'‘내일’의 기준 작성 시각과 실제 날짜를 확인해 주세요.':'정확한 날짜와 시간을 확인해 주세요.');
 if(!input.child_confirmed)questions.push('어느 아이의 활동인지 보호자가 확인해 주세요.');
 if(!money)questions.push('활동비 금액·해당 여부가 확정되지 않았습니다.');
 let starts_at=null;if(date){const v=date[1]+'T'+date[2]+':00+09:00',d=new Date(v);if(!Number.isFinite(+d)||new Date(+d+9*3600000).toISOString().slice(0,16)!==date[1]+'T'+date[2])questions.push('존재하지 않는 날짜·시간입니다.');else starts_at=v;}
 return {mode:'mock',provider:'deterministicMock',starts_at,items,amount:money?Number(money[1].replaceAll(',','')):null,questions,evidence:[...(date?[date[0]]:[]),...items,...(money?[money[0]]:[])],notice_id:input.id,requires_review:true};
}
export function validateModelOutput(raw,notices){let o;try{o=JSON.parse(raw)}catch{fail('MODEL_JSON','구조화 결과가 JSON이 아닙니다.');}
 if(!o||Array.isArray(o)||typeof o!=='object'||Object.keys(o).some(k=>!['notice_id','claims'].includes(k))||typeof o.notice_id!=='string'||!Array.isArray(o.claims))fail('MODEL_SCHEMA','허용된 구조가 아닙니다.');
 const notice=notices.find(n=>n.id===o.notice_id);if(!notice)fail('MODEL_EVIDENCE','존재하지 않는 공지 ID입니다.');
 for(const c of o.claims){if(!c||Object.keys(c).some(k=>!['field','value','quote'].includes(k))||!['starts_at','item','amount'].includes(c.field)||typeof c.value!=='string'||typeof c.quote!=='string'||!c.quote.trim()||!notice.raw.includes(c.quote)||!c.quote.includes(c.value))fail('MODEL_EVIDENCE','원문에서 확인되지 않는 결과입니다.');}return o;
}
function addImpact(s,field,before,after,action,reason,ids){s.impacts.push({id:'impact-'+(s.impacts.length+1),field,before,after,action,reason,task_ids:ids,status:'pending'});}
function applyChange(s,kind,actor,at){
 if(s.impacts.some(i=>i.scenario===kind))fail('ALREADY_APPLIED','이미 불러온 변경입니다.');
 const start=s.impacts.length;let raw=NOTICE2;
 if(kind==='date')raw='[합성 수정] 가을 만들기 수업 일시가 2026-10-22 10:00 (Asia/Seoul)로 변경됩니다.';
 if(kind==='color')raw='[합성 수정] 색종이는 파란색으로 준비해 주세요. 기존 구매한 색종이의 색상을 확인해 주세요.';
 if(kind==='cancel')raw='[합성 수정] 가을 만들기 수업이 취소되었습니다. 준비물은 보내지 않아도 됩니다.';
 const id='N'+(s.notices.length+1);s.notices.push({id,external_id:'demo-change-'+kind,revision:1,raw,source:'합성 수정 공지',written_at:at,received_at:at,applied:false,read_by:[]});
 if(kind==='standard'||kind==='date')addImpact(s,'시작 시각',s.event.starts_at,kind==='date'?'2026-10-22T10:00:00+09:00':'2026-10-21T09:30:00+09:00','reschedule','남은 준비의 마감만 이동합니다. 구매·완료 이력은 유지합니다.',s.tasks.filter(active).map(t=>t.id));
 if(kind==='standard')addImpact(s,'새 준비물','없음','앞치마','add','앞치마 준비와 가방 넣기 두 작업을 추가합니다.',[]);
 if(kind==='color')addImpact(s,'색종이 색상','색상 지정 없음','파란색','followup','이전 구매 사실을 보존하고 새 요건 확인을 추가합니다.',['buy-paper']);
 if(kind==='cancel')addImpact(s,'활동 상태','예정','취소','cancel','보호자 확인 후 남은 준비를 취소합니다. 완료 이력은 보존합니다.',s.tasks.filter(active).map(t=>t.id));
 for(const i of s.impacts.slice(start)){i.scenario=kind;i.notice_id=id;}log(s,actor,'change_received',kind,at);
}
export function command(state,c,actor='A',at=CLOCK){
 if(!MEMBERS.includes(actor))fail('ACTOR','성인 보호자만 상태를 변경할 수 있습니다.',403);
 if(c.expected_version!==undefined&&c.expected_version!==state.version)fail('CONFLICT','다른 보호자의 기록이 먼저 저장됐어요. 최신 상태를 확인해 주세요.',409);
 const s=clone(state);let t;if(c.task_id)t=task(s,c.task_id);
 switch(c.type){
 case 'read':{const n=s.notices.find(n=>n.id===c.notice_id)||fail('NOT_FOUND','공지 없음',404);if(!n.read_by.includes(actor))n.read_by.push(actor);log(s,actor,'read',n.id,at);break;}
 case 'propose':if(!MEMBERS.includes(c.owner))fail('OWNER','가족 보호자를 선택해 주세요.');if(!active(t))fail('STATE','종료된 작업은 담당을 제안할 수 없습니다.');t.owner_id=c.owner;t.assignment_status='proposed';t.version++;log(s,actor,'propose',t.label+' → '+memberName(c.owner),at);break;
 case 'accept':case 'decline':if(t.owner_id!==actor||t.assignment_status!=='proposed')fail('ACCEPT','제안받은 보호자가 직접 수락해 주세요.',403);t.assignment_status=c.type==='accept'?'accepted':'declined';t.version++;log(s,actor,c.type,t.label,at);break;
 case 'complete':if(s.event.status==='cancelled'||!active(t))fail('STATE','완료할 수 없는 작업입니다.');if(t.assignment_status!=='accepted'||t.owner_id!==actor)fail('ACCEPT','담당 수락 후 직접 완료를 확인해 주세요.',403);if(c.confirmed!==true)fail('CONFIRM','명시적인 완료 확인이 필요합니다.');t.status='done';t.completion={confirmed_by:actor,confirmed_at:at,basis:'caregiver_confirmation'};if(t.kind==='payment_check')t.payment_status='caregiver_reported_paid';t.version++;log(s,actor,'complete',t.label,at);break;
 case 'reopen':if(t.status!=='done')fail('STATE','완료된 작업만 되돌릴 수 있습니다.');t.status='todo';t.completion=null;if(t.kind==='payment_check')t.payment_status='unconfirmed';t.version++;log(s,actor,'reopen',t.label+' · 이전 완료 이력 보존',at);break;
 case 'change':if(!['standard','date','color','cancel'].includes(c.kind))fail('INPUT','지원하지 않는 변경입니다.');applyChange(s,c.kind,actor,at);break;
 case 'confirm_impact':{const i=s.impacts.find(x=>x.id===c.impact_id)||fail('NOT_FOUND','변경 없음');if(i.status!=='pending')fail('STATE','이미 확인한 변경입니다.');i.status='accepted';if(i.action==='reschedule'){s.event.starts_at=i.after;for(const x of s.tasks.filter(active)){x.due_at=new Date(new Date(i.after)-40*60000).toISOString();x.version++;}}
 if(i.action==='add'){const q='앞치마를 추가로 준비해 가방에 넣어 주세요.';for(const [id,label,kind]of[['prepare-apron','앞치마 준비','prepare'],['pack-apron','앞치마 가방에 넣기','pack']]){const x=newTask(id,label,kind,q);x.evidence=[{notice_id:i.notice_id,quote:q,kind:'source_excerpt'}];x.due_at=new Date(new Date(s.event.starts_at)-40*60000).toISOString();s.tasks.push(x);}}
 if(i.action==='followup'){const x=newTask('check-color','구매한 색종이가 파란색인지 확인','confirm_change','색종이는 파란색으로 준비해 주세요.');x.evidence=[{notice_id:i.notice_id,quote:'색종이는 파란색으로 준비해 주세요.',kind:'source_excerpt'}];s.tasks.push(x);}
 if(i.action==='cancel'){s.event.status='cancelled';for(const x of s.tasks.filter(active)){x.status='cancelled';x.version++;}}
 const n=s.notices.find(n=>n.id===i.notice_id);if(s.impacts.filter(j=>j.notice_id===i.notice_id).every(j=>j.status==='accepted'))n.applied=true;log(s,actor,'impact_accepted',i.field+' · '+i.reason,at);break;}
 case 'receive':{const result=receiveNotice(s,c,actor,at);if(result.duplicate)return {state:clone(state),message:'동일 원문입니다. 중복 생성하지 않았어요.'};Object.assign(s,result.state);break;}
 case 'manual_task':{if(typeof c.label!=='string'||!c.label.trim()||c.label.length>120)fail('INPUT','작업명을 1~120자로 입력해 주세요.');if(!['buy','pack','prepare','payment_check'].includes(c.kind))fail('INPUT','작업 유형 오류');const n=s.notices.find(n=>n.id===c.notice_id);if(!n||!c.quote?.trim()||!n.raw.includes(c.quote))fail('EVIDENCE','원문에서 정확한 근거 구절을 선택해 주세요.');if(c.event_confirmed!==true)fail('LINK','활동 연결 확인이 필요합니다.');const x=newTask('manual-'+s.version,c.label.trim(),c.kind,c.quote);x.evidence=[{notice_id:n.id,quote:c.quote,kind:'source_excerpt'}];x.due_at=new Date(new Date(s.event.starts_at)-40*60000).toISOString();s.tasks.push(x);log(s,actor,'manual_task',x.label,at);break;}
 case 'connection':if(!['failed','ready'].includes(c.status))fail('INPUT','상태 오류');s.connection.status=c.status;s.connection.error=c.status==='failed'?'연결 실패 · 새 공지 유무를 확인할 수 없어요.':null;if(c.status==='ready')s.connection.last_success=at;log(s,actor,'connection',c.status,at);break;
 case 'model_failure':s.model.last_validation='failed';log(s,actor,'model_failure','자동 분석 실패 · 원문/수동 확인 가능',at);break;
 case 'model_result':validateModelOutput(c.raw,s.notices);s.model.last_validation='valid_candidate';log(s,actor,'model_validated','후보 검증만 완료 · 작업 자동 확정 없음',at);break;
 case 'clock':if(!['2026-10-20T20:00:00+09:00','2026-10-21T08:00:00+09:00','2026-10-21T11:00:00+09:00'].includes(c.value))fail('CLOCK','시연 시각 오류');s.clock=c.value;break;
 case 'consent':s.consent=c.value===true;log(s,actor,'consent',s.consent?'연동 가정 동의 기록 · 실제 전송 없음':'동의 철회 · 전송 차단',at);break;
 default:fail('COMMAND','지원하지 않는 작업입니다.');}
 s.version++;validateState(s);return {state:s,message:'기록을 저장했어요.'};
}
export function briefing(s){const pending=s.impacts.filter(i=>i.status==='pending'),items=s.tasks.filter(active).sort((a,b)=>(new Date(a.due_at)-a.lead_time_minutes*60000)-(new Date(b.due_at)-b.lead_time_minutes*60000));return {pending_changes:pending.length,items,done:s.tasks.filter(t=>t.status==='done'),payment:s.tasks.find(t=>t.kind==='payment_check')?.payment_status??'unconfirmed',text:(pending.length?`확인할 변경이 ${pending.length}건 있어요. `:'')+(items.length?`남은 준비는 ${items.length}가지예요. ${items.map(t=>t.label+' · '+(t.assignment_status==='accepted'?memberName(t.owner_id):'담당 수락 필요')).join('. ')}.`:'현재 기록에서 확인할 준비를 모두 마쳤어요.')+' 활동비: '+(s.tasks.find(t=>t.id==='pay')?.payment_status==='caregiver_reported_paid'?'보호자가 납부했다고 기록했어요. 기관 확인은 아니에요.':'지급 여부가 아직 확인되지 않았어요.')};}
export function caption(description=''){return description.trim()?description.trim().slice(0,200)+' · 오늘 저녁, 이 기록으로 이야기를 시작해 보세요.':'바쁜 하루 속에서도, 함께 기억할 한 장.';}
export function externalGate(s){if(!s.consent)fail('CONSENT','동의가 없어 외부 전송을 차단했습니다.',403);fail('UNCONNECTED','실제 제공자와 승인된 수집 경로가 연결되지 않았습니다.',503);}
