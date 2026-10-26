import {mkdir,writeFile,cp,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {getPages} from '../src/pages.mjs';
import {layout} from '../src/ui.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
const pages=getPages();
for(const page of pages){const dir=path.join(dist,page.path);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),layout(page,page.render()));}
const notFound=await readFile(path.join(dist,'404/index.html'),'utf8');await writeFile(path.join(dist,'404.html'),notFound);
await mkdir(path.join(root,'worker'),{recursive:true});
const routes=pages.filter(p=>!p.noindex).map(({path,title,description})=>({path,title,description}));
await writeFile(path.join(root,'worker/routes.json'),JSON.stringify(routes,null,2)+'\n');
await writeFile(path.join(dist,'llms.txt'),`# Insurans & Roadtax MY\n\n> Maklumat insurans, takaful dan roadtax di Malaysia. Pertanyaan: Abdul Kata bin Haji Burijin, +601171187780.\n\n## Halaman\n${routes.map(r=>`- [${r.title}](__SITE_ORIGIN__${r.path}): ${r.description}`).join('\n')}\n\n## Nota\nKandungan ialah panduan umum. Penerimaan, harga dan perlindungan tertakluk kepada dokumen polisi atau sijil sebenar.\n`);
console.log(`Built ${pages.length} HTML pages: 24 design pages, privacy, terms and 404.`);
