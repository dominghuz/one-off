import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import QRCode from 'react-native-qrcode-svg';
import { useCoordinator } from '../../hooks/useCoordinator';

// QR Code Card Component
function QRCodeCard({ 
  qrCodeSession, 
  moduleName, 
  onShare 
}: { 
  qrCodeSession: any;
  moduleName: string;
  onShare: (qrCodeData: string, moduleName: string, date: string) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = new Date(qrCodeSession.expiresAt) < new Date();

  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {moduleName}
          </Text>
          <Text className="text-gray-600 mb-2">
            {formatDate(qrCodeSession.date)}
          </Text>
          <View className="flex-row items-center">
            <Ionicons 
              name={isExpired ? 'time-outline' : 'checkmark-circle'} 
              size={16} 
              color={isExpired ? '#EF4444' : '#10B981'} 
            />
            <Text 
              className={`text-sm ml-1 ${isExpired ? 'text-red-600' : 'text-green-600'}`}
            >
              {isExpired ? 'Expirado' : 'Ativo'}
            </Text>
          </View>
        </View>
        
        {/* QR Code */}
        <View className="items-center">
          <View className="bg-white p-2 rounded-lg border border-gray-200">
            <QRCode
              value={qrCodeSession.qrCodeData}
              size={80}
              backgroundColor="white"
              color="black"
            />
          </View>
          <TouchableOpacity
            onPress={() => onShare(qrCodeSession.qrCodeData, moduleName, qrCodeSession.date)}
            className="mt-2 rounded-lg bg-blue-100 px-3 py-1"
          >
            <Text className="text-blue-600 text-xs font-medium">Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details */}
      <View className="border-t border-gray-100 pt-3">
        <Text className="text-xs text-gray-500">
          ID da Sessão: {qrCodeSession.id}
        </Text>
        <Text className="text-xs text-gray-500">
          Expira em: {new Date(qrCodeSession.expiresAt).toLocaleString('pt-AO')}
        </Text>
      </View>
    </View>
  );
}

// Generate QR Code Modal Component
function GenerateQRCodeModal({
  visible,
  onClose,
  onSubmit,
  loading,
  modules,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (moduleId: number, date: string) => Promise<void>;
  loading: boolean;
  modules: any[];
}) {
  const [formData, setFormData] = useState({
    moduleId: '',
    date: '',
  });

  const resetForm = () => {
    setFormData({
      moduleId: '',
      date: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!formData.moduleId) {
        Alert.alert('Erro', 'Módulo é obrigatório');
        return;
      }
      if (!formData.date) {
        Alert.alert('Erro', 'Data é obrigatória');
        return;
      }

      await onSubmit(Number(formData.moduleId), formData.date);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao gerar QR Code');
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-blue-600 text-lg">Cancelar</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Gerar QR Code</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Text className="text-purple-600 text-lg font-semibold">Gerar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            {/* Module */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Módulo *
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white">
                <Picker
                  selectedValue={formData.moduleId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, moduleId: value }))}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecione um módulo" value="" />
                  {modules.map((module) => (
                    <Picker.Item
                      key={module.id}
                      label={module.name}
                      value={module.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Data da Aula *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                editable={!loading}
              />
              <Text className="text-xs text-gray-500 mt-1">
                Formato: YYYY-MM-DD (ex: {today})
              </Text>
            </View>

            {/* Info */}
            <View className="rounded-lg bg-blue-50 p-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-medium text-blue-900 mb-1">
                    Informações Importantes
                  </Text>
                  <Text className="text-xs text-blue-700 leading-4">
                    • O QR Code será válido por 1 hora após a geração{'\n'}
                    • Certifique-se de que a data corresponde ao dia da semana do módulo{'\n'}
                    • Professores podem escanear o QR Code para registrar presença{'\n'}
                    • Você pode compartilhar o QR Code após a geração
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Bulk Generate Modal Component
function BulkGenerateModal({
  visible,
  onClose,
  onSubmit,
  loading,
  modules,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (moduleIds: number[], dates: string[]) => Promise<void>;
  loading: boolean;
  modules: any[];
}) {
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const resetForm = () => {
    setSelectedModules([]);
    setStartDate('');
    setEndDate('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleModule = (moduleId: number) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const generateDateRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const handleSubmit = async () => {
    try {
      if (selectedModules.length === 0) {
        Alert.alert('Erro', 'Selecione pelo menos um módulo');
        return;
      }
      if (!startDate || !endDate) {
        Alert.alert('Erro', 'Data de início e fim são obrigatórias');
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        Alert.alert('Erro', 'Data de início deve ser anterior à data de fim');
        return;
      }

      const dates = generateDateRange(startDate, endDate);
      await onSubmit(selectedModules, dates);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao gerar QR Codes');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-blue-600 text-lg">Cancelar</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Geração em Lote</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Text className="text-purple-600 text-lg font-semibold">Gerar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            {/* Modules Selection */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Módulos * ({selectedModules.length} selecionados)
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white p-3">
                {modules.map((module) => (
                  <TouchableOpacity
                    key={module.id}
                    onPress={() => toggleModule(module.id)}
                    className="flex-row items-center py-2"
                  >
                    <Ionicons
                      name={selectedModules.includes(module.id) ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={selectedModules.includes(module.id) ? '#8B5CF6' : '#6B7280'}
                    />
                    <Text className="flex-1 ml-3 text-gray-900">
                      {module.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </Text>
                <TextInput
                  className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  placeholder={today}
                  value={startDate}
                  onChangeText={setStartDate}
                  editable={!loading}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Data de Fim *
                </Text>
                <TextInput
                  className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  placeholder={today}
                  value={endDate}
                  onChangeText={setEndDate}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Preview */}
            {selectedModules.length > 0 && startDate && endDate && (
              <View className="rounded-lg bg-purple-50 p-4">
                <Text className="text-sm font-medium text-purple-900 mb-2">
                  Prévia da Geração
                </Text>
                <Text className="text-xs text-purple-700">
                  {selectedModules.length} módulo{selectedModules.length !== 1 ? 's' : ''} × {
                    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                  } dia{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) !== 0 ? 's' : ''} = {
                    selectedModules.length * (Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
                  } QR Code{selectedModules.length * (Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Main QR Codes Screen
export default function QRCodesScreen() {
  const {
    modules,
    qrCodeSessions,
    loading,
    error,
    generateQRCode,
    generateBulkQRCodes,
    clearError,
    getModuleById,
  } = useCoordinator();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter QR code sessions based on search query
  const filteredQRCodes = qrCodeSessions.filter(session => {
    const module = getModuleById(session.moduleId);
    return (
      module?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.date.includes(searchQuery)
    );
  });

  const handleGenerateQRCode = async (moduleId: number, date: string) => {
    await generateQRCode(moduleId, date);
  };

  const handleBulkGenerate = async (moduleIds: number[], dates: string[]) => {
    const result = await generateBulkQRCodes(moduleIds, dates);
    if (result.errors.length > 0) {
      Alert.alert(
        'Geração Parcial',
        `${result.results.length} QR Codes gerados com sucesso.\n\nErros:\n${result.errors.slice(0, 3).join('\n')}${result.errors.length > 3 ? '\n...' : ''}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Sucesso', `${result.results.length} QR Codes gerados com sucesso!`);
    }
  };

  const handleShare = async (qrCodeData: string, moduleName: string, date: string) => {
    try {
      await Share.share({
        message: `QR Code para ${moduleName} - ${date}\n\nDados: ${qrCodeData}`,
        title: `QR Code - ${moduleName}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o QR Code');
    }
  };

  if (loading && qrCodeSessions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="mt-2 text-gray-600">Carregando QR Codes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">QR Codes</Text>
          <View class
(Content truncated due to size limit. Use line ranges to read in chunks)