import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useCoordinator } from '../../hooks/useCoordinator';
import { Module } from '../../lib/database';

// Module Card Component
function ModuleCard({ 
  module, 
  disciplineName, 
  professorName 
}: { 
  module: Module;
  disciplineName: string;
  professorName: string;
}) {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const getPeriodColor = (period: string) => {
    switch (period.toLowerCase()) {
      case 'manhã': return '#10B981';
      case 'tarde': return '#F59E0B';
      case 'noite': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {module.name}
          </Text>
          <Text className="text-gray-600 mb-2">
            {disciplineName}
          </Text>
        </View>
        <View 
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: `${getPeriodColor(module.period)}20` }}
        >
          <Text 
            className="text-xs font-medium"
            style={{ color: getPeriodColor(module.period) }}
          >
            {module.period}
          </Text>
        </View>
      </View>

      <View className="space-y-2">
        {/* Professor */}
        <View className="flex-row items-center">
          <Ionicons name="person" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            Prof. {professorName}
          </Text>
        </View>

        {/* Schedule */}
        <View className="flex-row items-center">
          <Ionicons name="time" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {dayNames[module.dayOfWeek]} • {module.startTime} - {module.endTime}
          </Text>
        </View>

        {/* Classroom */}
        <View className="flex-row items-center">
          <Ionicons name="location" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {module.classroom}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Add Module Modal Component
function AddModuleModal({
  visible,
  onClose,
  onSubmit,
  loading,
  disciplines,
  professors,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (module: Omit<Module, 'id'>) => Promise<void>;
  loading: boolean;
  disciplines: any[];
  professors: any[];
}) {
  const [formData, setFormData] = useState({
    name: '',
    disciplineId: '',
    professorId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    classroom: '',
    period: '',
  });

  const dayOptions = [
    { label: 'Domingo', value: '0' },
    { label: 'Segunda-feira', value: '1' },
    { label: 'Terça-feira', value: '2' },
    { label: 'Quarta-feira', value: '3' },
    { label: 'Quinta-feira', value: '4' },
    { label: 'Sexta-feira', value: '5' },
    { label: 'Sábado', value: '6' },
  ];

  const periodOptions = [
    { label: 'Manhã', value: 'Manhã' },
    { label: 'Tarde', value: 'Tarde' },
    { label: 'Noite', value: 'Noite' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      disciplineId: '',
      professorId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      classroom: '',
      period: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        Alert.alert('Erro', 'Nome do módulo é obrigatório');
        return;
      }
      if (!formData.disciplineId) {
        Alert.alert('Erro', 'Disciplina é obrigatória');
        return;
      }
      if (!formData.professorId) {
        Alert.alert('Erro', 'Professor é obrigatório');
        return;
      }
      if (!formData.dayOfWeek) {
        Alert.alert('Erro', 'Dia da semana é obrigatório');
        return;
      }
      if (!formData.startTime.trim()) {
        Alert.alert('Erro', 'Horário de início é obrigatório');
        return;
      }
      if (!formData.endTime.trim()) {
        Alert.alert('Erro', 'Horário de fim é obrigatório');
        return;
      }
      if (!formData.classroom.trim()) {
        Alert.alert('Erro', 'Sala de aula é obrigatória');
        return;
      }
      if (!formData.period) {
        Alert.alert('Erro', 'Período é obrigatório');
        return;
      }

      await onSubmit({
        name: formData.name.trim(),
        disciplineId: Number(formData.disciplineId),
        professorId: Number(formData.professorId),
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: formData.startTime.trim(),
        endTime: formData.endTime.trim(),
        classroom: formData.classroom.trim(),
        period: formData.period,
      });

      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar módulo');
    }
  };

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
          <Text className="text-lg font-semibold text-gray-900">Novo Módulo</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <Text className="text-green-600 text-lg font-semibold">Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            {/* Name */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Nome do Módulo *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Ex: Matemática - Turma A"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                editable={!loading}
              />
            </View>

            {/* Discipline */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Disciplina *
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white">
                <Picker
                  selectedValue={formData.disciplineId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, disciplineId: value }))}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecione uma disciplina" value="" />
                  {disciplines.map((discipline) => (
                    <Picker.Item
                      key={discipline.id}
                      label={`${discipline.name} (${discipline.code})`}
                      value={discipline.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Professor */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Professor *
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white">
                <Picker
                  selectedValue={formData.professorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, professorId: value }))}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecione um professor" value="" />
                  {professors.map((professor) => (
                    <Picker.Item
                      key={professor.id}
                      label={`${professor.name} (${professor.degree})`}
                      value={professor.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Day of Week */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dia da Semana *
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white">
                <Picker
                  selectedValue={formData.dayOfWeek}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecione o dia" value="" />
                  {dayOptions.map((day) => (
                    <Picker.Item
                      key={day.value}
                      label={day.label}
                      value={day.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Time Range */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Horário de Início *
                </Text>
                <TextInput
                  className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  placeholder="08:00"
                  value={formData.startTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                  editable={!loading}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Horário de Fim *
                </Text>
                <TextInput
                  className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  placeholder="10:00"
                  value={formData.endTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Classroom */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Sala de Aula *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Ex: Sala 101"
                value={formData.classroom}
                onChangeText={(text) => setFormData(prev => ({ ...prev, classroom: text }))}
                editable={!loading}
              />
            </View>

            {/* Period */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Período *
              </Text>
              <View className="rounded-lg border border-gray-300 bg-white">
                <Picker
                  selectedValue={formData.period}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}
                  enabled={!loading}
                >
                  <Picker.Item label="Selecione o período" value="" />
                  {periodOptions.map((period) => (
                    <Picker.Item
                      key={period.value}
                      label={period.label}
                      value={period.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Main Modules Screen
export default function ModulesScreen() {
  const {
    modules,
    disciplines,
    professors,
    loading,
    error,
    createModule,
    clearError,
    getDisciplineById,
    getProfessorById,
  } = useCoordinator();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter modules based on search query
  const filteredModules = modules.filter(module => {
    const discipline = getDisciplineById(module.disciplineId);
    const professor = getProfessorById(module.professorId);
    
    return (
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.classroom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discipline?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateModule = async (moduleData: Omit<Module, 'id'>) => {
    await createModule(moduleData);
  };

  if (loading && modules.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-2 text-gray-600">Carregando módulos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">Módulos</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="rounded-lg bg-blue-500 px-4 py-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Novo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Buscar módulos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View className="mx-4 mt-4 rounded-lg bg-red-100 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-red-700 flex-1">{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Ionicons name="close" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {filteredModules.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text className="text-lg font-medium text-gray-500 mt-4">
              {searchQuery ? 'Nenhum módulo encontrado' : 'Nenhum módulo cadastrado'}
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery 
                ? 'Tente buscar com outros termos' 
                : 'Comece criando seu primeiro módulo'
              }
            </Text>
          
{/* (Content truncated due to size limit. Use line ranges to read in chunks) */}