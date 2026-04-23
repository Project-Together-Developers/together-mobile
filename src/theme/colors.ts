export const darkColors = {
  primary: "#ee6438",
  background: "#111118",
  card: "#1C1C24",
  input: "#25252e",
  accent: "#C17B3F",
  accentLight: "#D9956A",
  text: "#F0EFE9",
  textSecondary: "#9B9A96",
  textMuted: "#5C5B58",
  border: "#ffffff0f",
  success: "#4CAF84",
  error: "#E05555",
  warning: "#E8A438",
  tabBar: "#16161F",
  tabBarBorder: "#22222C",
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0,0,0,0.6)",
} as const;

export const lightColors = {
  primary: "#ee6438",
  background: "#f7f6f2",
  card: "#FFFFFF",
  input: "#eeeee8",
  accent: "#C17B3F",
  accentLight: "#D9956A",
  text: "#1A1C21",
  textSecondary: "#5D6472",
  textMuted: "#8F96A3",
  border: "#00000012",
  success: "#2E8B68",
  error: "#D94A4A",
  warning: "#D68B20",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E2E6EE",
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0,0,0,0.35)",
} as const;

export type ThemeMode = "dark" | "light";
export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  input: string;
  accent: string;
  accentLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  tabBar: string;
  tabBarBorder: string;
  white: string;
  black: string;
  overlay: string;
}
export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};

export const Colors = darkColors;
export type ColorKey = keyof ThemeColors;
