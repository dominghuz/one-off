import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [degree, setDegree] = useState('Licenciado');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      // Simulação de registro - substitua pela chamada real à sua API
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      // Navegação para login seria feita aqui após registro bem-sucedido
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50">
      <Text className="text-2xl font-bold mb-8 text-center text-green-600">Criar nova conta</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Nome completo</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-lg bg-white"
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
        />
      </View>

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

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Senha</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-lg bg-white"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Confirmar senha</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded-lg bg-white"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Grau acadêmico</Text>
        <View className="flex-row justify-between">
          {['Licenciado', 'Mestre', 'Doutor'].map((item) => (
            <TouchableOpacity
              key={item}
              className={`p-2 border rounded-lg ${degree === item ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              onPress={() => setDegree(item)}
            >
              <Text className={degree === item ? 'text-green-600 font-medium' : 'text-gray-600'}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        className="bg-green-500 p-3 rounded-lg items-center mb-4"
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Cadastrar</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Já tem uma conta? </Text>
        <Link href="/login" className="text-green-600 font-medium">
          Faça login
        </Link>
      </View>
    </View>
  );
}