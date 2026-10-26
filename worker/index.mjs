import routes from './routes.json' with {type:'json'};

export function siteOrigin(request,env={}){
 if(env.SITE_URL){const configured=new URL(env.SITE_URL);if(configured.protocol!=='https:')throw new Error('SITE_URL must use https');return configured.origin;}
 return new URL(request.url).origin;
}
export function sitemap(origin){return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${origin}${r.path}</loc></url>`).join('')}</urlset>`;}
const security={
 'X-Content-Type-Options':'nosniff',
 'Referrer-Policy':'strict-origin-when-cross-origin',
 'X-Frame-Options':'DENY',
 'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action https://wa.me"
};
export default {async fetch(request,env){
 const url=new URL(request.url),origin=siteOrigin(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD',...security}});
 let response;
 if(url.pathname==='/sitemap.xml')response=new Response(sitemap(origin),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
 else if(url.pathname==='/robots.txt')response=new Response(`User-agent: *\nAllow: /\nDisallow: /404/\nSitemap: ${origin}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}});
 else response=await env.ASSETS.fetch(request);
 const headers=new Headers(response.headers);for(const [key,value]of Object.entries(security))headers.set(key,value);
 const isText=headers.get('Content-Type')?.includes('text/html')||url.pathname==='/llms.txt';
 if(isText&&request.method!=='HEAD'){
  const text=(await response.text()).replaceAll('__SITE_ORIGIN__',origin);
  headers.delete('Content-Length');headers.delete('ETag');headers.set('Cache-Control','public, max-age=0, must-revalidate');
  if(response.status===404||url.pathname==='/404/')headers.set('X-Robots-Tag','noindex');
  return new Response(text,{status:response.status,headers});
 }
 if(url.pathname.startsWith('/assets/'))headers.set('Cache-Control','public, max-age=86400');
 return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
}};
