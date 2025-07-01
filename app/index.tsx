import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useColorScheme } from '~/lib/useColorScheme';
import { initializeDatabase } from '../lib/database';

export default function Index() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    hasCompletedOnboarding: boolean | null;
    userType: 'professor' | 'coordenador' | null;
  }>({ 
    isAuthenticated: null, 
    hasCompletedOnboarding: null,
    userType: null
  });

  const { colors } = useColorScheme();

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        // Initialize database first
        await initializeDatabase();

        const [token, onboardingCompleted] = await Promise.all([
          AsyncStorage.getItem("authToken"),
          AsyncStorage.getItem("onboardingCompleted")
        ]);

        // Determine user type from token
        let userType: 'professor' | 'coordenador' | null = null;
        if (token) {
          if (token.startsWith('professor-')) {
            userType = 'professor';
          } else if (token.startsWith('coordinator-')) {
            userType = 'coordenador';
          }
        }

        setAuthState({
          isAuthenticated: !!token,
          hasCompletedOnboarding: onboardingCompleted === "true",
          userType
        });
      } catch (error) {
        console.error("Error checking auth state:", error);
        setAuthState({
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          userType: null
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

  // If authenticated, redirect based on user type
  if (authState.isAuthenticated && authState.userType) {
    if (authState.userType === 'coordenador') {
      return <Redirect href="/(coordinator)/dashboard" />;
    } else {
      return <Redirect href="/(tabs)/home" />;
    }
  }

  // Not authenticated, go to login
  return <Redirect href="/(auth)/login" />;
}