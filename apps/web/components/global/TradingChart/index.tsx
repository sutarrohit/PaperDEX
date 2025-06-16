"use client";
import React, { useEffect, useRef, useState, memo } from "react";

interface TradingViewWidgetProps {
  tokenPair: string;
}

function TradingViewWidget({ tokenPair }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!container.current) return;

    setIsLoading(true); // Start loading

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetConfig = {
      autosize: true,
      symbol: `BINANCE:${tokenPair}`,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: false,
      support_host: "https://www.tradingview.com",
      enabled_features: ["header_widget_buttons_mode_fullsize"],
      disabled_features: [],
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    container.current.appendChild(script);

    // Watch for widget iframe to load
    const interval = setInterval(() => {
      const iframe = container.current?.querySelector("iframe");
      if (iframe) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 300); // check every 300ms

    return () => {
      clearInterval(interval);
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [tokenPair]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-white text-sm">
          Loading chart...
        </div>
      )}

      <div
        className="tradingview-widget-container overflow-hidden rounded-xs"
        ref={container}
        style={{ height: "100%", width: "100%", border: "none" }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);
