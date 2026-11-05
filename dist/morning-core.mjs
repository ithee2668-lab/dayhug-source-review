export const MORNING_SCRIPT=Object.freeze([
 "Good morning. Here’s your sample morning briefing.",
 "Grandma shared the nursery notice, daily note, and a drawing last night, while you were working late.",
 "You haven’t caught up yet. Let’s start with what needs your attention.",
 "Your partner bought the colored paper and glue. Bought doesn’t mean packed, so the bag still needs your check.",
 "An apron was added to the notice. Please check that, too.",
 "The activity fee is still unconfirmed. There’s a family handoff to review, but no request has been sent.",
 "In this rainy-morning example, put boots, an umbrella, and dry socks by the door.",
 "And one little question for the walk: what is the rain saying?",
 "The drawing Grandma shared is here when you’re ready. One small moment, held together."
]);
export const VOICE_SAMPLE="Good morning. Let’s make room for one little moment together.";
export function englishVoices(voices){return Array.from(voices||[]).filter(v=>v&&typeof v.lang==='string'&&/^en(?:[-_]|$)/i.test(v.lang)&&typeof v.name==='string').sort((a,b)=>voiceScore(b)-voiceScore(a)||a.name.localeCompare(b.name));}
export function voiceScore(v){let s=0;const name=v.name||'';if(/natural|neural|enhanced|premium/i.test(name))s+=100;if(/Google US English|Samantha|Jenny|Aria|Ava|Serena|Daniel/i.test(name))s+=30;if(/^en[-_]US$/i.test(v.lang))s+=20;else if(/^en[-_]GB$/i.test(v.lang))s+=15;if(v.localService)s+=3;if(v.default)s+=1;return s;}
export function selectEnglishVoice(voices,savedURI){const list=englishVoices(voices);return list.find(v=>v.voiceURI===savedURI)||list[0]||null;}
export function speechRate(value){if(typeof value!=='number'&&typeof value!=='string')throw Error('Choose a supported reading pace.');const rate=Number(value);if(![0.94,1,1.06].includes(rate))throw Error('Choose a supported reading pace.');return rate;}
