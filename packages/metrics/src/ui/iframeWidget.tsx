"use client";
import React, { useRef, useState, useEffect } from "react";

interface IframeWidgetProps {
  url: string;
  displayName: string;
}

export const IframeWidget: React.FC<IframeWidgetProps> = ({
  url,
  displayName,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(400);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.type === "iframe-resize" &&
        typeof event.data.height === "number"
      ) {
        setIframeHeight(event.data.height);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const height = doc.body?.scrollHeight || 400;
        setIframeHeight(height);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="title-sm">{displayName}</h3>
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full border-0"
        title={displayName}
        style={{ height: iframeHeight }}
        onLoad={handleLoad}
      />
    </div>
  );
};
