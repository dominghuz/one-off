import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ProfileCard = ({ icon, title, value }) => (
  <View className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
    <View className="mr-4 p-3 bg-green-100 rounded-full">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 text-sm">{title}</Text>
      <Text className="text-lg font-semibold text-gray-800">{value}</Text>
    </View>
  </View>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header com foto e nome */}
        <View className="items-center mb-8">
          <View className="relative mb-4">
            <Image
              source={{ uri: user?.avatar || 'https://github.com/dominghuz.png' }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-green-500 p-3 rounded-full">
              <MaterialIcons name="edit" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-gray-800">{user?.name || 'Professor'}</Text>
          <Text className="text-gray-500">{user?.degree || 'Doutor'}</Text>
        </View>

        {/* Estatísticas */}
        <View className="flex-row justify-between mb-8">
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{user?.confirmedPresences || 0}</Text>
            <Text className="text-gray-500">Presenças</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{user?.modules?.length || 0}</Text>
            <Text className="text-gray-500">Módulos</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {user?.currentSalary?.toLocaleString('pt-AO') || '0'} KZ
            </Text>
            <Text className="text-gray-500">Salário</Text>
          </View>
        </View>

        {/* Informações do perfil */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Informações Pessoais</Text>
          
          <ProfileCard
            icon={<MaterialIcons name="email" size={24} color="#10B981" />}
            title="Email"
            value={user?.email || 'domingos@example.com'}
          />
          
          <ProfileCard
            icon={<FontAwesome5 name="graduation-cap" size={24} color="#10B981" />}
            title="Grau Acadêmico"
            value={user?.degree || 'Doutor'}
          />
          
          <ProfileCard
            icon={<MaterialIcons name="date-range" size={24} color="#10B981" />}
            title="Membro desde"
            value={new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-AO')}
          />
        </View>

        {/* Configurações */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Configurações</Text>
          
          <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
            <View className="mr-4 p-3 bg-blue-100 rounded-full">
              <MaterialIcons name="notifications" size={24} color="#3B82F6" />
            </View>
            <Text className="flex-1 text-lg font-semibold text-gray-800">Notificações</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
            <View className="mr-4 p-3 bg-purple-100 rounded-full">
              <MaterialIcons name="security" size={24} color="#8B5CF6" />
            </View>
            <Text className="flex-1 text-lg font-semibold text-gray-800">Privacidade</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={signOut}
          className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl"
        >
          <MaterialIcons name="logout" size={24} color="#EF4444" />
          <Text className="ml-3 text-lg font-semibold text-red-500">Terminar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}