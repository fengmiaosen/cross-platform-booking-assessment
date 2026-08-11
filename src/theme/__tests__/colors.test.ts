import { colors } from '../colors';

type ColorPair = {
  name: string;
  foreground: string;
  background: string;
};

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));

  return (lighter + 0.05) / (darker + 0.05);
}

function getFailingPairs(pairs: ColorPair[], minimumRatio: number) {
  return pairs
    .map((pair) => ({ ...pair, ratio: contrastRatio(pair.foreground, pair.background) }))
    .filter((pair) => pair.ratio < minimumRatio)
    .map((pair) => `${pair.name}: ${pair.ratio.toFixed(2)}:1`);
}

describe('theme color contrast', () => {
  it('keeps normal text combinations at or above 4.5:1', () => {
    const textPairs: ColorPair[] = [
      { name: 'primary text on page', foreground: colors.text, background: colors.background },
      { name: 'primary text on surface', foreground: colors.text, background: colors.surface },
      {
        name: 'muted text on page',
        foreground: colors.textMuted,
        background: colors.background,
      },
      {
        name: 'muted text on surface',
        foreground: colors.textMuted,
        background: colors.surface,
      },
      { name: 'button text', foreground: colors.surface, background: colors.primary },
      {
        name: 'pressed button text',
        foreground: colors.surface,
        background: colors.primaryPressed,
      },
      { name: 'selected text', foreground: colors.primary, background: colors.surfaceSelected },
      {
        name: 'pressed outline text',
        foreground: colors.primary,
        background: colors.surfacePressed,
      },
      { name: 'success badge', foreground: colors.success, background: colors.successSurface },
      { name: 'danger badge', foreground: colors.danger, background: colors.dangerSurface },
      { name: 'disabled button', foreground: colors.textMuted, background: colors.border },
    ];

    expect(getFailingPairs(textPairs, 4.5)).toEqual([]);
  });

  it('keeps interactive boundaries at or above 3:1', () => {
    const controlPairs: ColorPair[] = [
      {
        name: 'control border on surface',
        foreground: colors.borderStrong,
        background: colors.surface,
      },
      {
        name: 'control border on page',
        foreground: colors.borderStrong,
        background: colors.background,
      },
      { name: 'selected border', foreground: colors.primary, background: colors.surfaceSelected },
    ];

    expect(getFailingPairs(controlPairs, 3)).toEqual([]);
  });
});
