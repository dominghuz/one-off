import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { Link, useRouter } from 'expo-router'; // ✅ Importar useRouter

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter(); // ✅ Inicializar o hook

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // Simulação de login - substitua pela chamada real à sua API
      await login('fake-token', { 
        name: 'Professor', 
        degree: 'Doutor',
        avatar: '',
        modules: [],
        todayModules: 0,
        confirmedPresences: 0,
        currentSalary: 0
      });

      router.push('/(tabs)/home'); // ✅ Redireciona após login com sucesso

    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50">
      <Text className="text-2xl font-bold mb-8 text-center text-green-600">Acesse sua conta</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-lg bg-white"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Senha</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-lg bg-white"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-green-500 p-3 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Entrar</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Não tem uma conta? </Text>
        <Link href="/register" className="text-green-600 font-medium">
          Cadastre-se
        </Link>
      </View>
    </View>
  );
}
