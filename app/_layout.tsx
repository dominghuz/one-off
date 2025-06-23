import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Autenticação */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* Tabs (Home, Profile, etc) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
