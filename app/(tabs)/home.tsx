import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useScan } from '../../hooks/useScan';

// Componentes reutilizáveis
type UserHeaderProps = {
  user: any;
  onSignOut: () => void;
};

const UserHeader = ({ user, onSignOut }: UserHeaderProps) => (
  <View className="mb-8 flex-row items-center justify-between">
    <View className="flex-row items-center">
      <Image
        source={{ uri: user?.avatar || 'https://github.com/dominghuz.png' }}
        className="h-12 w-12 rounded-full border-2 border-green-500"
      />
      <View className="ml-3">
        <Text className="text-lg font-bold" numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: Dimensions.get('window').width * 0.5 }}>
          {user?.name || 'Professor'}
        </Text>
        <Text className="text-sm text-gray-500">
          {user?.degree} • {user?.modules?.length || 0} módulos
        </Text>
      </View>
    </View>
    <TouchableOpacity onPress={onSignOut} className="p-2">
      <Text className="text-red-500">Sair</Text>
    </TouchableOpacity>
  </View>
);

type StatusCardProps = {
  user: {
    todayModules?: number;
    confirmedPresences?: number;
    currentSalary?: number;
  };
};

const StatusCard = ({ user }: StatusCardProps) => (
  <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
    <Text className="mb-2 text-lg font-bold">Status do Dia</Text>
    <View className="flex-row justify-between">
      {[
        { label: 'Módulos', value: `${user?.todayModules || 0}/3` },
        { label: 'Presenças', value: user?.confirmedPresences || 0 },
        { label: 'Salário', value: `${user?.currentSalary?.toLocaleString('pt-AO') || 0} KZ` }
      ].map((item, index) => (
        <View key={index} className="items-center px-2">
          <Text className="text-gray-500">{item.label}</Text>
          <Text className="font-bold">{item.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ScannerFrame = () => {
  const scannerSize = Dimensions.get('window').width * 0.7;
  
  return (
    <View className="relative mb-8 items-center justify-center">
      <View 
        className="items-center justify-center rounded-lg border-4 border-green-500 bg-gray-100"
        style={{ height: scannerSize, width: scannerSize }}
      >
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png',
          }}
          style={{ width: scannerSize * 0.6, height: scannerSize * 0.6, opacity: 0.3 }}
        />
      </View>
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
        <View
          key={position}
          className={`absolute h-12 w-12 border-green-500 ${
            position === 'top-left' ? 'left-0 top-0 rounded-tl-lg border-l-2 border-t-2' :
            position === 'top-right' ? 'right-0 top-0 rounded-tr-lg border-r-2 border-t-2' :
            position === 'bottom-left' ? 'left-0 bottom-0 rounded-bl-lg border-b-2 border-l-2' :
            'right-0 bottom-0 rounded-br-lg border-b-2 border-r-2'
          }`}
        />
      ))}
    </View>
  );
};

type ConfirmationModalProps = {
  scanResult: { module: string; time: string };
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({ scanResult, onConfirm, onCancel }: ConfirmationModalProps) => (
  <View className="w-full items-center rounded-xl bg-white p-6">
    <Text className="mb-2 text-lg font-bold">Confirmação de Presença</Text>
    <Text className="mb-4 text-center">
      Módulo: {scanResult.module} - {scanResult.time}
    </Text>
    <TouchableOpacity
      onPress={onConfirm}
      className="mb-2 w-full rounded-lg bg-green-500 py-3"
    >
      <Text className="text-center font-bold text-white">Confirmar Presença</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onCancel}
      className="w-full rounded-lg border border-gray-300 py-3"
    >
      <Text className="text-center text-gray-700">Cancelar</Text>
    </TouchableOpacity>
  </View>
);

// Componente principal
export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const {
    isScanning,
    scanResult,
    setScanResult,
    handleScanPress,
    handleConfirmPresence,
    scanError,
    setScanError
  } = useScan();

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-gray-50 p-6">
        <UserHeader user={user} onSignOut={signOut} />
        <StatusCard user={user} />

        {/* Área principal de scan */}
        <View className="flex-1 items-center justify-center">
          {isScanning ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="mt-4 text-gray-700">Aproxime o QR Code da câmera</Text>
            </View>
          ) : scanResult ? (
            <ConfirmationModal 
              scanResult={scanResult}
              onConfirm={handleConfirmPresence}
              onCancel={() => setScanResult(null)}
            />
          ) : (
            <>
              <View className="mb-8 items-center">
                <Text className="mb-2 text-xl font-bold">Registo de Presença</Text>
                <Text className="px-8 text-center text-gray-500">
                  Escaneie o QR Code disponível na sala de aula para registar sua presença no módulo atual.
                </Text>
              </View>

              <ScannerFrame />

              <TouchableOpacity
                onPress={handleScanPress}
                className="w-full rounded-lg bg-green-500 py-4 shadow-md"
              >
                <Text className="text-center text-lg font-bold text-white">Iniciar Escaneamento</Text>
              </TouchableOpacity>
            </>
          )}

          {scanError && (
            <View className="mt-4 w-full rounded-lg bg-red-100 p-3">
              <Text className="text-center text-red-700">{scanError}</Text>
            </View>
          )}
        </View>

        {/* Rodapé */}
        <View className="border-t border-gray-200 pt-4">
          <Text className="text-center text-xs text-gray-500">
            Sistema de Gestão Acadêmica • {new Date().toLocaleDateString('pt-AO')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}