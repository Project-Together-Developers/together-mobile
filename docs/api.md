# API & Network

- **Client**: Axios (`src/api/axios.ts`).
- **Base URL**: `EXPO_PUBLIC_API_URL` (fallback `http://localhost:3000/api/v1`).
- **Headers**: Auto-adds `Bearer <token>` via interceptor.
- **Refresh Flow**: 401 triggers token refresh (`/auth/refresh`). Queues pending requests.
- **Storage**: Tokens in `expo-secure-store`.
- **Modules**: API functions in `src/api/` (`auth.ts`, `users.ts`).
- **Rule**: Keep payload types synced with backend.
