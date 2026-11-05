/** Pure, local weather-inspired conversation suggestions. Never a weather feed. */
const options = rows => Object.freeze(rows.map(([id, label]) => Object.freeze({ id, label })));
export const WEATHER_SCENARIOS = options([
  ['rain', '비'], ['sun', '맑음'], ['cloud', '흐림'], ['snow', '눈'], ['wind', '바람'],
]);
export const WEATHER_SEASONS = options([
  ['spring', '봄'], ['summer', '여름'], ['autumn', '가을'], ['winter', '겨울'],
]);
export const SKINS = options([
  ['ivory', '포근한 아이보리'], ['moss', '숲빛 모스 그린'], ['lavender', '꿈결 라벤더'], ['peach', '살구빛 피치'],
]);
export function weatherInitial() {
  return { condition: 'rain', temperature: 17, season: 'autumn', source: 'sample', severe: false };
}
export function weatherValidate(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: { input: '날씨 조건을 입력해 주세요.' } };
  }
  if (!WEATHER_SCENARIOS.some(x => x.id === input.condition)) errors.condition = '날씨를 선택해 주세요.';
  if (typeof input.temperature !== 'number' || !Number.isFinite(input.temperature) || input.temperature < -30 || input.temperature > 45) {
    errors.temperature = '기온은 -30~45°C 사이의 숫자로 입력해 주세요.';
  }
  if (!WEATHER_SEASONS.some(x => x.id === input.season)) errors.season = '계절을 선택해 주세요.';
  if (!['sample', 'manual'].includes(input.source)) errors.source = '예시 또는 직접 입력만 사용할 수 있어요.';
  if (typeof input.severe !== 'boolean') errors.severe = '기상 위험 여부를 확인해 주세요.';
  return { valid: Object.keys(errors).length === 0, errors };
}
const prep = (id, name, helper, art = id) => ({ id, name, helper, art });
const moments = {
  rain: {
    headline: '톡톡, 빗방울이 작은 인사를 건네요',
    question: '빗방울은 어떤 소리로 인사할까?',
    experience: '30초, 보호자와 손을 잡고 차도에서 떨어진 안전한 곳의 얕고 깨끗한 물웅덩이를 확인해요. 장화를 신고 제자리에서 살짝 첨벙, 물소리를 함께 들어요. 알맞은 곳이 없으면 실내에서 빗소리를 들어요.',
    safetyNote: '보호자가 깊이·청결·바닥을 먼저 확인해 주세요. 차도, 배수구, 흐르는 물, 미끄러운 곳은 피하고 젖은 양말은 갈아 신어요. 우산 끝은 사람을 향하지 않게 해요.',
    preparations: [prep('boots', '작은 발을 위한 장화', '물방울을 만나도 발끝은 보송하게.'), prep('umbrella', '함께 쓰는 우산', '어깨를 가까이, 빗소리는 더 가까이.'), prep('socks', '보송한 여벌 양말', '젖었다면 따뜻한 새 양말로 갈아 신어요.')],
  },
  sun: {
    headline: '햇살 한 조각을 주머니에 담는 아침',
    question: '우리 그림자는 어디로 따라올까?',
    experience: '30초, 보호자와 차도에서 떨어진 그늘에 멈춰 서요. 바닥에 비친 그림자에게 손을 흔들고 손가락 모양을 바꿔 보아요. 햇빛을 직접 바라보지는 않아요.',
    safetyNote: '그늘에서 짧게 머물러요. 눈으로 태양을 보지 않고, 더위나 불편함이 느껴지면 실내로 이동해요.',
    preparations: [prep('hat', '햇살을 가리는 모자', '작은 그늘을 머리 위에 얹어요.'), prep('water', '한 모금 물', '목이 마르기 전에 잠깐 쉬어가요.')],
  },
  cloud: {
    headline: '구름 이불 아래, 조금 느리게 걸어요',
    question: '저 구름은 무엇을 닮았을까?',
    experience: '30초, 보호자와 안전한 곳에 멈춰 서서 하늘을 잠깐 살펴요. 구름 하나를 고르고 닮은 모양을 속삭여요. 하늘을 보며 걷지는 않아요.',
    safetyNote: '흐린 날도 자외선과 더위가 있을 수 있어요. 걷는 동안은 앞을 보고, 변화하는 하늘과 실제 기상 안내를 확인해 주세요.',
    preparations: [prep('layer', '가볍게 걸칠 겉옷', '서늘하면 덮고, 더우면 벗어요.'), prep('water', '작은 물병', '천천히 쉬어갈 한 모금을 챙겨요.')],
  },
  snow: {
    headline: '하얀 풍경이 마음에 사뿐 내려앉아요',
    question: '눈송이가 내려오는 모습을 손으로 그려볼까?',
    experience: '30초, 실내의 닫힌 창 너머로 눈을 바라봐요. 손가락으로 눈송이가 내려오는 길을 공중에 천천히 그려요. 눈이 보이지 않으면 함께 상상해도 좋아요.',
    safetyNote: '눈은 실내에서 감상해요. 이동이 필요하면 보호자가 빙판과 미끄럼을 확인해 주세요. 눈을 먹거나 도로 옆 눈을 만지지 않아요.',
    preparations: [prep('gloves', '포근한 장갑', '이동할 때 작은 손의 온기를 지켜요.'), prep('boots', '미끄럼을 줄이는 신발', '장화만으로 빙판을 막을 수는 없어요.')],
  },
  wind: {
    headline: '바람이 나뭇잎에게 말을 걸어요',
    question: '나뭇잎은 어느 쪽으로 춤출까?',
    experience: '30초, 실내의 닫힌 창 너머로 나뭇잎의 움직임을 살펴요. 손을 잎사귀처럼 좌우로 살살 흔들며 바람의 춤을 따라 해요.',
    safetyNote: '바람이 강하면 실내에 머물러요. 이동할 때 나무 아래, 간판, 공사장 주변을 피하고 우산은 바람에 뒤집힐 수 있어요.',
    preparations: [prep('layer', '가볍고 포근한 겉옷', '필요한 이동에는 지퍼를 여며요.'), prep('bag', '손이 자유로운 가방', '날아가기 쉬운 물건은 가방 안에 넣어요.')],
  },
};
const seasonal = {
  spring: '봄에는 꽃을 꺾기보다 색을 눈으로 찾아보아요. 꽃가루와 바깥 공기 상태도 확인해요.',
  summer: '여름에는 그늘과 짧은 휴식을 먼저 챙겨요. 뜨거운 바닥이나 놀이기구는 만지지 않아요.',
  autumn: '가을에는 나뭇잎의 다른 색을 눈으로 찾아보아요. 젖은 낙엽 위에서는 미끄럼을 조심해요.',
  winter: '겨울에는 손끝의 온기를 챙겨요. 빙판이 보이면 돌아가고 추우면 실내로 들어가요.',
};
export function weatherExperience(input = weatherInitial()) {
  const validation = weatherValidate(input);
  if (!validation.valid) throw new TypeError(Object.values(validation.errors).join(' '));
  const { condition, temperature, season, source, severe } = input;
  const base = moments[condition];
  const safetyOverride = severe || temperature <= 0 || temperature >= 33;
  const indoor = safetyOverride || condition === 'snow' || condition === 'wind';
  const reason = severe ? '기상 위험을 선택했어요.' : temperature <= 0 ? '입력한 기온이 0°C 이하여서 결빙과 추위에 주의해요.' : temperature >= 33 ? '입력한 기온이 33°C 이상이어서 더위를 피해요.' : '';
  const temperatureNote = temperature < 10 ? '쌀쌀할 수 있어요. 이동할 때 겹쳐 입고 손발의 온기를 확인해요.' : temperature >= 25 ? '덥게 느껴질 수 있어요. 가벼운 옷과 물, 그늘을 챙겨요.' : '몸이 느끼는 온도는 다를 수 있어요. 덥거나 서늘하면 겉옷을 조절해요.';
  const preparations = base.preparations.map(item => ({ ...item }));
  if (temperature < 10 && !preparations.some(x => x.id === 'layer')) preparations.push(prep('layer', '포근한 겉옷', '입력한 기온이 낮아요. 이동이 필요하면 따뜻하게 챙겨요.'));
  if (temperature >= 25 && !preparations.some(x => x.id === 'water')) preparations.push(prep('water', '시원한 물 한 모금', '더운 날은 쉬어가며 물을 마셔요.'));
  if (safetyOverride) preparations.unshift(prep('indoors', '오늘의 준비는 실내 쉼', '밖에서 놀기보다 안전한 실내에서 짧게 함께해요.', 'home'));
  return {
    condition, temperature, season, indoor,
    headline: safetyOverride ? '오늘은 포근한 안에서, 날씨와 인사해요' : base.headline,
    question: safetyOverride ? '창밖 풍경을 손가락으로 그려볼까?' : base.question,
    experience: safetyOverride ? '30초, 안전한 실내에서 닫힌 창과 거리를 두고 창밖 풍경을 바라봐요. 손가락으로 비, 햇살, 구름 중 보이는 것을 공중에 그려요. 창밖이 보이지 않으면 손바닥을 톡톡 두드리며 날씨를 상상해요.' : base.experience,
    safetyNote: safetyOverride ? `${reason} 야외 놀이는 미루고 안전한 실내 활동을 우선해요. 실제 기상 특보와 보호자 판단을 따라 이동 여부를 결정해 주세요. 준비물은 필요한 이동을 위한 것이며 야외 놀이를 권하는 뜻이 아니에요.` : base.safetyNote,
    preparations,
    seasonNote: seasonal[season], temperatureNote,
    sourceLabel: source === 'sample' ? '가상 예시 · 실제 날씨 아님' : '직접 입력 · 실제 날씨 확인 필요',
    uncertainty: '입력한 조건으로 만든 대화 제안이에요. 실시간 예보나 Meta 연동 정보가 아니며, 실제 날씨·체감온도·공기 상태는 다를 수 있어요. 출발 전 공식 기상 정보와 주변 안전을 확인해 주세요.',
  };
}
