import React from "react";

const ANSI_COLORS: Record<string, string> = {
  "30": "#000000",
  "31": "#ef4444",
  "32": "#22c55e",
  "33": "#eab308",
  "34": "#3b82f6",
  "35": "#a855f7",
  "36": "#06b6d4",
  "37": "#e5e7eb",
  "90": "#6b7280",
  "91": "#f87171",
  "92": "#4ade80",
  "93": "#facc15",
  "94": "#60a5fa",
  "95": "#c084fc",
  "96": "#22d3ee",
  "97": "#ffffff",
};

const ANSI_BG_COLORS: Record<string, string> = {
  "40": "#000000",
  "41": "#ef4444",
  "42": "#22c55e",
  "43": "#eab308",
  "44": "#3b82f6",
  "45": "#a855f7",
  "46": "#06b6d4",
  "47": "#e5e7eb",
  "100": "#6b7280",
  "101": "#f87171",
  "102": "#4ade80",
  "103": "#facc15",
  "104": "#60a5fa",
  "105": "#c084fc",
  "106": "#22d3ee",
  "107": "#ffffff",
};

interface ParsedSegment {
  text: string;
  style?: React.CSSProperties;
}

export function parseAnsiToSegments(text: string): ParsedSegment[] {
  const ansiRegex = /\x1b\[([0-9;]+)m/g;
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  let currentStyle: React.CSSProperties = {};

  let match;
  while ((match = ansiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textSegment = text.slice(lastIndex, match.index);
      if (textSegment) {
        segments.push({ text: textSegment, style: { ...currentStyle } });
      }
    }

    const codes = match[1].split(';');
    for (const code of codes) {
      if (code === '0') {
        currentStyle = {};
      } else if (code === '1') {
        currentStyle.fontWeight = 'bold';
      } else if (code === '3') {
        currentStyle.fontStyle = 'italic';
      } else if (code === '4') {
        currentStyle.textDecoration = 'underline';
      } else if (ANSI_COLORS[code]) {
        currentStyle.color = ANSI_COLORS[code];
      } else if (ANSI_BG_COLORS[code]) {
        currentStyle.backgroundColor = ANSI_BG_COLORS[code];
      }
    }

    lastIndex = ansiRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      segments.push({ text: remainingText, style: { ...currentStyle } });
    }
  }

  if (segments.length === 0 && text) {
    segments.push({ text });
  }

  return segments;
}

export function AnsiText({ text }: { text: string }) {
  const segments = parseAnsiToSegments(text);

  return (
    <>
      {segments.map((segment, index) => (
        <span key={index} style={segment.style}>
          {segment.text}
        </span>
      ))}
    </>
  );
}
