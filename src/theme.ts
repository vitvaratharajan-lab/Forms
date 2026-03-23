/**
 * Views theme
 * https://www.figma.com/design/Mj7tH0YmpDD3ZDRRdI2JZo/Views?node-id=1-29539
 */
export const theme = {
  colors: {
    // Sidebar – Views light nav
    sidebarBg: '#ffffff',
    sidebarText: '#16181d',
    sidebarTextMuted: '#4c5561',
    sidebarHover: '#f1f3f5',
    sidebarActive: '#e8f2ff',
    sidebarActiveText: '#0d62d9',
    sidebarBorder: '#e5e8ec',

    // Surface
    surface: '#ffffff',
    surfaceRaised: '#f8f9fb',
    surfaceOverlay: '#f1f3f5',

    // Text
    text: '#16181d',
    textSecondary: '#374151',
    textMuted: '#4b5563',

    // Borders
    border: '#e5e8ec',
    borderStrong: '#d1d8e0',
    borderLight: '#eef0f2',

    // Primary
    primary: '#0d62d9',
    primaryHover: '#0b53b8',
    primaryMuted: '#e8f2ff',

    // Status
    success: '#166534',
    successBg: '#dcfce7',
    warning: '#b45309',
    warningBg: '#fef3c7',
    error: '#b91c1c',
    errorBg: '#fee2e2',
    info: '#0d62d9',
    infoBg: '#e8f2ff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      md: '16px',
      lg: '17px',
      xl: '20px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.06)',
    md: '0 1px 3px rgba(0,0,0,0.06)',
    lg: '0 4px 12px rgba(0,0,0,0.08)',
  },
} as const;
