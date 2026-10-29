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

  // Send only a fixed interaction type; WhatsApp URLs can contain private messages.
  const trackWhatsApp = source => gtag('event', 'whatsapp_click', {
    interaction_source: source,
    transport_type: 'beacon'
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.href, location.href);
      if (url.hostname === 'wa.me' && url.protocol === 'https:') trackWhatsApp('link');
    } catch { /* Ignore malformed links. */ }
  }, true);
  document.addEventListener('submit', event => {
    if (event.target.matches?.('form.enquiry-form')) trackWhatsApp('enquiry_form');
  }, true);
})();
