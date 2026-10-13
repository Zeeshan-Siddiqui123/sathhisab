// Relative luminance and contrast ratio helper per WCAG 2.1
function parseColor(colorStr) {
  if (!colorStr) return [0, 0, 0, 1];
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 1];
  }
  const match = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (match) {
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] !== undefined ? parseFloat(match[4]) : 1,
    ];
  }
  return [0, 0, 0, 1];
}

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function composite(fgRgba, bgRgba) {
  const [r1, g1, b1, a1] = fgRgba;
  const [r2, g2, b2] = bgRgba;
  const r = Math.round(r1 * a1 + r2 * (1 - a1));
  const g = Math.round(g1 * a1 + g2 * (1 - a1));
  const b = Math.round(b1 * a1 + b2 * (1 - a1));
  return [r, g, b, 1];
}

export function contrastRatio(color1, color2) {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  const effective1 = c1[3] < 1 ? composite(c1, c2) : c1;
  const effective2 = c2[3] < 1 ? composite(c2, [255, 255, 255, 1]) : c2;

  const lum1 = luminance(effective1[0], effective1[1], effective1[2]);
  const lum2 = luminance(effective2[0], effective2[1], effective2[2]);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
