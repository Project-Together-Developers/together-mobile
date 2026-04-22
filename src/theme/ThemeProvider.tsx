import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeColors, ThemeMode, themeColors } from "./colors";
import * as SecureStore from "expo-secure-store";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const mode = (SecureStore.getItem("theme") ?? "light") as ThemeMode;
    return mode;
  });

  const toggleTheme = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    SecureStore.setItem("theme", nextMode);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: themeColors[mode],
      isDark: mode === "dark",
      toggleTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
}
