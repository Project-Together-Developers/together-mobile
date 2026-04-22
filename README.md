# Together Mobile

React Native + Expo app for Together — social outdoor activity platform.

## Tech Stack

- **Framework**: Expo SDK 51 + React Native 0.74
- **Language**: TypeScript (strict)
- **Navigation**: React Navigation v6 (bottom tabs + native stack)
- **State**: Zustand + AsyncStorage persistence
- **HTTP**: Axios with JWT interceptor (auto-refresh on 401)
- **i18n**: react-i18next (EN / RU / UZ)
- **Fonts**: Plus Jakarta Sans (via expo-google-fonts)
- **Theme**: Dark (#111118 bg, #C17B3F accent)

## Setup

```bash
# Install dependencies
npm install   # or: npx expo install

# Copy env
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend URL

# Start dev server
npx expo start
```

## Folder Structure

```
src/
├── api/          # Axios instance + interceptors
├── i18n/         # i18next config + locale JSONs (en/ru/uz)
├── navigation/   # Root navigator, bottom tabs, stack types
├── screens/      # Placeholder screens per tab
├── store/        # Zustand auth store
└── theme/        # Colors, typography, spacing, borderRadius
```

## Tabs

| Tab | Screen | Status |
|-----|--------|--------|
| Events | EventsScreen | Placeholder |
| Map | MapScreen | Placeholder |
| Create | CreateEventScreen | Placeholder |
| Chat | ChatScreen | Placeholder |
| Profile | ProfileScreen | Placeholder |
