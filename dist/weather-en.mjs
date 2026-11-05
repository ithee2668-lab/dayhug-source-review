/** English presentation of the same local-only weather rules. */
import { weatherInitial as initial, weatherValidate as validate, weatherExperience as experience } from './weather-core.mjs';
const options = rows => Object.freeze(rows.map(([id, label]) => Object.freeze({ id, label })));
export const WEATHER_SCENARIOS = options([['rain', 'Rain'], ['sun', 'Sunshine'], ['cloud', 'Cloudy'], ['snow', 'Snow'], ['wind', 'Wind']]);
export const WEATHER_SEASONS = options([['spring', 'Spring'], ['summer', 'Summer'], ['autumn', 'Autumn'], ['winter', 'Winter']]);
export const SKINS = options([['ivory', 'Warm Ivory'], ['moss', 'Moss Green'], ['lavender', 'Soft Lavender'], ['peach', 'Peach Glow']]);
export function weatherInitial() { return initial(); }
const errors = {
  input: 'Enter weather conditions.', condition: 'Choose a weather condition.',
  temperature: 'Enter a number between -30 and 45°C.', season: 'Choose a season.',
  source: 'Use sample or manual input only.', severe: 'Set weather risk to true or false.',
};
export function weatherValidate(input) {
  const result = validate(input);
  return { valid: result.valid, errors: Object.fromEntries(Object.keys(result.errors).map(key => [key, errors[key]])) };
}
const moments = {
  rain: {
    headline: 'Little splashes. Lasting memories.',
    question: 'What is the rain saying?',
    experience: 'For 30 seconds, hold your caregiver’s hand and gently splash in a checked, shallow, clean puddle away from roads, wearing boots. If there is no safe puddle, listen to the rain indoors instead.',
    safetyNote: 'An adult must check depth, cleanliness and footing first; avoid drains, moving water and slippery ground. Change wet socks and keep umbrella tips away from people.',
  },
  sun: {
    headline: 'A little sunshine to carry with you.',
    question: 'Can your shadow wave hello?',
    experience: 'For 30 seconds, stop with your caregiver in a shady spot away from roads. Wave to your shadow and make a tiny hand shape.',
    safetyNote: 'Never look directly at the sun. Stay in shade and head indoors if hot or uncomfortable.',
  },
  cloud: {
    headline: 'A softer sky. A slower hello.',
    question: 'What does that cloud look like?',
    experience: 'For 30 seconds, stop somewhere safe with your caregiver and choose a cloud. Whisper what its shape reminds you of.',
    safetyNote: 'Stop before looking up; watch ahead while walking. Clouds do not remove heat or UV risk, so check actual conditions.',
  },
  snow: {
    headline: 'A quiet wonder, shared together.',
    question: 'Can you trace a snowflake’s journey?',
    experience: 'For 30 seconds, watch from indoors through a closed window. Trace a falling snowflake in the air, real or imagined.',
    safetyNote: 'Enjoy snow indoors. If travel is necessary, an adult should check for ice; do not eat snow or touch roadside snow.',
  },
  wind: {
    headline: 'The leaves have a dance to share.',
    question: 'Which way are the leaves dancing?',
    experience: 'For 30 seconds, watch the leaves from indoors through a closed window. Sway your hands gently to match their dance.',
    safetyNote: 'Stay inside in strong wind. For necessary travel, avoid trees, signs and construction areas; umbrellas can turn inside out.',
  },
};
const preparations = {
  boots: ['Boots for little adventures', 'Keep little feet dry; boots alone do not prevent slipping on ice.'],
  umbrella: ['An umbrella to share', 'Shoulders closer, raindrops softer.'],
  socks: ['A fresh pair of socks', 'A cozy change if little toes get wet.'],
  hat: ['A little patch of shade', 'A sun hat for the journey.'],
  water: ['A sip and a pause', 'Bring water and take a little break.'],
  layer: ['A cozy extra layer', 'Add warmth or peel it off as needed.'],
  gloves: ['Warm hands, happy journey', 'Keep little fingers cozy when travel is needed.'],
  bag: ['A bag for little essentials', 'Tuck loose things away and keep hands free.'],
  indoors: ['Today, together indoors', 'Choose a safe indoor moment over outdoor play.'],
};
const seasonal = {
  spring: 'Notice flower colors without picking them. Check pollen and air quality before heading out.',
  summer: 'Put shade, water and short breaks first. Avoid hot surfaces and playground equipment.',
  autumn: 'Spot the changing leaf colors. Wet leaves can be slippery underfoot.',
  winter: 'Keep little hands warm. Avoid ice and head indoors when cold.',
};
export function weatherExperience(input = weatherInitial()) {
  const checked = weatherValidate(input);
  if (!checked.valid) throw new TypeError(Object.values(checked.errors).join(' '));
  const result = experience(input);
  const { temperature, condition, season } = result;
  const unsafe = input.severe || temperature <= 0 || temperature >= 33;
  const reason = input.severe ? 'Weather risk is flagged.' : temperature <= 0 ? 'At 0°C or below, cold and ice need extra care.' : 'At 33°C or above, avoid the heat.';
  return {
    ...result,
    ...moments[condition],
    ...(unsafe ? {
      headline: 'Stay cozy. Keep the wonder.',
      question: 'Can you draw the weather in the air?',
      experience: 'For 30 seconds, stay safely indoors, back from a closed window, and trace the weather in the air. Without a view, tap a gentle rain rhythm on your palm.',
      safetyNote: `${reason} Skip outdoor play and follow official alerts and caregiver judgment for necessary travel; gear is not an invitation to play outside.`,
    } : {}),
    preparations: result.preparations.map(item => ({ ...item, name: preparations[item.id][0], helper: preparations[item.id][1] })),
    seasonNote: seasonal[season],
    temperatureNote: temperature < 10 ? 'It may feel chilly. Layer up for necessary travel and check hands and feet.' : temperature >= 25 ? 'It may feel warm. Bring water, choose shade and wear light layers.' : 'How it feels can vary. Adjust layers for comfort.',
    sourceLabel: input.source === 'sample' ? 'Sample conditions · Not a live weather feed' : 'Manual input · Not a live weather feed',
    uncertainty: 'Suggestions use your selected conditions, not a live forecast or Meta connection. Actual weather, feels-like temperature and air quality may differ; check official weather information and local safety before leaving.',
  };
}
