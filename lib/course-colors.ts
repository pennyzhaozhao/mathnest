const NAMED_COLORS = new Set(['coral', 'mint', 'lemon', 'lilac', 'sky', 'pink']);

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixChannel(a: number, b: number, amount: number): number {
  return clamp(a + (b - a) * amount);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim();
  const match = normalized.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return null;
  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((channel) => clamp(channel).toString(16).padStart(2, '0')).join('')}`;
}

function mix(hex: string, target: '#ffffff' | '#000000', amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const targetRgb = target === '#ffffff' ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  return rgbToHex(
    mixChannel(rgb.r, targetRgb.r, amount),
    mixChannel(rgb.g, targetRgb.g, amount),
    mixChannel(rgb.b, targetRgb.b, amount)
  );
}

export function isHexColor(color: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(color.trim());
}

export function normalizeCourseColor(color: string): string {
  const trimmed = color.trim();
  if (NAMED_COLORS.has(trimmed) || isHexColor(trimmed)) return trimmed;
  return 'coral';
}

export function getCourseColorStyle(color: string): Record<string, string> {
  const normalized = normalizeCourseColor(color);
  if (!isHexColor(normalized)) return {};

  return {
    '--c-bg': mix(normalized, '#ffffff', 0.72),
    '--c-icon': normalized,
    '--c-badge': normalized,
    '--c-border': mix(normalized, '#000000', 0.34),
  };
}

export function getCourseTagStyle(color: string): Record<string, string> {
  const normalized = normalizeCourseColor(color);
  if (!isHexColor(normalized)) return {};

  return {
    background: mix(normalized, '#ffffff', 0.72),
    color: mix(normalized, '#000000', 0.32),
    borderColor: mix(normalized, '#000000', 0.22),
  };
}
