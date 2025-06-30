import { Link, Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View className="flex-1 items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        {/* Animação Lottie */}
        <LottieView
          source={require('~/assets/animations/not-found.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        
        <Text className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Oops! Página não encontrada
        </Text>
        
        <Text className="text-base text-center mb-6 text-gray-600 dark:text-gray-300">
          A página que você está tentando acessar não existe ou foi movida.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Voltar ao início</Text>
          </TouchableOpacity>
        </Link>

        <Text className="text-sm mt-8 text-gray-500 dark:text-gray-400">
          Código de erro: 404
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});