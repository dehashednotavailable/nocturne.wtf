import { useEffect, useMemo, useState } from "react";

type DecryptedTextProps = {
  text: string;
  speedMs?: number;
  className?: string;
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%&*";

function pickGlyph(seed: number) {
  const hash = Math.abs(Math.sin(seed) * 10000);
  return GLYPHS[Math.floor(hash) % GLYPHS.length];
}

export function DecryptedText({
  text,
  speedMs = 24,
  className,
}: DecryptedTextProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrame((prev) => {
        if (prev >= text.length) {
          window.clearInterval(timer);
          return prev;
        }

        return prev + 1;
      });
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [speedMs, text]);

  const output = useMemo(() => {
    return text
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return " ";
        }

        if (index < frame) {
          return char;
        }

        return pickGlyph((index + 1) * (frame + 3));
      })
      .join("");
  }, [frame, text]);

  return <span className={className}>{output}</span>;
}
