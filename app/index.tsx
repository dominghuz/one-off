import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useColorScheme } from '~/lib/useColorScheme';

export default function Index() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    hasCompletedOnboarding: boolean | null;
  }>({ 
    isAuthenticated: null, 
    hasCompletedOnboarding: null 
  });

  const { colors } = useColorScheme();

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const [token, onboardingCompleted] = await Promise.all([
          AsyncStorage.getItem("authToken"),
          AsyncStorage.getItem("onboardingCompleted")
        ]);

        setAuthState({
          isAuthenticated: !!token,
          hasCompletedOnboarding: onboardingCompleted === "true"
        });
      } catch (error) {
        console.error("Error checking auth state:", error);
        setAuthState({
          isAuthenticated: false,
          hasCompletedOnboarding: false
        });
      }
    };

    checkInitialState();
  }, []);

  if (authState.isAuthenticated === null || authState.hasCompletedOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Fluxo de navegação inicial
  if (!authState.hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // Rota para demonstração de componentes (apenas em desenvolvimento)
  // if (__DEV__ && authState.isAuthenticated) {
  //   return <Redirect href="/components-demo" />;
  // }

  return (
    <Redirect href={authState.isAuthenticated ? '/(tabs)/home' : '/(auth)/login' as const} />
  );
}