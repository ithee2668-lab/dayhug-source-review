import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const html=await read('dist/index.html'),css=await read('dist/style.css'),core=(await read('dist/core.mjs')).replaceAll('export ',''),mealcore=(await read('dist/meal-core.mjs')).replaceAll('export ',''),app=(await read('dist/app.mjs')).replace(/^import[^\n]+\n/,'');
await writeFile(new URL('dist/harupoom-offline.html',root),html.replace('<link rel="stylesheet" href="style.css">',`<style>${css}</style>`).replace('<script type="module" src="app.mjs"></script>',`<script type="module">${core}\n${mealcore}\n${app}</script>`));
