"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function AnalyticsWrapper() {
  const gaId = "G-NXQMKPQ3JT"; // Dedicated Google Tag for Leslie's Weaving Studio

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process GA4_CUSTOM_EVENT messages
      if (event.data && event.data.type === "GA4_CUSTOM_EVENT") {
        const { eventName, params } = event.data;
        // Check if gtag is loaded and available
        if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
          (window as any).gtag("event", eventName, params);
        } else {
          console.warn("[AnalyticsWrapper] Received GA4_CUSTOM_EVENT but gtag is not loaded yet.", eventName, params);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <Script
        key={`gtag-src-${gaId}`}
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        key={`gtag-init-${gaId}`}
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
