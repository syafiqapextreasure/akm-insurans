const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const menuButton=$('.menu-toggle'),header=$('.site-header');
function closeMenu(){header?.classList.remove('menu-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Buka menu');}
menuButton?.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Tutup menu':'Buka menu');});
document.addEventListener('click',event=>{if(!header?.contains(event.target)){closeMenu();$$('.nav-dropdown[open]').forEach(d=>d.open=false);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();$$('.nav-dropdown[open]').forEach(d=>d.open=false);}});
matchMedia('(min-width: 981px)').addEventListener('change',closeMenu);

const quoteDialog=$('.quote-dialog');
$$('[data-quote]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!quoteDialog?.showModal)return;
 event.preventDefault();closeMenu();const topic=link.dataset.quote;
 const coverage=$('input[name="coverage"]:checked')?.value;
 const description=coverage?`${topic} — ${coverage}`:topic;
 $('#dialog-topic').textContent=description;
 $('#dialog-whatsapp').href=`https://wa.me/601171187780?text=${encodeURIComponent(`Salam Abdul Kata, saya ingin mendapatkan semakan harga untuk ${description}.`)}`;
 quoteDialog.showModal();document.body.classList.add('modal-open');
}));
$('.dialog-close')?.addEventListener('click',()=>quoteDialog.close());
quoteDialog?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
quoteDialog?.addEventListener('click',event=>{if(event.target!==quoteDialog)return;const r=quoteDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)quoteDialog.close();});
quoteDialog?.querySelector('a[href="/hubungi/#pertanyaan"]')?.addEventListener('click',()=>quoteDialog.close());

$('.enquiry-form')?.addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const fields=new FormData(form),name=String(fields.get('nama')||'').trim(),phone=String(fields.get('telefon')||'').trim(),product=String(fields.get('produk')||'').trim(),message=String(fields.get('mesej')||'').trim();
 const lines=['Salam Abdul Kata, saya ingin membuat pertanyaan.',name?`Nama: ${name}`:'',phone?`Telefon: ${phone}`:'',`Produk: ${product}`,message?`Mesej: ${message}`:''].filter(Boolean);
 window.location.assign(`https://wa.me/601171187780?text=${encodeURIComponent(lines.join('\n'))}`);
});

const articleCards=$$('[data-article]'),search=$('#article-search');let category='Semua';
function filterArticles(){
 const term=(search?.value||'').normalize('NFKC').toLocaleLowerCase('ms').trim();let shown=0;
 for(const card of articleCards){const matches=(!term||card.dataset.search.includes(term))&&(category==='Semua'||card.dataset.category===category);card.hidden=!matches;if(matches)shown++;}
 if($('#article-count'))$('#article-count').textContent=String(shown);
 $('.blog-grid')?.classList.toggle('is-filtered',Boolean(term)||category!=='Semua');
 if($('.empty-results'))$('.empty-results').hidden=shown!==0;
}
search?.addEventListener('input',filterArticles);
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterArticles();}));

$$('.video-player').forEach(player=>{const video=$('video',player),button=$('.video-play',player);button?.addEventListener('click',async()=>{try{await video.play();}catch{video.controls=true;video.focus();}});video.addEventListener('play',()=>{player.classList.add('playing');$$('video').filter(v=>v!==video).forEach(v=>v.pause());});video.addEventListener('ended',()=>player.classList.remove('playing'));});

if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}},{threshold:.1});$$('.reveal').forEach(el=>observer.observe(el));}
const parallax=$('[data-parallax]');let scheduled=false;
function updateParallax(){scheduled=false;if(!parallax)return;const enabled=!motion.matches&&innerWidth>700;const offset=enabled?Math.min(scrollY*.14,70):0;parallax.style.setProperty('--parallax',`${offset.toFixed(1)}px`);}
function scheduleParallax(){if(!scheduled){scheduled=true;requestAnimationFrame(updateParallax);}}
window.addEventListener('scroll',scheduleParallax,{passive:true});window.addEventListener('resize',scheduleParallax,{passive:true});motion.addEventListener('change',scheduleParallax);updateParallax();
window.addEventListener('pageshow',()=>{document.body.classList.remove('modal-open');if(quoteDialog?.open)quoteDialog.close();});

const reviewModal=$('.review-dialog');
// Capture the click after a drag before any review link opens its dialog.
$$('.review-carousel').forEach(carousel=>{
 const track=$('.review-grid',carousel),toggle=$('[data-autoplay]',carousel);
 let paused=motion.matches,hover=false,focused=false,drag=null,suppressClick=false;
 const sync=()=>{toggle.textContent=paused?'Main automatik':'Jeda';toggle.setAttribute('aria-pressed',String(paused));};
 const step=direction=>{const size=track.firstElementChild.getBoundingClientRect().width+20;const end=track.scrollWidth-track.clientWidth;track.scrollTo({left:direction>0&&track.scrollLeft>=end-3?0:Math.max(0,track.scrollLeft+direction*size),behavior:motion.matches?'instant':'smooth'});};
 sync();toggle.addEventListener('click',()=>{paused=!paused;sync();});
 $$('[data-slide]',carousel).forEach(button=>button.addEventListener('click',()=>step(Number(button.dataset.slide))));
 carousel.addEventListener('mouseenter',()=>hover=true);carousel.addEventListener('mouseleave',()=>hover=false);
 carousel.addEventListener('focusin',()=>focused=true);carousel.addEventListener('focusout',event=>{focused=carousel.contains(event.relatedTarget);});
 motion.addEventListener('change',()=>{if(motion.matches){paused=true;sync();}});
 track.addEventListener('keydown',event=>{if(event.target===track&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}});
 track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag={x:event.clientX,left:track.scrollLeft,id:event.pointerId};suppressClick=false;});
 track.addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x;if(Math.abs(dx)>6){suppressClick=true;track.classList.add('dragging');track.setPointerCapture(drag.id);track.scrollLeft=drag.left-dx;}});
 const finish=()=>{drag=null;track.classList.remove('dragging');};
 track.addEventListener('pointerup',finish);track.addEventListener('pointercancel',finish);track.addEventListener('lostpointercapture',finish);
 track.addEventListener('dragstart',event=>event.preventDefault());
 track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}},true);
 setInterval(()=>{if(paused||hover||focused||drag||document.hidden||document.querySelector('dialog[open]'))return;const box=track.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)step(1);},5500);
});
$$('[data-review]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!reviewModal?.showModal)return;
 event.preventDefault();$('.review-dialog-image',reviewModal).classList.remove('zoomed');$('.review-zoom',reviewModal).setAttribute('aria-pressed','false');$('.review-zoom',reviewModal).textContent='Zum +';$('.review-dialog-image img',reviewModal).src=link.getAttribute('href');
 $('#review-title').textContent='Perbualan WhatsApp '+link.dataset.review+' / 7';
 reviewModal.showModal();$('.review-dialog-image',reviewModal).scrollTop=0;document.body.classList.add('modal-open');
}));
$('.review-close')?.addEventListener('click',()=>reviewModal.close());
reviewModal?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
reviewModal?.addEventListener('click',event=>{if(event.target===reviewModal){const r=reviewModal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)reviewModal.close();}});

$('.review-zoom')?.addEventListener('click',event=>{const zoomed=$('.review-dialog-image').classList.toggle('zoomed');event.currentTarget.setAttribute('aria-pressed',String(zoomed));event.currentTarget.textContent=zoomed?'Muat skrin':'Zum +';});
