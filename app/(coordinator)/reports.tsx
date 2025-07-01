import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCoordinator } from '../../hooks/useCoordinator';

const { width } = Dimensions.get('window');

// Summary Card Component
function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#10B981',
  trend 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">{title}</Text>
          <Text className="text-2xl font-bold text-gray-900">{value}</Text>
          {subtitle && (
            <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
          )}
        </View>
        <View 
          className="rounded-full p-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
      
      {trend && (
        <View className="flex-row items-center">
          <Ionicons 
            name={trend.isPositive ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={trend.isPositive ? '#10B981' : '#EF4444'} 
          />
          <Text 
            className={`text-sm ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </Text>
          <Text className="text-xs text-gray-500 ml-1">vs. período anterior</Text>
        </View>
      )}
    </View>
  );
}

// Performance Table Component
function PerformanceTable({ 
  title, 
  data, 
  type = 'module' 
}: {
  title: string;
  data: Array<{
    id: number;
    name: string;
    totalPresences: number;
    avgAtraso: number;
  }>;
  type?: 'module' | 'professor';
}) {
  const getPerformanceColor = (avgAtraso: number) => {
    if (avgAtraso <= 5) return '#10B981'; // Green
    if (avgAtraso <= 15) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getPerformanceLabel = (avgAtraso: number) => {
    if (avgAtraso <= 5) return 'Excelente';
    if (avgAtraso <= 15) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">{title}</Text>
      
      {data.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">Nenhum dado disponível</Text>
      ) : (
        <View>
          {/* Header */}
          <View className="flex-row items-center py-2 border-b border-gray-100">
            <Text className="flex-1 text-sm font-medium text-gray-700">
              {type === 'module' ? 'Módulo' : 'Professor'}
            </Text>
            <Text className="w-20 text-sm font-medium text-gray-700 text-center">
              Presenças
            </Text>
            <Text className="w-20 text-sm font-medium text-gray-700 text-center">
              Atraso
            </Text>
            <Text className="w-24 text-sm font-medium text-gray-700 text-center">
              Status
            </Text>
          </View>

          {/* Data Rows */}
          {data.map((item, index) => (
            <View 
              key={`${type}-${item.id}`} 
              className={`flex-row items-center py-3 ${index < data.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text className="w-20 text-sm text-gray-600 text-center">
                {item.totalPresences}
              </Text>
              <Text className="w-20 text-sm text-gray-600 text-center">
                {item.avgAtraso}min
              </Text>
              <View className="w-24 items-center">
                <View 
                  className="rounded-full px-2 py-1"
                  style={{ backgroundColor: `${getPerformanceColor(item.avgAtraso)}20` }}
                >
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: getPerformanceColor(item.avgAtraso) }}
                  >
                    {getPerformanceLabel(item.avgAtraso)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// Simple Bar Chart Component
function SimpleBarChart({ 
  data, 
  title 
}: {
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}) {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartWidth = width - 80; // Account for padding

  return (
    <View className="rounded-lg bg-white p-4 shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">{title}</Text>
      
      {data.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">Nenhum dado disponível</Text>
      ) : (
        <View className="space-y-3">
          {data.map((item, index) => (
            <View key={index} className="space-y-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
                  {item.label}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.value}
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-2">
                <View 
                  className="rounded-full h-2"
                  style={{ 
                    backgroundColor: item.color,
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// Filter Buttons Component
function FilterButtons({ 
  activeFilter, 
  onFilterChange 
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
  ];

  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          onPress={() => onFilterChange(filter.key)}
          className={`flex-1 rounded-md py-2 ${
            activeFilter === filter.key ? 'bg-white shadow-sm' : ''
          }`}
        >
          <Text 
            className={`text-center text-sm font-medium ${
              activeFilter === filter.key ? 'text-gray-900' : 'text-gray-600'
            }`}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Main Reports Screen
export default function ReportsScreen() {
  const {
    statistics,
    modules,
    professors,
    disciplines,
    loading,
    error,
    loadAllData,
    clearError,
  } = useCoordinator();

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Prepare chart data
  const moduleChartData = statistics?.presencesByModule.map(item => ({
    label: item.moduleName,
    value: item.totalPresences,
    color: '#3B82F6',
  })) || [];

  const professorChartData = statistics?.presencesByProfessor.map(item => ({
    label: item.professorName,
    value: item.totalPresences,
    color: '#10B981',
  })) || [];

  const atrasoChartData = statistics?.presencesByModule.map(item => ({
    label: item.moduleName,
    value: item.avgAtraso,
    color: item.avgAtraso <= 5 ? '#10B981' : item.avgAtraso <= 15 ? '#F59E0B' : '#EF4444',
  })) || [];

  if (loading && !statistics) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-2 text-gray-600">Carregando relatórios...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900">Relatórios</Text>
          <TouchableOpacity
            onPress={loadAllData}
            className="rounded-lg bg-yellow-100 p-2"
          >
            <Ionicons name="refresh" size={20} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View className="rounded-lg bg-red-100 p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-red-700 flex-1">{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Ionicons name="close" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Filter Buttons */}
        <FilterButtons 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        {/* Summary Cards */}
        {statistics && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Resumo Geral</Text>
            
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <SummaryCard
                  title="Total de Presenças"
                  value={statistics.totalPresences}
                  icon="people"
                  color="#10B981"
                />
              </View>
              <View className="flex-1">
                <SummaryCard
                  title="Módulos Ativos"
                  value={statistics.totalModules}
                  icon="calendar"
                  color="#3B82F6"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <SummaryCard
                  title="Professores"
                  value={statistics.totalProfessors}
                  icon="person"
                  color="#8B5CF6"
                />
              </View>
              <View className="flex-1">
                <SummaryCard
                  title="Disciplinas"
                  value={statistics.totalDisciplines}
                  icon="book"
                  color="#F59E0B"
                />
              </View>
            </View>
          </View>
        )}

        {/* Charts Section */}
        <Text className="text-lg font-semibold text-gray-900 mb-3">Análises Detalhadas</Text>

        <SimpleBarChart
          title="Presenças por Módulo"
          data={moduleChartData}
        />

        <SimpleBarChart
          title="Presenças por Professor"
          data={professorChartData}
        />

        <SimpleBarChart
          title="Atraso Médio por Módulo (minutos)"
          data={atrasoChartData}
        />

        {/* Performance Tables */}
        {statistics && (
          <>
            <PerformanceTable
              title="Performance Detalhada por Módulo"
              data={statistics.presencesByModule}
              type="module"
            />

            <PerformanceTable
              title="Performance Detalhada por Professor"
              data={statistics.presencesByProfessor}
              type="professor"
            />
          </>
        )}

        {/* Export Section */}
        <View className="rounded-lg bg-white p-4 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Exportar Dados</Text>
          <Text className="text-gray-600 mb-4">
            Exporte os dados para análise externa ou arquivamento.
          </Text>
          
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 rounded-lg bg-green-100 p-3">
              <View className="flex-row items-center justify-center">
                <Ionicons name="document-text" size={20} color="#10B981" />
                <Text className="text-green-700 font-medium ml-2">CSV</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 rounded-lg bg-blue-100 p-3">
              <View className="flex-row items-center justify-center">
                <Ionicons name="document" size={20} color="#3B82F6" />
                <Text className="text-blue-700 font-medium ml-2">PDF</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 rounded-lg bg-purple-100 p-3">
              <View className="flex-row items-center justify-center">
                <Ionicons name="share" size={20} color="#8B5CF6" />
                <Text className="text-purple-700 font-medium ml-2">Compartilhar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="border-t border-gray-200 pt-4 mt-6">
          <Text className="text-center text-xs text-gray-500">
            Relatórios gerados em {new Date().toLocaleString('pt-AO')}
          </Text>
          <Text className="text-center text-xs text-gray-400 mt-1">
            Sistema de Gestão Acadêmica - Módulo Coordenador
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

