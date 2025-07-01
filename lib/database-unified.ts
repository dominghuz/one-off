// lib/database-unified.ts - Database unificado com todas as funcionalidades
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos unificados
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
  code: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Modulo {
  id: number;
  disciplinaId: number;
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
  moduloId: number;
  date: string;
  qrCodeData: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface Presenca {
  id: number;
  professorId: number;
  moduloId?: number;
  qrCodeSessionId?: number;
  module: string;
  time: string;
  scanTime: Date;
  atraso: number;
  isValid: boolean;
  createdAt: Date;
}

// Dados iniciais
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

const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@ispozango.ao',
    password: '123456',
    degree: 'Mestre',
    avatar: 'https://github.com/dominghuz.png',
    todayModules: 2,
    confirmedPresences: 10,
    currentSalary: 150000,
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
  },
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
    disciplinaId: 2,
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
    disciplinaId: 3,
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

// Função de inicialização unificada
export async function initializeDatabase() {
  try {
    console.log('Inicializando banco de dados unificado...');
    
    // Verificar se já existem dados
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
    
    console.log('Banco de dados unificado inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco unificado:', error);
  }
}

// Funções de autenticação
export async function authenticateUser(email: string, password: string) {
  try {
    // Tentar autenticar como professor primeiro
    const professorsData = await AsyncStorage.getItem('professors');
    if (professorsData) {
      const professors: Professor[] = JSON.parse(professorsData);
      const professor = professors.find(p => p.email === email && p.password === password);
      
      if (professor) {
        await AsyncStorage.setItem('authToken', `prof-token-${professor.id}`);
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
        await AsyncStorage.setItem('authToken', `coord-token-${coordenador.id}`);
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

// Funções para Professor (mantidas para compatibilidade)
export async function registrarPresenca(
  professorId: number,
  module: string,
  time: string,
  scanTime: Date,
  moduloId?: number,
  qrCodeSessionId?: number
) {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    const presencas: Presenca[] = presencasData ? JSON.parse(presencasData) : [];
    
    const nextIdData = await AsyncStorage.getItem('nextPresencaId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;

    // Calcular atraso baseado no horário do módulo
    let atraso = 0;
    if (moduloId) {
      const modulos = await getModulos();
      const modulo = modulos.find(m => m.id === moduloId);
      if (modulo) {
        const [startHour, startMinute] = modulo.startTime.split(':').map(Number);
        const scanHour = scanTime.getHours();
        const scanMinute = scanTime.getMinutes();
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const scanTimeInMinutes = scanHour * 60 + scanMinute;
        
        atraso = Math.max(0, scanTimeInMinutes - startTimeInMinutes);
      }
    } else {
      // Cálculo simples para compatibilidade
      atraso = scanTime.getMinutes() > 15 ? scanTime.getMinutes() - 15 : 0;
    }

    const novaPresenca: Presenca = {
      id: nextId,
      professorId,
      moduloId,
      qrCodeSessionId,
      module,
      time,
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
    const totalHoras = presencasProfessor.length * 2;
    
    const professorsData = await AsyncStorage.getItem('professors');
    const professors: Professor[] = professorsData ? JSON.parse(professorsData) : [];
    const professor = professors.find(p => p.id === professorId);
    
    let valorHora = 1500;
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

// Funções para Coordenador
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

export async function generateQRCodeSession(moduloId: number, date: string): Promise<QRCodeSession> {
  try {
    const modulos = await getModulos();
    const modulo = modulos.find(m => m.id === moduloId);
    
    if (!modulo) {
      throw new Error('Módulo não encontrado');
    }
    
    const disciplinas = await getDisciplinas();
    const disciplina = disciplinas.find(d => d.id === modulo.disciplinaId);
    
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

export async function getStatistics() {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    const presencas: Presenca[] = presencasData ? JSON.parse(presencasData) : [];
    
    const modulos = await getModulos();
    const disciplinas = await getDisciplinas();
    const professorsData = await AsyncStorage.getItem('professors');
    const professores: Professor[] = professorsData ? JSON.parse(professorsData) : [];
    
    const totalPresencas = presencas.length;
    
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

// // Compatibilidade com o sistema antigo
// export const prisma = {
//   professor: {
//     findUnique: async ({ where }: { where: { email: string
// (Content truncated due to size limit. Use line ranges to read in chunks)