import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { useAuth } from "../contexts/AuthContext";
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { ActivityIndicator, View } from 'react-native';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { user } = useAuth();
  const isLoading = false; // Replace with actual loading logic if available

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <Stack screenOptions={{ 
                headerShown: false,
                animation: 'ios_from_right' // for android
              }}>
                {/* Rotas públicas */}
                <Stack.Screen name="/onboarding" />
                <Stack.Screen name="(auth)" />
                
                {/* Rotas protegidas */}
                {user && (
                  <>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen 
                      name="modal" 
                      options={{ 
                        presentation: 'modal',
                        animation: 'fade_from_bottom'
                      }} 
                    />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="reports" />
                  </>
                )}
              </Stack>
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}