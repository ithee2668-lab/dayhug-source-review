import {extractNotice,briefing,caption,externalGate} from '../dist/core.mjs';
export const deterministicMock={
 mode:'mock',provider:'deterministicMock',
 async extractNotice(input){return extractNotice(input)},
 async summarizeBriefing(state){return {mode:'mock',text:briefing(state).text}},
 async suggestMemoryCaption({confirmed_description=''}){return {mode:'mock',text:caption(confirmed_description)}}
};
// No provider endpoint or model name is invented. Requires a reviewed, server-only
// implementation and validated output before an operator can enable live mode.
export const liveProvider={
 mode:'unconnected',
 async extractNotice({state}){externalGate(state)},
 async summarizeBriefing(state){externalGate(state)},
 async suggestMemoryCaption({state}){externalGate(state)}
};
