import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from '../worker/index.mjs';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8'};
const assets={async fetch(request){
 const url=new URL(request.url);let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
 let filename=path.resolve(root,'.'+pathname);if(filename!==root&&!filename.startsWith(root+path.sep))return new Response('Forbidden',{status:403});
 try{const info=await stat(filename);if(info.isDirectory()){if(!url.pathname.endsWith('/'))return Response.redirect(url.origin+url.pathname+'/',307);filename=path.join(filename,'index.html');}const data=await readFile(filename),headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes'};const range=request.headers.get('range');if(range&&path.extname(filename)==='.mp4'){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(m){const start=Number(m[1]),end=Math.min(m[2]?Number(m[2]):data.length-1,data.length-1);if(start> end)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.length}`}});return new Response(data.subarray(start,end+1),{status:206,headers:{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`}});}}return new Response(request.method==='HEAD'?null:data,{headers});}
 catch{return new Response(await readFile(path.join(root,'404.html')),{status:404,headers:{'Content-Type':'text/html; charset=utf-8'}});}
}};
const port=Number(process.env.PORT||8787);
const server=http.createServer(async(req,res)=>{try{const request=new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method,headers:req.headers});const result=await worker.fetch(request,{ASSETS:assets});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch(error){console.error(error.message);res.writeHead(500);res.end('Preview error');}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
