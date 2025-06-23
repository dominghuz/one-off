import React, {useState} from 'react';

import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';

export default function ConfigScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const ConfigItem = ({ icon, title, subtitle, action, isSwitch = false, value = false, onValueChange = () => {} }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-4 px-5 border-b border-gray-100"
      onPress={!isSwitch ? action : null}
    >
      <View className="flex-row items-center">
        <View className="mr-4 p-2 rounded-full bg-gray-100">
          {icon}
        </View>
        <View>
          <Text className="text-base font-semibold text-gray-800">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
        </View>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#E5E7EB", true: "#10B981" }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-6 pb-4 px-5 bg-white">
        <Text className="text-2xl font-bold text-gray-800">Configurações</Text>
        <Text className="text-gray-500 mt-1">Gerencie suas preferências e conta</Text>
      </View>

      {/* Seção de Conta */}
      <View className="mt-6 bg-white">
        <Text className="px-5 py-3 text-sm font-medium text-gray-500">CONTA</Text>
        <ConfigItem
          icon={<Feather name="user" size={20} color="#10B981" />}
          title="Perfil"
          subtitle="Altere seus dados pessoais"
          action={() => console.log("Editar perfil")}
        />
        <ConfigItem
          icon={<Ionicons name="key" size={20} color="#10B981" />}
          title="Segurança"
          subtitle="Senha e autenticação"
          action={() => console.log("Configurar segurança")}
        />
        <ConfigItem
          icon={<FontAwesome name="bank" size={20} color="#10B981" />}
          title="Dados Bancários"
          subtitle="Atualize sua conta para pagamentos"
          action={() => console.log("Configurar dados bancários")}
        />
      </View>

      {/* Seção de Preferências */}
      <View className="mt-6 bg-white">
        <Text className="px-5 py-3 text-sm font-medium text-gray-500">PREFERÊNCIAS</Text>
        <ConfigItem
          icon={<Ionicons name="notifications" size={20} color="#10B981" />}
          title="Notificações"
          isSwitch={true}
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <ConfigItem
          icon={<Ionicons name="moon" size={20} color="#10B981" />}
          title="Modo Escuro"
          isSwitch={true}
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
        <ConfigItem
          icon={<MaterialIcons name="fingerprint" size={20} color="#10B981" />}
          title="Login Biométrico"
          isSwitch={true}
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
        />
      </View>

      {/* Seção de Ajuda */}
      <View className="mt-6 bg-white">
        <Text className="px-5 py-3 text-sm font-medium text-gray-500">AJUDA</Text>
        <ConfigItem
          icon={<Feather name="help-circle" size={20} color="#10B981" />}
          title="Central de Ajuda"
          action={() => console.log("Abrir ajuda")}
        />
        <ConfigItem
          icon={<MaterialIcons name="privacy-tip" size={20} color="#10B981" />}
          title="Termos e Privacidade"
          action={() => console.log("Ver termos")}
        />
        <ConfigItem
          icon={<Feather name="info" size={20} color="#10B981" />}
          title="Sobre o Aplicativo"
          subtitle={`Versão 1.0.0`}
          action={() => console.log("Ver sobre")}
        />
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity 
        className="flex-row items-center justify-center py-4 mx-5 my-6 bg-red-50 rounded-lg"
        onPress={signOut}
      >
        <MaterialIcons name="logout" size={20} color="#EF4444" />
        <Text className="ml-2 text-red-500 font-semibold">Sair da Conta</Text>
      </TouchableOpacity>

      {/* Rodapé */}
      <View className="items-center pb-6">
        <Text className="text-sm text-gray-400">Sistema Acadêmico</Text>
        <Text className="text-xs text-gray-400 mt-1">© 2025 Todos os direitos reservados</Text>
      </View>
    </ScrollView>
  );
}