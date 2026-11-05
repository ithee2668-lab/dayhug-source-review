export const GUIDE_KEY='harupoom-recording-guide-v1';
export const GUIDE_STEPS=Object.freeze([
 {id:'ready',page:'morning',title:'먼저, 녹화 준비부터 할게요',body:['휴대폰을 세로로 두고 이 사이트에 로그인해 두세요. 방해 금지 모드를 켜면 알림이 영상에 섞이지 않아요.','Android 빠른 설정의 화면 녹화를 준비하세요. 기기마다 메뉴가 다르니, 음성을 담으려면 기기 소리/미디어 소리를 선택하고 5초 정도 먼저 테스트해 주세요.','이 안내는 한국어 촬영 도우미이고, 앱은 영어입니다. “작게 보기”를 누르면 안내를 따라 그대로 녹화할 수 있어요. 위로/아래로 버튼으로 위치를 옮기고, 자세히로 설명을 펼쳐요.'],shot:'아직 녹화하지 않아도 괜찮아요. 한 번 연습한 뒤 짧은 장면으로 나누어 찍어도 자연스러워요.',note:'안내를 시작하거나 다시 시작해도 앱의 체크와 저장 카드는 지워지지 않아요. 새로 찍고 싶다면 앱 맨 아래 Reset demo를 직접 확인해 주세요.'},
 {id:'opening',page:'morning',target:'.morning-hero',title:'늦게 일한 다음 날 아침',body:['맨 위 “You haven’t caught up. You’re not alone.” 문장을 2~3초 보여주세요.','설정은 이래요. 어젯밤 늦게까지 일하는 동안 할머니가 공지, 하루 기록, 그림을 남겼지만 부모는 아직 읽지 못했어요.'],shot:'첫 화면의 문장과 우산 그림을 천천히 보여주세요.',note:'실제 공유 내역이 아닌 가상 이야기예요. 자동 알람이나 Meta 분석으로 소개하지 마세요.'},
 {id:'voice',page:'morning',target:'.voice-controls',title:'내 휴대폰의 영어 목소리를 골라요',body:['English voice에서 영어 음성을 고르고 Reading pace는 Natural pace 또는 Gentle로 맞춰 주세요.','Listen to a short sample을 눌러 들어 보세요. 원하는 느낌이 아니면 다른 영어 음성을 선택해요.','영어 음성이 없으면 Refresh voices를 한 번 눌러 보세요. 그래도 없으면 Read the exact spoken script를 펼쳐 자막 장면으로 넘어가도 돼요.'],shot:'음성이 나오는지는 휴대폰에서 먼저 확인해 주세요. 앱만으로 자연스러운 목소리를 보장할 수는 없어요.',note:'기기 음성 기능입니다. 유료 음성이나 Meta 생성 음성이 아니에요.',check:'voice'},
 {id:'play',page:'morning',target:'#voice-play',title:'이제 아침 브리핑을 들려주세요',body:['Play morning preview를 직접 누르세요. 브리핑은 그때 시작돼요.','영상에서는 음성이 나오는 동안 천천히 머물러 주세요. 그만 들으려면 Stop을 눌러요.','다음 화면으로 이동하면 음성이 멈추니, 끝까지 들은 다음 이동해 주세요. 소리가 녹음되지 않으면 대본 화면과 별도 내레이션을 사용해요.'],shot:'작은 안내를 화면 아래로 옮기고 재생 버튼을 눌러 주세요. 원하는 경우 화면만 보기로 숨길 수도 있어요.',note:'자동 기상 브리핑이 아닌, 버튼으로 재생하는 가상 시나리오입니다.',check:'play'},
 {id:'bundle',page:'morning',target:'.drawing-card',title:'할머니가 남겨 둔 자료를 보여줘요',body:['What Grandma left for you. 영역으로 내려가 공지, A daily note, 그림을 차례로 보여주세요.','그림은 어젯밤 자료에 이미 포함된 것으로 이야기해요. 아침에 새로 발견하거나 업로드한 것처럼 설명하지 않아요.'],shot:'그림에서 2초 머문 뒤, 준비물이 아직 가방에 들어간 것은 아니라는 흐름으로 이어가세요.',note:'그림은 예시 일러스트이고 실제 아이의 사진이나 그림 업로드가 아니에요.'},
 {id:'open',page:'morning',target:'.morning-link[href="./demo.html#today"]',title:'이제 실제로 눌러 보는 화면으로',body:['Open the morning app → 버튼을 누르세요. 같은 탭의 Today 화면으로 이동해요.','다음 단계는 이동한 화면에서도 이어져요. 작은 안내의 자세히를 누르면 전체 설명을 다시 펼칠 수 있어요.'],shot:'음성에서 행동으로 넘어가는 장면이에요.',check:'open'},
 {id:'rain',page:'demo',route:'today',target:'.weather-hero',title:'오늘의 비를, 작은 준비로 바꿔요',body:['Today에서 Rain · 17° · Autumn과 Sample weather · Not a live forecast를 보여주세요.','다른 날씨가 남아 있다면 Change the weather ↗를 누르고 Use rainy sample을 눌러 예시로 돌아오세요.'],shot:'따뜻한 우산 그림과 “Little splashes” 제목을 2~3초 보여주세요.',note:'실제 예보가 아니라 직접 고르는 날씨 예시예요. 날씨를 복원하면 날씨 준비 체크만 초기화돼요.',check:'rain'},
 {id:'weather-pack',page:'demo',route:'today',target:'.weather-preps',title:'장화와 우산, 하나씩 직접 확인해요',body:['Boots for little adventures와 An umbrella to share 준비 카드를 하나씩 눌러 Checked by you로 바꿔 주세요. 여벌 양말도 보여주고 싶으면 눌러도 좋아요.','이미 체크되어 있다면 다시 누르지 않아도 돼요. 다시 누르면 체크가 해제돼요.'],shot:'카드 두 개가 바뀌는 장면을 천천히 찍으세요.',note:'튜토리얼이 대신 체크하지 않아요. 날씨 준비와 어린이집 준비물 확인은 별개예요.',check:'weather-pack'},
 {id:'source-open',page:'demo',route:'today',target:'[data-action="navigate"][data-view="source"]',title:'공지의 근거를 먼저 확인해요',body:['아래쪽 Check the nursery notice →를 누르세요. 또는 하단 Source 탭을 눌러도 돼요.','Source 화면에서는 원문과 확인 후보를 함께 보여줍니다.'],shot:'준비 완료라고 말하기 전에 원문을 확인하는 흐름이에요.',check:'source-open'},
 {id:'source-review',page:'demo',route:'source',target:'.source-item',title:'다섯 줄을 원문과 대조해 주세요',body:['When, Colored paper, Glue stick, Apron, Rainy-day plan을 차례로 읽어요.','각 항목의 인용문을 왼쪽/위쪽 Nursery notice와 비교한 뒤 I checked this against the source를 직접 체크해 주세요. 총 5 / 5가 되면 됩니다.','확인은 준비 완료가 아니에요. 아직 가방에 아무것도 넣었다고 표시되지 않아요.'],shot:'시간 9:30 a.m.과 새로 필요한 Apron을 잠시 강조하면 이야기가 잘 이어져요.',note:'고정된 가상 공지와 미리 정해 둔 후보입니다. 실시간 Meta 분석 결과가 아니에요.',check:'source-review'},
 {id:'prepare-open',page:'demo',route:'source',target:'[data-action="navigate"][data-view="prepare"]',title:'읽은 내용에서, 실제 준비로',body:['Continue to preparation →를 눌러 주세요.','0 of 3 packed와 Bought is not packed. 문장을 보여주세요. 이미 준비한 기록이 남아 있다면 숫자는 다를 수 있어요.'],shot:'샀다는 것과 가방에 넣었다는 것을 구분하는 장면이에요.',check:'prepare-open'},
 {id:'pack',page:'demo',route:'prepare',target:'.demo-pack-grid',title:'종이와 풀만 넣고, 앞치마는 남겨요',body:['Colored paper와 Glue stick의 I put it in the bag을 직접 체크해 주세요.','Apron은 체크하지 말고 남겨 두세요. 이미 체크되어 있다면 한 번 눌러 해제해 주세요.','2 of 3 packed가 되면 다음으로 넘어가요. 체크가 비활성화되어 있으면 Source로 돌아가 해당 항목을 먼저 확인하세요.'],shot:'두 개는 Packed by you, 앞치마는 아직 확인이 필요한 화면을 남겨요.',note:'가상 시연용 준비 기록이에요. 구매나 결제는 일어나지 않아요.',check:'pack'},
 {id:'family-open',page:'demo',route:'prepare',target:'[data-action="navigate"][data-view="family"]',title:'남은 한 가지를 함께 보게 해요',body:['See family preview →를 눌러 주세요.','Family 화면의 2 PACKED / 1 STILL TO CHECK를 보여주세요.'],shot:'“누가 무엇을 했는지”보다 “무엇이 남았는지”가 또렷해지는 순간이에요.',check:'family-open'},
 {id:'family',page:'demo',route:'family',target:'.family-card',title:'가족에게 남겨질, 차분한 한 문장',body:['Please check apron.과 앞치마의 Not confirmed를 보여주세요.','Family preview · This device only라는 표시가 있는 같은 기기 미리보기예요. 실제 가족에게 전송하지 않습니다.','아래 Return to a little moment →를 눌러 Today로 돌아가세요.'],shot:'이 화면에서 2~3초 머물러 주세요. 전송 버튼이나 결제 장면은 없어요.',check:'family'},
 {id:'moment-open',page:'demo',route:'today',target:'.weather-moments',title:'체크리스트 다음에는, 아이와 한마디',body:['“What is the rain saying?” 질문과 30 SECONDS TOGETHER 경험을 보여주세요.','안전한 곳에서 잠깐 비 소리를 듣는 가상 장면으로 설명한 뒤 Keep this moment를 누르세요.'],shot:'빗소리를 듣거나 작은 물웅덩이를 바라보는 장면을 떠올리게 천천히 읽어주세요.',note:'실제 외출은 기상 상황과 안전을 확인해야 해요. 아이의 감정을 자동으로 추정하는 기능이 아니에요.',check:'moment-open'},
 {id:'moment-save',page:'demo',route:'today',target:'#moment-words',title:'내가 고른 말과 경험만 남겨요',body:['Suggested words · Edit before saving에서 문장을 확인하거나 짧은 영어 문장으로 고쳐 주세요. 예: What is the rain saying?','가상 상황을 직접 시연한 것으로 기록하려면 We tried this together를 직접 체크하고 Save this little moment를 눌러요.','실제 함께 해 본 일이 아니라면 실제 경험으로 주장하지 마세요. 체크하지 않고 Cancel을 누른 뒤 이 단계를 건너뛰어도 괜찮아요.'],shot:'저장하면 Moments 화면으로 이동해요. 개인 이름이나 실제 아이의 정보를 넣지 마세요.',note:'이 브라우저에만 저장됩니다. 가족 전송이나 자동 경험 기록은 아니에요.',check:'moment-save'},
 {id:'moment-card',page:'demo',route:'moments',target:'.memory-card',title:'작은 순간이 카드 한 장으로',body:['Moments에서 방금 남긴 문장과 Saved on this device 표시를 보여주세요.','앞 단계에서 저장하지 않았다면 빈 화면이 정상이에요. 기록을 만들기 위해 사실이 아닌 경험을 실제 경험으로 체크할 필요는 없어요.'],shot:'문장 카드에서 2~3초 머물면 이야기의 마지막이 따뜻하게 정리돼요.',check:'moment-card'},
 {id:'skin',page:'demo',route:'moments',target:'[data-action="skin-open"]',title:'마지막으로, 취향에 맞는 색을 골라요',body:['맨 위 오른쪽 팔레트 아이콘을 누르세요.','Warm Ivory, Moss Green, Soft Lavender, Peach Glow 중 하나를 선택해요. 예를 들어 Moss Green을 누르고 ×로 닫아 주세요.','색은 바로 적용되고, 준비 체크와 저장 카드는 그대로예요.'],shot:'색이 바뀌는 장면을 짧게 넣으면 감성적인 화면의 선택지가 드러나요.',note:'원하면 이 단계는 건너뛰어도 됩니다.',check:'skin'},
 {id:'finish',page:'demo',title:'이제, 나만의 속도로 마무리해요',body:['권장 순서는 아침 첫 화면 → 영어 브리핑 → 어젯밤 자료 → 비 오는 Today → 원문 확인 → 두 개 포장 → 가족 미리보기 → 짧은 대화와 카드예요.','안내를 따라 찍은 영상은 필요한 부분만 편집하면 돼요. 영어 화면만 필요한 구간에서는 “화면만 보기”를 누르면 한국어 안내와 강조 표시가 모두 사라집니다.','다시 볼 때는 페이지 맨 아래 Recording guide를 누르세요. “처음부터 연습”은 안내 순서만 되돌리고 앱 기록은 지우지 않아요.'],shot:'한 번에 길게 찍기보다, 화면별로 3~6초씩 찍고 음성 구간만 길게 두면 편집하기 좋아요.',note:'Sample weather, Fictional story, This device only 같은 사실 표시를 숨기거나 잘라 실제 연동처럼 보이게 하지 마세요.'}
]);
export function guideRestore(raw){return {version:1,index:raw?.version===1&&Number.isInteger(raw.index)?Math.max(0,Math.min(GUIDE_STEPS.length-1,raw.index)):0,mode:raw?.version===1&&['open','compact','clean'].includes(raw.mode)?raw.mode:'clean'};}
export function guideMove(raw,delta){const s=guideRestore(raw);return {...s,index:Math.max(0,Math.min(GUIDE_STEPS.length-1,s.index+(Number.isInteger(delta)?delta:0)))};}
export function guideStatus(step,s={}){
 const has=(list,ids)=>Array.isArray(list)&&ids.every(id=>list.includes(id));let done=false,text='읽고 직접 확인한 뒤 다음으로 넘어가세요.';
 switch(step.check){
 case 'voice':done=!!s.voiceAvailable;text=done?'영어 음성을 사용할 수 있어요. 짧은 샘플을 직접 들어 보세요.':'영어 음성이 없으면 대본 화면으로 시연해도 괜찮아요.';break;
 case 'play':done=!!s.voicePlaying;text=done?'재생 중이에요. 끝까지 듣거나 Stop을 눌러 주세요.':'재생은 직접 눌러야 해요. 소리를 낼 수 없다면 대본으로 진행하세요.';break;
 case 'open':done=s.page==='demo'&&s.route==='today';break;
 case 'rain':done=s.weatherCondition==='rain'&&s.weatherSource==='sample';break;
 case 'weather-pack':done=has(s.weatherPacked,['boots','umbrella']);break;
 case 'source-open':done=s.page==='demo'&&s.route==='source';break;
 case 'source-review':done=has(s.reviewed,['time','paper','glue','apron','plan']);text=`원문 확인 ${s.reviewed?.length||0} / 5. 확인은 포장으로 바뀌지 않아요.`;break;
 case 'prepare-open':done=s.page==='demo'&&s.route==='prepare';break;
 case 'pack':done=has(s.packed,['paper','glue'])&&!s.packed.includes('apron');text=done?'종이와 풀은 확인됐고, 앞치마는 남아 있어요.':'종이와 풀만 체크하고 앞치마는 체크하지 않은 상태로 맞춰 주세요.';break;
 case 'family-open':done=s.page==='demo'&&s.route==='family';break;
 case 'family':done=s.page==='demo'&&s.route==='today';break;
 case 'moment-open':done=!!s.momentDialog;break;
 case 'moment-save':done=s.page==='demo'&&s.route==='moments'&&s.momentsCount>0;break;
 case 'moment-card':done=s.momentsCount>0;break;
 case 'skin':done=s.skin&&s.skin!=='ivory'&&!s.dialogOpen;break;
 }
 const transition=['open','source-open','prepare-open','family-open','family','moment-save'].includes(step.check);
 if(step.check&&!transition&&(s.page!==step.page||(step.route&&s.route!==step.route))){done=false;text='이 단계의 화면으로 이동한 뒤 다시 확인해 주세요.';}
 return {done:!!done,text:done&&text==='읽고 직접 확인한 뒤 다음으로 넘어가세요.'?'화면에서 확인됐어요. 다음 단계로 이어가세요.':text};
}
