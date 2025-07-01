// lib/database.ts - Versão simplificada
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

export interface Presenca {
  id: number;
  professorId: number;
  module: string;
  time: string;
  scanTime: Date;
  atraso: number;
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

export async function initializeDatabase( ) {
  try {
    console.log('Inicializando banco de dados...');
    
    const professorsData = await AsyncStorage.getItem('professors');
    if (!professorsData) {
      console.log('Criando dados iniciais...');
      await AsyncStorage.setItem('professors', JSON.stringify(INITIAL_PROFESSORS));
      await AsyncStorage.setItem('presencas', JSON.stringify([]));
      await AsyncStorage.setItem('nextProfessorId', '3');
      await AsyncStorage.setItem('nextPresencaId', '1');
    }
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const professorsData = await AsyncStorage.getItem('professors');
    if (!professorsData) return null;
    
    const professors: Professor[] = JSON.parse(professorsData);
    const professor = professors.find(p => p.email === email && p.password === password);
    
    if (professor) {
      await AsyncStorage.setItem('authToken', `token-${professor.id}`);
      return professor;
    }
    
    return null;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
}

export async function registrarPresenca(
  professorId: number,
  module: string,
  time: string,
  scanTime: Date
) {
  try {
    const presencasData = await AsyncStorage.getItem('presencas');
    const presencas: Presenca[] = presencasData ? JSON.parse(presencasData) : [];
    
    const nextIdData = await AsyncStorage.getItem('nextPresencaId');
    const nextId = nextIdData ? parseInt(nextIdData) : 1;

    // Calcular atraso (exemplo simples)
    const atraso = scanTime.getMinutes() > 15 ? scanTime.getMinutes() - 15 : 0;

    const novaPresenca: Presenca = {
      id: nextId,
      professorId,
      module,
      time,
      scanTime,
      atraso,
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
