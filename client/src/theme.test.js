import { colorTokens, themeSettings } from './theme';

// Grouping tests for colorTokens
describe('colorTokens', () => {
  it('should contain correct grey scale values', () => {
    expect(colorTokens.grey[0]).toBe('#FFFFFF');
    expect(colorTokens.grey[1000]).toBe('#000000');
  });

  it('should contain correct primary color values', () => {
    expect(colorTokens.primary[50]).toBe('#E6FBFF');
    expect(colorTokens.primary[900]).toBe('#001519');
  });
});

// Grouping tests for themeSettings
describe('themeSettings', () => {
  it('should return correct dark mode settings', () => {
    const darkTheme = themeSettings('dark');

    // Check palette
    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.primary).toEqual({
      dark: colorTokens.primary[200],
      main: colorTokens.primary[500],
      light: colorTokens.primary[800],
    });
    expect(darkTheme.palette.neutral).toEqual({
      dark: colorTokens.grey[100],
      main: colorTokens.grey[200],
      mediumMain: colorTokens.grey[300],
      medium: colorTokens.grey[400],
      light: colorTokens.grey[700],
    });
    expect(darkTheme.palette.background).toEqual({
      default: colorTokens.grey[900],
      alt: colorTokens.grey[800],
    });

    // Check typography
    expect(darkTheme.typography.fontFamily).toBe('Rubik,sans-serif');
    expect(darkTheme.typography.fontSize).toBe(12);
    expect(darkTheme.typography.h1.fontSize).toBe(40);
  });

  it('should return correct light mode settings', () => {
    const lightTheme = themeSettings('light');

    // Check palette
    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.primary).toEqual({
      dark: colorTokens.primary[700],
      main: colorTokens.primary[500],
      light: colorTokens.primary[50],
    });
    expect(lightTheme.palette.neutral).toEqual({
      dark: colorTokens.grey[700],
      main: colorTokens.grey[500],
      mediumMain: colorTokens.grey[400],
      medium: colorTokens.grey[300],
      light: colorTokens.grey[50],
    });
    expect(lightTheme.palette.background).toEqual({
      default: colorTokens.grey[10],
      alt: colorTokens.grey[0],
    });

    // Check typography
    expect(lightTheme.typography.fontFamily).toBe('Rubik,sans-serif');
    expect(lightTheme.typography.h1.fontSize).toBe(40);
  });

  // it('should handle invalid mode gracefully', () => {
  //   const invalidTheme = themeSettings('invalid-mode');

  //   // Defaults to light mode
  //   expect(invalidTheme.palette.mode).toBe('light');
  //   expect(invalidTheme.palette.background.default).toBe(colorTokens.grey[10]);
  // });
});
