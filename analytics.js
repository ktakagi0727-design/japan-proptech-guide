(function () {
  const measurementId = "G-K7SK0GTYGN";

  if (!/^G-[A-Z0-9]+$/.test(measurementId) || measurementId === "G-XXXXXXXXXX") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true,
    page_title: document.title,
    page_location: window.location.href
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
}());
