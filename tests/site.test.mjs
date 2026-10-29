import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {getPages} from '../src/pages.mjs';
import {reviews} from '../src/data.mjs';
import {articles} from '../src/articles.mjs';
import worker,{siteOrigin,sitemap} from '../worker/index.mjs';
const pages=getPages(),routes=new Set(pages.map(p=>p.path));
const readPage=p=>readFile(new URL(`../dist${p==='/'?'/':p}index.html`,import.meta.url),'utf8');
test('24 requested pages plus privacy, terms and error page are fully rendered',async()=>{
 assert.equal(pages.length,28);assert.equal(articles.length,10);assert.equal(reviews.length,7);
 const titles=new Set();
 for(const page of pages){const html=await readPage(page.path);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page.path);assert.ok(html.includes('<html lang="ms-MY">'));assert.ok(!html.includes('undefined'),page.path);assert.ok(!html.includes('NaN'),page.path);const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert.ok(!titles.has(title),'duplicate title');titles.add(title);assert.ok(html.includes('name="description"'));assert.ok(html.includes('rel="canonical"'));const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(data['@context'],'https://schema.org');assert.ok(data['@graph'].some(x=>x['@type']==='WebPage'));if(page.article)assert.ok(data['@graph'].some(x=>x['@type']==='Article'));if(page.faq)assert.equal(data['@graph'].find(x=>x['@type']==='FAQPage').mainEntity.length,page.faq.length);}
});
test('all internal navigation, image, font and script resources resolve',async()=>{
 for(const page of pages){const html=await readPage(page.path);for(const [,href]of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){if(routes.has(href))continue;const file=new URL('../dist'+href,import.meta.url);assert.ok((await stat(file)).isFile(),`${page.path}: ${href}`);}for(const [,href]of html.matchAll(/href="([^\"]+)"/g)){if(href.startsWith('https://wa.me/')){const msg=new URL(href.replaceAll('&amp;','&')).searchParams.get('text');assert.ok(!msg?.includes('<br>'),'HTML in WhatsApp message');}}}
});
test('portrait contact strip appears only on selected pages',async()=>{
 const selected=new Set(['/insurans-kereta/','/roadtax/','/hubungi/','/blog/memahami-ncd/','/blog/persediaan-renew-roadtax/','/insurans-am-lain/','/ulasan/']);
 for(const page of pages){const html=await readPage(page.path);assert.equal(html.includes('contact-strip with-portrait'),selected.has(page.path),page.path);assert.equal(html.includes('hero hero-home'),page.path==='/',page.path);}
});
test('all genuine review excerpts are present without customer records',async()=>{
 const html=await readPage('/ulasan/');for(const review of reviews)assert.ok(html.includes(review.quote),review.quote);
 assert.ok(!/BQX9026|JUR4977|WKW9949|SWC3799|LA576|710212/.test(html));assert.ok(!html.includes('AggregateRating'));
});

test('article covers differ from their hero and every review has a full image',async()=>{
 for(const a of articles){const html=await readPage(`/blog/${a.slug}/`);const hero=html.match(/class="hero-scene" src="([^"]+)"/)[1];const cover=html.match(/class="article-cover">[\s\S]*?<img src="([^"]+)"/)[1];assert.notEqual(hero,cover,a.slug);}
 const html=await readPage('/ulasan/');assert.equal((html.match(/class="review-screenshot /g)||[]).length,7);
 for(let i=1;i<=7;i++)assert.ok(html.includes(`data-review="${i}"`));
 assert.ok(html.includes('class="review-dialog"'));assert.ok(html.includes('class="review-zoom"'));
});
test('Worker injects canonical origin into HTML and structured data',async()=>{
 const html=await readPage('/insurans-kereta/');
 const env={ASSETS:{fetch:async()=>new Response(html,{headers:{'Content-Type':'text/html','Content-Length':String(html.length)}})}};
 const response=await worker.fetch(new Request('https://insurance.example/insurans-kereta/?campaign=test'),env);const text=await response.text();assert.equal(response.status,200);assert.ok(text.includes('href="https://insurance.example/insurans-kereta/"'));assert.ok(!text.includes('__SITE_ORIGIN__'));assert.ok(!text.includes('?campaign=test'));assert.equal(response.headers.get('Content-Length'),null);assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');assert.ok(response.headers.get('Content-Security-Policy').includes("frame-ancestors 'none'"));
});
test('Analytics loads only for a valid configured measurement ID',async()=>{
 const html=await readPage('/privasi/');
 const makeEnv=id=>({GA_MEASUREMENT_ID:id,ASSETS:{fetch:async()=>new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8'}})}});
 const disabled=await worker.fetch(new Request('https://insurance.example/privasi/'),makeEnv(undefined));
 assert.ok(!(await disabled.text()).includes('/analytics.js'));
 assert.ok(!disabled.headers.get('Content-Security-Policy').includes('googletagmanager.com'));
 const enabled=await worker.fetch(new Request('https://insurance.example/privasi/'),makeEnv('G-TEST123'));
 const text=await enabled.text();
 assert.ok(text.includes('data-measurement-id="G-TEST123"'));
 assert.ok(text.includes('Laman ini menggunakan Google Analytics'));
 assert.ok(enabled.headers.get('Content-Security-Policy').includes('https://www.googletagmanager.com'));
 const invalid=await worker.fetch(new Request('https://insurance.example/privasi/'),makeEnv('G-X" onload="x'));
 assert.ok(!(await invalid.text()).includes('/analytics.js'));
});
test('canonical domain override, sitemap, robots and 404 behavior',async()=>{
 assert.equal(siteOrigin(new Request('https://preview.example/'),{SITE_URL:'https://production.example/'}),'https://production.example');assert.throws(()=>siteOrigin(new Request('https://preview.example/'),{SITE_URL:'http://unsafe.example/'}));
 const xml=sitemap('https://production.example');assert.equal((xml.match(/<loc>/g)||[]).length,27);assert.ok(!xml.includes('/404/'));assert.ok(xml.includes('/blog/memahami-ncd/'));
 const robots=await worker.fetch(new Request('https://production.example/robots.txt'),{});assert.ok((await robots.text()).includes('Sitemap: https://production.example/sitemap.xml'));
 const response=await worker.fetch(new Request('https://production.example/no-such-page/'),{ASSETS:{fetch:async()=>new Response(await readPage('/404/'),{status:404,headers:{'Content-Type':'text/html'}})}});assert.equal(response.status,404);assert.equal(response.headers.get('X-Robots-Tag'),'noindex');
});
test('Worker preserves media range responses and HEAD semantics',async()=>{
 const env={ASSETS:{fetch:async()=>new Response(new Uint8Array([1,2,3]),{status:206,headers:{'Content-Type':'video/mp4','Content-Range':'bytes 0-2/100'}})}};
 const video=await worker.fetch(new Request('https://website.example/assets/videosale1.mp4',{headers:{Range:'bytes=0-2'}}),env);assert.equal(video.status,206);assert.equal(video.headers.get('Content-Range'),'bytes 0-2/100');assert.deepEqual([...new Uint8Array(await video.arrayBuffer())],[1,2,3]);
 const head=await worker.fetch(new Request('https://website.example/sitemap.xml',{method:'HEAD'}),{});assert.equal((await head.text()).length,0);const post=await worker.fetch(new Request('https://website.example/',{method:'POST'}),{});assert.equal(post.status,405);
});
