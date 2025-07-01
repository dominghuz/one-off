import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateUser } from '../../../lib/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const user = await authenticateUser(email.trim(), password);
      
      if (user) {
        // Mark onboarding as completed
        await AsyncStorage.setItem('onboardingCompleted', 'true');
        
        // Determine user type and redirect accordingly
        const token = await AsyncStorage.getItem('authToken');
        if (token?.startsWith('coordinator-')) {
          router.replace('/(coordinator)/dashboard');
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userType: 'professor' | 'coordinator') => {
    if (userType === 'professor') {
      setEmail('joao@ispozango.ao');
      setPassword('123456');
    } else {
      setEmail('coordenador@ispozango.ao');
      setPassword('coord123');
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="rounded-full bg-green-100 p-4 mb-4">
              <Ionicons name="school" size={48} color="#10B981" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo
            </Text>
            <Text className="text-gray-600 text-center">
              Sistema de Gestão Acadêmica
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4 mb-6">
            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <View className="flex-row items-center bg-white rounded-lg border border-gray-300 px-3 py-3">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="seu.email@ispozango.ao"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Senha
              </Text>
              <View className="flex-row items-center bg-white rounded-lg border border-gray-300 px-3 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Sua senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-lg py-4 mb-4 ${loading ? 'bg-gray-400' : 'bg-green-500'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Login Section */}
          <View className="border-t border-gray-200 pt-6">
            <Text className="text-sm font-medium text-gray-700 text-center mb-4">
              Acesso Rápido para Demonstração
            </Text>
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => quickLogin('professor')}
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-100 p-3"
              >
                <View className="items-center">
                  <Ionicons name="person" size={24} color="#3B82F6" />
                  <Text className="text-blue-700 font-medium mt-1">Professor</Text>
                  <Text className="text-blue-600 text-xs mt-1">João Silva</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => quickLogin('coordinator')}
                disabled={loading}
                className="flex-1 rounded-lg bg-purple-100 p-3"
              >
                <View className="items-center">
                  <Ionicons name="settings" size={24} color="#8B5CF6" />
                  <Text className="text-purple-700 font-medium mt-1">Coordenador</Text>
                  <Text className="text-purple-600 text-xs mt-1">Dr. António</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Credentials Info */}
          <View className="mt-6 rounded-lg bg-blue-50 p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-blue-900 mb-1">
                  Credenciais de Demonstração
                </Text>
                <Text className="text-xs text-blue-700 leading-4">
                  <Text className="font-medium">Professor:</Text> joao@ispozango.ao / 123456{'\n'}
                  <Text className="font-medium">Coordenador:</Text> coordenador@ispozango.ao / coord123
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <Text className="text-center text-xs text-gray-500">
              Sistema de Gestão Acadêmica v2.0
            </Text>
            <Text className="text-center text-xs text-gray-400 mt-1">
              ISPOZANGO - {new Date().getFullYear()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

