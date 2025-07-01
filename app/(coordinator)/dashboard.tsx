import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Summary Card Component
function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#10B981',
  onPress
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>{title}</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{value}</Text>
          {subtitle && (
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{subtitle}</Text>
          )}
        </View>
        <View 
          style={{
            backgroundColor: `${color}20`,
            borderRadius: 20,
            padding: 12,
          }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Quick Actions Component
function QuickActions({ onNavigate }: { onNavigate: (route: string) => void }) {
  const actions = [
    {
      title: 'Nova Disciplina',
      icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
      color: '#10B981',
      route: 'disciplines'
    },
    {
      title: 'Novo Módulo',
      icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
      color: '#3B82F6',
      route: 'modules'
    },
    {
      title: 'Gerar QR Code',
      icon: 'qr-code-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8B5CF6',
      route: 'qrcodes'
    },
    {
      title: 'Ver Relatórios',
      icon: 'bar-chart-outline' as keyof typeof Ionicons.glyphMap,
      color: '#F59E0B',
      route: 'reports'
    },
  ];

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
        Ações Rápidas
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onNavigate(action.route)}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              width: (width - 48 - 12) / 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View 
              style={{
                backgroundColor: `${action.color}20`,
                borderRadius: 20,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827', textAlign: 'center' }}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'qr_generated',
      title: 'QR Code gerado',
      description: 'Matemática Aplicada - Turma A',
      time: '2 horas atrás',
      icon: 'qr-code' as keyof typeof Ionicons.glyphMap,
      color: '#8B5CF6'
    },
    {
      id: 2,
      type: 'module_created',
      title: 'Módulo criado',
      description: 'Física Computacional - Turma B',
      time: '1 dia atrás',
      icon: 'calendar' as keyof typeof Ionicons.glyphMap,
      color: '#3B82F6'
    },
    {
      id: 3,
      type: 'presence_registered',
      title: 'Presença registrada',
      description: 'João Silva - Matemática',
      time: '2 dias atrás',
      icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
      color: '#10B981'
    },
  ];

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
        Atividade Recente
      </Text>
      <View style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' }}>
        {activities.map((activity, index) => (
          <View 
            key={activity.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: index < activities.length - 1 ? 1 : 0,
              borderBottomColor: '#F3F4F6',
            }}
          >
            <View 
              style={{
                backgroundColor: `${activity.color}20`,
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}
            >
              <Ionicons name={activity.icon} size={20} color={activity.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>
                {activity.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                {activity.description}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              {activity.time}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Main Dashboard Component
export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalDisciplinas: 0,
    totalModulos: 0,
    totalProfessores: 0,
    totalPresencas: 0,
    qrCodesAtivos: 0,
  });

  const loadDashboardData = async () => {
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Carregar dados do AsyncStorage
      const disciplinasData = await AsyncStorage.getItem('disciplinas');
      const modulosData = await AsyncStorage.getItem('modulos');
      const professorsData = await AsyncStorage.getItem('professors');
      const presencasData = await AsyncStorage.getItem('presencas');
      const qrSessionsData = await AsyncStorage.getItem('qrCodeSessions');

      const disciplinas = disciplinasData ? JSON.parse(disciplinasData) : [];
      const modulos = modulosData ? JSON.parse(modulosData) : [];
      const professors = professorsData ? JSON.parse(professorsData) : [];
      const presencas = presencasData ? JSON.parse(presencasData) : [];
      const qrSessions = qrSessionsData ? JSON.parse(qrSessionsData) : [];

      // Contar QR Codes ativos (não expirados)
      const now = new Date();
      const qrCodesAtivos = qrSessions.filter((session: any) => {
        return session.isActive && new Date(session.expiresAt) > now;
      }).length;

      setStats({
        totalDisciplinas: disciplinas.length,
        totalModulos: modulos.length,
        totalProfessores: professors.length,
        totalPresencas: presencas.length,
        qrCodesAtivos,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleNavigate = (route: string) => {
    router.push(`/(coordinator)/${route}` as any);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            Dashboard
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Bem-vindo ao painel de controle acadêmico
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
            Resumo Geral
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <SummaryCard
                title="Disciplinas"
                value={stats.totalDisciplinas}
                subtitle="Cadastradas"
                icon="book"
                color="#10B981"
                onPress={() => handleNavigate('disciplines')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SummaryCard
                title="Módulos"
                value={stats.totalModulos}
                subtitle="Ativos"
                icon="calendar"
                color="#3B82F6"
                onPress={() => handleNavigate('modules')}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <SummaryCard
                title="Professores"
                value={stats.totalProfessores}
                subtitle="Cadastrados"
                icon="people"
                color="#8B5CF6"
              />
            </View>
            <View style={{ flex: 1 }}>
              <SummaryCard
                title="Presenças"
                value={stats.totalPresencas}
                subtitle="Registradas"
                icon="checkmark-circle"
                color="#F59E0B"
                onPress={() => handleNavigate('reports')}
              />
            </View>
          </View>

          <SummaryCard
            title="QR Codes Ativos"
            value={stats.qrCodesAtivos}
            subtitle="Válidos e não expirados"
            icon="qr-code"
            color="#EC4899"
            onPress={() => handleNavigate('qrcodes')}
          />
        </View>

        {/* Quick Actions */}
        <QuickActions onNavigate={handleNavigate} />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, marginTop: 24 }}>
          <Text style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
            Sistema de Gestão Acadêmica - Módulo Coordenador
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
            Última atualização: {new Date().toLocaleString('pt-AO')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}