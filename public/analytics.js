(() => {
  const id = document.currentScript?.dataset.measurementId;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(tag);
  gtag('js', new Date());
  let referrer = '';
  try {
    const url = new URL(document.referrer);
    referrer = url.origin + url.pathname;
  } catch { /* Direct visit. */ }
  gtag('config', id, {
    page_location: location.origin + location.pathname,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
})();
