// lib/database-coordinator.ts - Modelo de dados expandido para Coordenador
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos expandidos para o sistema
export interface Coordenador {
  id: number;
  name: string;
  email: string;
  password: string;
  institution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professor {
  id: number;
  name: string;
  email: string;
  password: string;
  degree: string;
  avatar?: string;
  todayModules?: number;
  confirmedPresences?: number;
  currentSalary?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disciplina {
  id: number;
  name: string;
  description: string;
  code: string; // Código da disciplina (ex: MAT101)
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Modulo {
  id: number;
  disciplinaId: number;
  professorId: number;
  name: string;
  dayOfWeek: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  startTime: string; // "08:00"
  endTime: string; // "10:00"
  classroom: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCodeSession {
  id: number;
  moduloId: number;
  date: string; // "2025-01-07"
  qrCodeData: string; // JSON string com dados do QR Code
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface Presenca {
  id: number;
  professorId: number;
  moduloId: number;
  qrCodeSessionId: number;
  scanTime: Date;
  atraso: number; // em minutos
  isValid: boolean;
  createdAt: Date;
}

// Dados iniciais expandidos
const INITIAL_COORDENADORES: Coordenador[] = [
  {
    id: 1,
    name: 'Dr. António Coordenador',
    email: 'coordenador@ispozango.ao',
    password: 'coord123',
    institution: 'ISPOZANGO',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const INITIAL_DISCIPLINAS: Disciplina[] = [
  {
    id: 1,
    name: 'Matemática Aplicada',
    description: 'Fundamentos de matemática aplicada à informática',
    code: 'MAT101',
    credits: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Física Computacional',
    description: 'Princípios de física aplicados à computação',
    code: 'FIS102',
    credits: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Química Orgânica',
    description: 'Estudo dos compostos orgânicos',
    code: 'QUI103',
    credits: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const INITIAL_MODULOS: Modulo[] = [
  {
    id: 1,
    disciplinaId: 1,
    professorId: 1, // João Silva
    name: 'Matemática Aplicada - Turma A',
    dayOfWeek: 1, // Segunda-feira
    startTime: '08:00',
    endTime: '10:00',
    classroom: 'Sala 101',
    period: 'Manhã',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    disciplinaId: 2,
    professorId: 2, // Maria Santos
    name: 'Física Computacional - Turma B',
    dayOfWeek: 3, // Quarta-feira
    startTime: '14:00',
    endTime: '16:00',
    classroom: 'Sala 203',
    period: 'Tarde',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    disciplinaId: 3,
    professorId: 1, // João Silva
    name: 'Química Orgânica - Turma C',
    dayOfWeek: 5, // Sexta-feira
    startTime: '19:00',
    endTime: '21:00',
    classroom: 'Lab 305',
    period: 'Noite',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Função para inicializar o banco expandido
export async function initializeExpandedDatabase() {
  try {
    console.log('Inicializando banco de dados expandido...');
    
    // Verificar se já existe dados
    const coordenadoresData = await AsyncStorage.getItem('coordenadores');
    
    if (!coordenadoresData) {
      console.log('Criando dados iniciais expandidos...');
      
      // Coordenadores
      await AsyncStorage.setItem('coordenadores', JSON.stringify(INITIAL_COORDENADORES));
      
      // Disciplinas
      await AsyncStorage.setItem('disciplinas', JSON.stringify(INITIAL_DISCIPLINAS));
      
      // Módulos
      await AsyncStorage.setItem('modulos', JSON.stringify(INITIAL_MODULOS));
      
      // QR Code Sessions (vazio inicialmente)
      await AsyncStorage.setItem('qrCodeSessions', JSON.stringify([]));
      
      // Contadores
      await AsyncStorage.setItem('nextCoordenadorId', '2');
      await AsyncStorage.setItem('nextDisciplinaId', '4');
      await AsyncStorage.setItem('nextModuloId', '4');
      await AsyncStorage.setItem('nextQRCodeSessionId', '1');
      
      console.log('Dados iniciais expandidos criados com sucesso!');
    } else {
      console.log('Dados expandidos já existem, carregando...');
    }
    
    console.log('Banco de dados expandido inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco expandido:', error);
  }
}

// Funções para Coordenador
export async function authenticateCoordinator(email: string, password: string): Promise<Coordenador | null> {
  try {
    const coordenadoresData = await AsyncStorage.getItem('coordenadores');
    if (!coordenadoresData) return null;
    
    const coordenadores: Coordenador[] = JSON.parse(coordenadoresData);
    const coordenador = coordenadores.find(c => c.email === email && c.password === password);
    
    if (coordenador) {
      await AsyncStorage.setItem('authToken', `coord-token-${coordenador.id}`);
      await AsyncStorage.setItem('userType', 'coordenador');
      return coordenador;
    }
    
    return null;
  } catch (error) {
    console.error('Erro na autenticação do coordenador:', error);
    return null;
  }
}

// Funções para Disciplinas
export async function getDisciplinas(): Promise<Disciplina[]> {
  try {
    const disciplinasData = await AsyncStorage.getItem('disciplinas');
    return disciplinasData ? JSON.parse(disciplinasData) : [];
  } catch (error) {
    console.error('Erro ao obter disciplinas:', error);
    return [];
  }
}

export async function createDisciplina(disciplina: Omit<Disciplina, 'id' | 'createdAt' | 'updatedAt'>): Promise<Disciplina> {
  try {
    const disciplinas = await getDisciplinas();
    const nextIdData = await AsyncStorage.getItem('nextDisciplinaId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;
    
    const novaDisciplina: Disciplina = {
      ...disciplina,
      id: nextId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    disciplinas.push(novaDisciplina);
    await AsyncStorage.setItem('disciplinas', JSON.stringify(disciplinas));
    await AsyncStorage.setItem('nextDisciplinaId', (nextId + 1).toString());
    
    return novaDisciplina;
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    throw error;
  }
}

// Funções para Módulos
export async function getModulos(): Promise<Modulo[]> {
  try {
    const modulosData = await AsyncStorage.getItem('modulos');
    return modulosData ? JSON.parse(modulosData) : [];
  } catch (error) {
    console.error('Erro ao obter módulos:', error);
    return [];
  }
}

export async function createModulo(modulo: Omit<Modulo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Modulo> {
  try {
    const modulos = await getModulos();
    const nextIdData = await AsyncStorage.getItem('nextModuloId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;
    
    const novoModulo: Modulo = {
      ...modulo,
      id: nextId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    modulos.push(novoModulo);
    await AsyncStorage.setItem('modulos', JSON.stringify(modulos));
    await AsyncStorage.setItem('nextModuloId', (nextId + 1).toString());
    
    return novoModulo;
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    throw error;
  }
}

// Funções para QR Code Sessions
export async function generateQRCodeSession(moduloId: number, date: string): Promise<QRCodeSession> {
  try {
    const modulos = await getModulos();
    const modulo = modulos.find(m => m.id === moduloId);
    
    if (!modulo) {
      throw new Error('Módulo não encontrado');
    }
    
    const disciplinas = await getDisciplinas();
    const disciplina = disciplinas.find(d => d.id === modulo.disciplinaId);
    
    // Dados do QR Code
    const qrCodeData = {
      moduloId: modulo.id,
      disciplina: disciplina?.name || 'Disciplina',
      modulo: modulo.name,
      date: date,
      period: modulo.period,
      classroom: modulo.classroom,
      startTime: modulo.startTime,
      endTime: modulo.endTime,
      generatedAt: new Date().toISOString()
    };
    
    const qrCodeSessions = await getQRCodeSessions();
    const nextIdData = await AsyncStorage.getItem('nextQRCodeSessionId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;
    
    // Expirar em 4 horas
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 4);
    
    const novaSession: QRCodeSession = {
      id: nextId,
      moduloId,
      date,
      qrCodeData: JSON.stringify(qrCodeData),
      isActive: true,
      expiresAt,
      createdAt: new Date()
    };
    
    qrCodeSessions.push(novaSession);
    await AsyncStorage.setItem('qrCodeSessions', JSON.stringify(qrCodeSessions));
    await AsyncStorage.setItem('nextQRCodeSessionId', (nextId + 1).toString());
    
    return novaSession;
  } catch (error) {
    console.error('Erro ao gerar QR Code session:', error);
    throw error;
  }
}

export async function getQRCodeSessions(): Promise<QRCodeSession[]> {
  try {
    const sessionsData = await AsyncStorage.getItem('qrCodeSessions');
    return sessionsData ? JSON.parse(sessionsData) : [];
  } catch (error) {
    console.error('Erro ao obter QR Code sessions:', error);
    return [];
  }
}

// Função para obter estatísticas
export async function getStatistics() {
  try {
    const presencas = await getPresencas();
    const modulos = await getModulos();
    const disciplinas = await getDisciplinas();
    const professores = await getProfessores();
    
    // Total de presenças
    const totalPresencas = presencas.length;
    
    // Presenças por módulo
    const presencasPorModulo = modulos.map(modulo => {
      const presencasModulo = presencas.filter(p => p.moduloId === modulo.id);
      const disciplina = disciplinas.find(d => d.id === modulo.disciplinaId);
      
      return {
        moduloId: modulo.id,
        moduloName: modulo.name,
        disciplinaName: disciplina?.name || 'N/A',
        totalPresencas: presencasModulo.length,
        totalAtrasos: presencasModulo.filter(p => p.atraso > 0).length
      };
    });
    
    // Presenças por professor
    const presencasPorProfessor = professores.map(professor => {
      const presencasProfessor = presencas.filter(p => p.professorId === professor.id);
      
      return {
        professorId: professor.id,
        professorName: professor.name,
        totalPresencas: presencasProfessor.length,
        totalAtrasos: presencasProfessor.filter(p => p.atraso > 0).length,
        taxaAtraso: presencasProfessor.length > 0 
          ? (presencasProfessor.filter(p => p.atraso > 0).length / presencasProfessor.length * 100).toFixed(1)
          : '0'
      };
    });
    
    return {
      totalPresencas,
      totalModulos: modulos.length,
      totalDisciplinas: disciplinas.length,
      totalProfessores: professores.length,
      presencasPorModulo,
      presencasPorProfessor
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
}

// Funções auxiliares
async function getPresencas(): Promise<Presenca[]> {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    return presencasData ? JSON.parse(presencasData) : [];
  } catch (error) {
    console.error('Erro ao obter presenças:', error);
    return [];
  }
}

async function getProfessores(): Promise<Professor[]> {
  try {
    const professoresData = await AsyncStorage.getItem('professors');
    return professoresData ? JSON.parse(professoresData) : [];
  } catch (error) {
    console.error('Erro ao obter professores:', error);
    return [];
  }
}

export default {
  initializeExpandedDatabase,
  authenticateCoordinator,
  getDisciplinas,
  createDisciplina,
  getModulos,
  createModulo,
  generateQRCodeSession,
  getQRCodeSessions,
  getStatistics
};

