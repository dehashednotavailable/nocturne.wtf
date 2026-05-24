import { useMemo } from "react";

type AsciiGlyphProps = {
  target?: string;
  fontSize?: number;
  width?: number;
  height?: number;
};

const CHARSET = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function buildAsciiFrame(
  text: string,
  width: number,
  height: number,
  fontSize: number,
  charset: string,
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return text;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${fontSize}px 'Courier New', monospace`;
  ctx.fillText(text, width / 2, height / 2 + 1);

  const sampleStepX = 2;
  const sampleStepY = 3;
  const img = ctx.getImageData(0, 0, width, height).data;

  let out = "";
  for (let y = 0; y < height; y += sampleStepY) {
    for (let x = 0; x < width; x += sampleStepX) {
      const i = (y * width + x) * 4;
      const r = img[i] ?? 0;
      const g = img[i + 1] ?? 0;
      const b = img[i + 2] ?? 0;
      const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
      const value = Math.max(0, Math.min(1, gray));
      const idx = Math.floor(value * (charset.length - 1));
      out += charset[idx] ?? " ";
    }
    out += "\n";
  }

  return out;
}

export function AsciiGlyph({
  target = "N",
  fontSize = 34,
  width = 56,
  height = 56,
}: AsciiGlyphProps) {
  const baseColor = useMemo(() => "#eef3ff", []);
  const frame = useMemo(
    () => buildAsciiFrame(target, width, height, fontSize, CHARSET),
    [fontSize, height, target, width],
  );

  return (
    <span className="ascii-glyph" style={{ color: baseColor }}>
      {frame}
    </span>
  );
}
