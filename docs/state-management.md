# State Management

- **Library**: Zustand (`zustand`).
- **Location**: `src/store/` (e.g. `auth.ts`).
- **Storage**: Persistent keys via `expo-secure-store`.
- **Access**: Export custom hooks like `useAuthStore`.
- **Rule**: Minimal global state. Use local component state when possible. Split stores by domain.
