import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { IUser } from "../interfaces/user";

export type User = IUser;

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: IUser) => Promise<void>;
  updateUser: (partial: Partial<IUser>) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const KEYS = {
  ACCESS_TOKEN: "together_access_token",
  REFRESH_TOKEN: "together_refresh_token",
  USER: "together_user",
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: async (user) => {
    await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
    set({ user });
  },

  updateUser: async (partial) => {
    const current = get().user;
    if (!current) return;
    const next: IUser = { ...current, ...partial };
    await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(next));
    set({ user: next });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: async () => {
    try {
      const [accessToken, refreshToken, userStr] = await Promise.all([
        SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(KEYS.USER),
      ]);
      const user = userStr ? (JSON.parse(userStr) as IUser) : null;
      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
