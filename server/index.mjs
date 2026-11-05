import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {Store,createAPI} from './api.mjs';
const root=dirname(dirname(fileURLToPath(import.meta.url)));await mkdir(join(root,'.local'),{recursive:true});
const store=new Store(join(root,'.local','harupoom.sqlite')),api=createAPI(store),port=Number(process.env.HARUPOOM_PORT||3000);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('HARUPOOM_PORT must be 1024..65535');
const staticPaths={'/':['index.html','text/html; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8'],'/app.mjs':['app.mjs','text/javascript; charset=utf-8'],'/core.mjs':['core.mjs','text/javascript; charset=utf-8'],'/meal-core.mjs':['meal-core.mjs','text/javascript; charset=utf-8'],'/harupoom-offline.html':['harupoom-offline.html','text/html; charset=utf-8']};
const server=createServer(async(req,res)=>{try{if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403);res.end('Loopback host required');return;}const url=new URL(req.url,`http://127.0.0.1:${port}`);if(url.pathname.startsWith('/api/')){const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>30000){res.writeHead(413);res.end();return;}chunks.push(chunk);}const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})}),response=await api(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
 if(req.method!=='GET'||!staticPaths[url.pathname]){res.writeHead(404);res.end();return;}const [file,type]=staticPaths[url.pathname];res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"});res.end(await readFile(join(root,'dist',file)));}catch{res.writeHead(500);res.end('Server error');}});
server.listen(port,'127.0.0.1',()=>{console.log(`하루품 로컬 합성 시연: http://127.0.0.1:${port}`);console.log('실제 가족 데이터 입력 금지. 공개 서버로 사용하지 마세요. 정식 인증은 기존 앱 membership에 연결해야 합니다.');});
process.on('SIGINT',()=>server.close(()=>{store.close();process.exit(0)}));
