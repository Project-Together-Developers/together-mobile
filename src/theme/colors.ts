export const Colors = {
  background: '#111118',
  card: '#1C1C24',
  input: '#25252E',
  accent: '#C17B3F',
  accentLight: '#D9956A',
  text: '#F0EFE9',
  textSecondary: '#9B9A96',
  textMuted: '#5C5B58',
  border: '#2A2A35',
  success: '#4CAF84',
  error: '#E05555',
  warning: '#E8A438',
  tabBar: '#16161F',
  tabBarBorder: '#22222C',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type ColorKey = keyof typeof Colors;
