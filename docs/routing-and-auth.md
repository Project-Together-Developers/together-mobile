# Routing & Auth

- **Library**: React Navigation (`@react-navigation/native`).
- **Types**: Strict in `src/navigation/types.ts` (`RootStackParamList`, etc.).
- **Flows**:
  - `Splash`
  - `Auth` (Login, VerifyOtp)
  - `Onboarding`
  - `Main` (Tabs: Events, Map, CreateEvent, Chat, Profile)
- **Auth Guard**: Switch stacks based on `useAuthStore` state (`isAuthenticated`, `user`).
- **Rule**: Pass minimal data in route params (e.g. `eventId`, not whole object).
