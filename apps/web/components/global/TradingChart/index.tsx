"use client";
import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  tokenPair: string;
}

function TradingViewWidget({ tokenPair }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear existing child nodes (prevents duplicate charts)
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Construct the widget configuration object
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
      // fullscreen: true, // You can keep this if you want it to load fullscreen initially
      enabled_features: [
        // Add this array
        "header_widget_buttons_mode_fullsize", // Explicitly enable the fullscreen button
      ],
      disabled_features: [], // You can add features here to disable them
    };

    // Convert the configuration object to a JSON string for innerHTML
    script.innerHTML = JSON.stringify(widgetConfig);

    container.current.appendChild(script);

    // Optional: Clean up the script when the component unmounts or tokenPair changes
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [tokenPair]); // Added tokenPair to dependency array to re-render if the pair changes

  return (
    <div
      className="tradingview-widget-container overflow-hidden"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      {/* The TradingView widget will be injected into this container div. */}
      {/* The TradingView attribution will be added by the widget script itself. */}
    </div>
  );
}

export default memo(TradingViewWidget);
