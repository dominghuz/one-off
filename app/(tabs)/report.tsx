import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tipos e dados
type FilterType = 'daily' | 'weekly' | 'monthly';
type ReportType = 'attendance' | 'salary' | 'modules';

const screenWidth = Dimensions.get('window').width;

const attendanceData = {
  daily: [
    { date: "Seg 05/06", presence: 5 },
    { date: "Ter 06/06", presence: 4 },
    { date: "Qua 07/06", presence: 3 },
    { date: "Qui 08/06", presence: 6 },
    { date: "Sex 09/06", presence: 7 },
    { date: "Sáb 10/06", presence: 0 },
    { date: "Dom 11/06", presence: 0 },
  ],
  weekly: [
    { week: "Semana 1", presence: 25 },
    { week: "Semana 2", presence: 32 },
    { week: "Semana 3", presence: 28 },
    { week: "Semana 4", presence: 30 },
  ],
  monthly: [
    { month: "Jan", presence: 120 },
    { month: "Fev", presence: 115 },
    { month: "Mar", presence: 130 },
    { month: "Abr", presence: 125 },
    { month: "Mai", presence: 135 },
    { month: "Jun", presence: 90 },
  ],
};

const salaryData = {
  daily: [
    { date: "Seg 05/06", amount: 6500 },
    { date: "Ter 06/06", amount: 13000 },
    { date: "Qua 07/06", amount: 6500 },
    { date: "Qui 08/06", amount: 19500 },
    { date: "Sex 09/06", amount: 13000 },
    { date: "Sáb 10/06", amount: 0 },
    { date: "Dom 11/06", amount: 0 },
  ],
  monthly: [
    { month: "Jan", amount: 156000 },
    { month: "Fev", amount: 149500 },
    { month: "Mar", amount: 169000 },
    { month: "Abr", amount: 162500 },
    { month: "Mai", amount: 175500 },
    { month: "Jun", amount: 117000 },
  ],
};

const modulesData = [
  { name: "Matemática", hours: 45 },
  { name: "Física", hours: 32 },
  { name: "Química", hours: 28 },
  { name: "Biologia", hours: 18 },
];

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#10B981',
  },
};

export default function ReportScreen() {
  const [filter, setFilter] = useState<FilterType>('daily');
  const [reportType, setReportType] = useState<ReportType>('attendance');

  const renderChart = () => {
    switch (reportType) {
      case 'attendance':
        const attendanceLabels = attendanceData[filter].map(item => 
          filter === 'monthly' ? item.month : filter === 'weekly' ? item.week : item.date
        );
        
        return (
          <LineChart
            data={{
              labels: attendanceLabels,
              datasets: [{
                data: attendanceData[filter].map(item => item.presence),
              }],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        );
      
      case 'salary':
        const salaryLabels = salaryData[filter].map(item => 
          filter === 'monthly' ? item.month : item.date
        );
        
        return (
          <BarChart
            data={{
              labels: salaryLabels,
              datasets: [{
                data: salaryData[filter].map(item => item.amount / 1000),
              }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix="K"
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        );
      
      case 'modules':
        return (
          <PieChart
            data={modulesData.map((item, index) => ({
              name: item.name,
              hours: item.hours,
              color: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][index],
              legendFontColor: '#6B7280',
              legendFontSize: 12,
            }))}
            width={screenWidth - 32}
            height={200}
            chartConfig={chartConfig}
            accessor="hours"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        );
    }
  };

  const renderDataTable = () => {
    switch (reportType) {
      case 'attendance':
        return (
          <View className="w-full bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between pb-2 border-b border-gray-100">
              <Text className="font-semibold text-gray-500">Período</Text>
              <Text className="font-semibold text-gray-500">Presenças</Text>
            </View>
            {attendanceData[filter].map((item, index) => (
              <View key={index} className="flex-row justify-between py-3 border-b border-gray-50">
                <Text className="text-gray-700">
                  {filter === 'monthly' ? item.month : filter === 'weekly' ? item.week : item.date}
                </Text>
                <Text className="font-semibold text-green-600">{item.presence}</Text>
              </View>
            ))}
          </View>
        );
      
      case 'salary':
        return (
          <View className="w-full bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between pb-2 border-b border-gray-100">
              <Text className="font-semibold text-gray-500">Período</Text>
              <Text className="font-semibold text-gray-500">Salário (KZ)</Text>
            </View>
            {salaryData[filter].map((item, index) => (
              <View key={index} className="flex-row justify-between py-3 border-b border-gray-50">
                <Text className="text-gray-700">
                  {filter === 'monthly' ? item.month : item.date}
                </Text>
                <Text className="font-semibold text-green-600">
                  {item.amount.toLocaleString('pt-AO')}
                </Text>
              </View>
            ))}
          </View>
        );
      
      case 'modules':
        return (
          <View className="w-full bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between pb-2 border-b border-gray-100">
              <Text className="font-semibold text-gray-500">Disciplina</Text>
              <Text className="font-semibold text-gray-500">Horas</Text>
            </View>
            {modulesData.map((item, index) => (
              <View key={index} className="flex-row justify-between py-3 border-b border-gray-50">
                <Text className="text-gray-700">{item.name}</Text>
                <Text className="font-semibold text-green-600">{item.hours}h</Text>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">📊 Relatórios Acadêmicos</Text>

      {/* Tipo de Relatório */}
      <View className="flex-row justify-between mb-6">
        {[
          { type: 'attendance', icon: 'calendar-check', label: 'Presenças' },
          { type: 'salary', icon: 'currency-usd', label: 'Salário' },
          { type: 'modules', icon: 'book-open', label: 'Módulos' },
        ].map((item) => (
          <TouchableOpacity
            key={item.type}
            onPress={() => setReportType(item.type)}
            className={`items-center p-3 rounded-lg ${reportType === item.type ? 'bg-green-100' : 'bg-white'}`}
            style={{ width: '30%' }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={reportType === item.type ? '#10B981' : '#9CA3AF'}
            />
            <Text className={`mt-1 text-sm ${reportType === item.type ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtros de Tempo */}
      <View className="flex-row justify-between mb-6 bg-white p-2 rounded-lg">
        {['daily', 'weekly', 'monthly'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item as FilterType)}
            className={`py-2 px-4 rounded-md ${filter === item ? 'bg-green-500' : ''}`}
          >
            <Text className={filter === item ? 'text-white font-semibold' : 'text-gray-600'}>
              {item === 'daily' ? 'Diário' : item === 'weekly' ? 'Semanal' : 'Mensal'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gráfico */}
      <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          {reportType === 'attendance' ? 'Presenças Registradas' : 
           reportType === 'salary' ? 'Histórico Salarial' : 'Distribuição por Disciplina'}
        </Text>
        {renderChart()}
      </View>

      {/* Tabela de Dados */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Detalhes</Text>
        {renderDataTable()}
      </View>

      {/* Exportar */}
      <TouchableOpacity className="flex-row items-center justify-center bg-green-500 p-4 rounded-lg mb-8">
        <MaterialCommunityIcons name="file-export" size={20} color="white" />
        <Text className="ml-2 text-white font-semibold">Exportar Relatório</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}