// lib/database.ts - Sistema unificado de autenticação e dados
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para compatibilidade
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
}

export interface Coordenador {
  id: number;
  name: string;
  email: string;
  password: string;
  institution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disciplina {
  id: number;
  name: string;
  description: string;
  code: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: number;
  disciplineId: number;
  professorId: number;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCodeSession {
  id: number;
  moduleId: number;
  date: string;
  qrCodeData: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface Presenca {
  id: number;
  professorId: number;
  moduleId?: number;
  qrCodeSessionId?: number;
  module: string;
  time: string;
  scanTime: Date;
  atraso: number;
  isValid: boolean;
  createdAt: Date;
}

// Dados iniciais
const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@ispozango.ao',
    password: '123456',
    degree: 'Licenciado',
    avatar: 'https://github.com/dominghuz.png',
    todayModules: 2,
    confirmedPresences: 10,
    currentSalary: 150000,
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@ispozango.ao',
    password: '123456',
    degree: 'Doutor',
    avatar: 'https://github.com/dominghuz.png',
    todayModules: 3,
    confirmedPresences: 15,
    currentSalary: 200000,
  },
];

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

const INITIAL_MODULOS: Module[] = [
  {
    id: 1,
    disciplineId: 1,
    professorId: 1,
    name: 'Matemática Aplicada - Turma A',
    dayOfWeek: 1,
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
    disciplineId: 2,
    professorId: 2,
    name: 'Física Computacional - Turma B',
    dayOfWeek: 3,
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
    disciplineId: 3,
    professorId: 1,
    name: 'Química Orgânica - Turma C',
    dayOfWeek: 5,
    startTime: '19:00',
    endTime: '21:00',
    classroom: 'Lab 305',
    period: 'Noite',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function initializeDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    
    const professorsData = await AsyncStorage.getItem('professors');
    const coordenadoresData = await AsyncStorage.getItem('coordenadores');
    
    if (!professorsData) {
      console.log('Criando dados iniciais de professores...');
      await AsyncStorage.setItem('professors', JSON.stringify(INITIAL_PROFESSORS));
      await AsyncStorage.setItem('nextProfessorId', '3');
    }
    
    if (!coordenadoresData) {
      console.log('Criando dados iniciais expandidos...');
      
      // Coordenadores
      await AsyncStorage.setItem('coordenadores', JSON.stringify(INITIAL_COORDENADORES));
      
      // Disciplinas
      await AsyncStorage.setItem('disciplinas', JSON.stringify(INITIAL_DISCIPLINAS));
      
      // Módulos
      await AsyncStorage.setItem('modulos', JSON.stringify(INITIAL_MODULOS));
      
      // QR Code Sessions
      await AsyncStorage.setItem('qrCodeSessions', JSON.stringify([]));
      
      // Presenças (se não existir)
      const presencasData = await AsyncStorage.getItem('presencas');
      if (!presencasData) {
        await AsyncStorage.setItem('presencas', JSON.stringify([]));
        await AsyncStorage.setItem('nextPresencaId', '1');
      }
      
      // Contadores
      await AsyncStorage.setItem('nextCoordenadorId', '2');
      await AsyncStorage.setItem('nextDisciplinaId', '4');
      await AsyncStorage.setItem('nextModuloId', '4');
      await AsyncStorage.setItem('nextQRCodeSessionId', '1');
    }
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

// Função de autenticação unificada
export async function authenticateUser(email: string, password: string) {
  try {
    // Tentar autenticar como professor primeiro
    const professorsData = await AsyncStorage.getItem('professors');
    if (professorsData) {
      const professors: Professor[] = JSON.parse(professorsData);
      const professor = professors.find(p => p.email === email && p.password === password);
      
      if (professor) {
        await AsyncStorage.setItem('authToken', `professor-${professor.id}`);
        await AsyncStorage.setItem('userType', 'professor');
        await AsyncStorage.setItem('userId', professor.id.toString());
        return { user: professor, type: 'professor' };
      }
    }
    
    // Tentar autenticar como coordenador
    const coordenadoresData = await AsyncStorage.getItem('coordenadores');
    if (coordenadoresData) {
      const coordenadores: Coordenador[] = JSON.parse(coordenadoresData);
      const coordenador = coordenadores.find(c => c.email === email && c.password === password);
      
      if (coordenador) {
        await AsyncStorage.setItem('authToken', `coordinator-${coordenador.id}`);
        await AsyncStorage.setItem('userType', 'coordenador');
        await AsyncStorage.setItem('userId', coordenador.id.toString());
        return { user: coordenador, type: 'coordenador' };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
}

export async function registrarPresenca(
  professorId: number,
  moduleId: number,
  qrCodeSessionId: number,
  scanTime: Date
) {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    const presencas: Presenca[] = presencasData ? JSON.parse(presencasData) : [];
    
    const nextIdData = await AsyncStorage.getItem('nextPresencaId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;

    // Buscar informações do módulo
    const modulosData = await AsyncStorage.getItem('modulos');
    const modulos = modulosData ? JSON.parse(modulosData) : [];
    const modulo = modulos.find((m: Module) => m.id === moduleId);

    let atraso = 0;
    let moduleName = 'Módulo';
    let period = 'Período';

    if (modulo) {
      moduleName = modulo.name;
      period = modulo.period;
      
      // Calcular atraso baseado no horário do módulo
      const [startHour, startMinute] = modulo.startTime.split(':').map(Number);
      const scanHour = scanTime.getHours();
      const scanMinute = scanTime.getMinutes();
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const scanTimeInMinutes = scanHour * 60 + scanMinute;
      
      atraso = Math.max(0, scanTimeInMinutes - startTimeInMinutes);
    }

    const novaPresenca: Presenca = {
      id: nextId,
      professorId,
      moduleId,
      qrCodeSessionId,
      module: moduleName,
      time: period,
      scanTime,
      atraso,
      isValid: true,
      createdAt: new Date()
    };

    presencas.push(novaPresenca);
    await AsyncStorage.setItem('presencas', JSON.stringify(presencas));
    await AsyncStorage.setItem('nextPresencaId', (nextId + 1).toString());

    console.log('Presença registrada:', novaPresenca);
    return novaPresenca;
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    throw error;
  }
}

export async function calcularSalario(professorId: number) {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    const presencas: Presenca[] = presencasData ? JSON.parse(presencasData) : [];
    
    const presencasProfessor = presencas.filter(p => p.professorId === professorId);
    const totalHoras = presencasProfessor.length * 2; // 2 horas por presença
    
    const professorsData = await AsyncStorage.getItem('professors');
    const professors: Professor[] = professorsData ? JSON.parse(professorsData) : [];
    const professor = professors.find(p => p.id === professorId);
    
    let valorHora = 1500; // Base para licenciado
    if (professor?.degree === 'Mestre') {
      valorHora = 2000;
    } else if (professor?.degree === 'Doutor') {
      valorHora = 2500;
    }
    
    return totalHoras * valorHora;
  } catch (error) {
    console.error('Erro ao calcular salário:', error);
    return 0;
  }
}

// Funções auxiliares para o coordenador
export async function getModuleById(id: number): Promise<Module | null> {
  try {
    const modulosData = await AsyncStorage.getItem('modulos');
    const modulos = modulosData ? JSON.parse(modulosData) : [];
    return modulos.find((m: Module) => m.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar módulo:', error);
    return null;
  }
}

export async function getProfessorById(id: number): Promise<Professor | null> {
  try {
    const professorsData = await AsyncStorage.getItem('professors');
    const professors = professorsData ? JSON.parse(professorsData) : [];
    return professors.find((p: Professor) => p.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    return null;
  }
}

export async function getQRCodeSessionById(id: number): Promise<QRCodeSession | null> {
  try {
    const sessionsData = await AsyncStorage.getItem('qrCodeSessions');
    const sessions = sessionsData ? JSON.parse(sessionsData) : [];
    return sessions.find((s: QRCodeSession) => s.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar QR Code session:', error);
    return null;
  }
}

// Compatibilidade com o sistema antigo
export const prisma = {
  professor: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      const professorsData = await AsyncStorage.getItem('professors');
      const professors = professorsData ? JSON.parse(professorsData) : [];
      return professors.find((p: Professor) => p.email === where.email) || null;
    }
  }
};