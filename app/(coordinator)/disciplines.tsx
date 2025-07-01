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
import { useCoordinator } from '../../hooks/useCoordinator';
import { Discipline } from '../../lib/database';

// Discipline Card Component
function DisciplineCard({ discipline }: { discipline: Discipline }) {
  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Text className="text-lg font-semibold text-gray-900 flex-1">
              {discipline.name}
            </Text>
            <View className="rounded-full bg-blue-100 px-2 py-1">
              <Text className="text-xs font-medium text-blue-800">
                {discipline.code}
              </Text>
            </View>
          </View>
          
          {discipline.description && (
            <Text className="text-gray-600 mb-2" numberOfLines={2}>
              {discipline.description}
            </Text>
          )}
          
          <View className="flex-row items-center">
            <Ionicons name="school" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-500 ml-1">
              {discipline.credits} crédito{discipline.credits !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Add Discipline Modal Component
function AddDisciplineModal({
  visible,
  onClose,
  onSubmit,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (discipline: Omit<Discipline, 'id'>) => Promise<void>;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    credits: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      credits: '',
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
        Alert.alert('Erro', 'Nome da disciplina é obrigatório');
        return;
      }
      if (!formData.code.trim()) {
        Alert.alert('Erro', 'Código da disciplina é obrigatório');
        return;
      }
      if (!formData.credits.trim() || isNaN(Number(formData.credits)) || Number(formData.credits) <= 0) {
        Alert.alert('Erro', 'Créditos deve ser um número maior que zero');
        return;
      }

      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        code: formData.code.trim().toUpperCase(),
        credits: Number(formData.credits),
      });

      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar disciplina');
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
          <Text className="text-lg font-semibold text-gray-900">Nova Disciplina</Text>
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
                Nome da Disciplina *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Ex: Matemática Aplicada"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                editable={!loading}
              />
            </View>

            {/* Code */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Código da Disciplina *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Ex: MAT101"
                value={formData.code}
                onChangeText={(text) => setFormData(prev => ({ ...prev, code: text.toUpperCase() }))}
                autoCapitalize="characters"
                editable={!loading}
              />
            </View>

            {/* Credits */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Créditos *
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Ex: 6"
                value={formData.credits}
                onChangeText={(text) => setFormData(prev => ({ ...prev, credits: text }))}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                placeholder="Descrição da disciplina..."
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Main Disciplines Screen
export default function DisciplinesScreen() {
  const {
    disciplines,
    loading,
    error,
    createDiscipline,
    clearError,
  } = useCoordinator();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter disciplines based on search query
  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discipline.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (discipline.description && discipline.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateDiscipline = async (disciplineData: Omit<Discipline, 'id'>) => {
    await createDiscipline(disciplineData);
  };

  if (loading && disciplines.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-2 text-gray-600">Carregando disciplinas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">Disciplinas</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="rounded-lg bg-green-500 px-4 py-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Nova</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Buscar disciplinas..."
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
        {filteredDisciplines.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="book-outline" size={64} color="#9CA3AF" />
            <Text className="text-lg font-medium text-gray-500 mt-4">
              {searchQuery ? 'Nenhuma disciplina encontrada' : 'Nenhuma disciplina cadastrada'}
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery 
                ? 'Tente buscar com outros termos' 
                : 'Comece criando sua primeira disciplina'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                className="rounded-lg bg-green-500 px-6 py-3 mt-4"
              >
                <Text className="text-white font-semibold">Criar Disciplina</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {/* Results count */}
            <Text className="text-sm text-gray-600 mb-4">
              {filteredDisciplines.length} disciplina{filteredDisciplines.length !== 1 ? 's' : ''} encontrada{filteredDisciplines.length !== 1 ? 's' : ''}
            </Text>

            {/* Disciplines list */}
            {filteredDisciplines.map((discipline) => (
              <DisciplineCard key={discipline.id} discipline={discipline} />
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Discipline Modal */}
      <AddDisciplineModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateDiscipline}
        loading={loading}
      />
    </View>
  );
}

