import Script from "next/script";

/**
 * Loads GA4 only if NEXT_PUBLIC_GA_ID is set — omit the env var in local
 * dev so you're not polluting production analytics with dev traffic.
 * Loaded with strategy="afterInteractive" so it never competes with LCP.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
