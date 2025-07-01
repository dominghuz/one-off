import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export interface Discipline {
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

export interface Professor {
  id: number;
  name: string;
  email: string;
  degree: string;
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

export interface Statistics {
  totalPresences: number;
  totalModules: number;
  totalDisciplines: number;
  totalProfessors: number;
  presencesByModule: Array<{
    id: number;
    name: string;
    totalPresences: number;
    avgAtraso: number;
  }>;
  presencesByProfessor: Array<{
    id: number;
    name: string;
    totalPresences: number;
    avgAtraso: number;
  }>;
}

export function useCoordinator() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [qrCodeSessions, setQrCodeSessions] = useState<QRCodeSession[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os dados
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadDisciplines(),
        loadModules(),
        loadProfessors(),
        loadQRCodeSessions(),
        loadStatistics(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Carregar disciplinas
  const loadDisciplines = async () => {
    try {
      const data = await AsyncStorage.getItem('disciplinas');
      const disciplinas = data ? JSON.parse(data) : [];
      setDisciplines(disciplinas);
    } catch (err) {
      console.error('Erro ao carregar disciplinas:', err);
    }
  };

  // Carregar módulos
  const loadModules = async () => {
    try {
      const data = await AsyncStorage.getItem('modulos');
      const modulos = data ? JSON.parse(data) : [];
      setModules(modulos);
    } catch (err) {
      console.error('Erro ao carregar módulos:', err);
    }
  };

  // Carregar professores
  const loadProfessors = async () => {
    try {
      const data = await AsyncStorage.getItem('professors');
      const professores = data ? JSON.parse(data) : [];
      setProfessors(professores);
    } catch (err) {
      console.error('Erro ao carregar professores:', err);
    }
  };

  // Carregar QR Code sessions
  const loadQRCodeSessions = async () => {
    try {
      const data = await AsyncStorage.getItem('qrCodeSessions');
      const sessions = data ? JSON.parse(data) : [];
      setQrCodeSessions(sessions);
    } catch (err) {
      console.error('Erro ao carregar QR Code sessions:', err);
    }
  };

  // Carregar estatísticas
  const loadStatistics = async () => {
    try {
      const presencasData = await AsyncStorage.getItem('presencas');
      const presencas = presencasData ? JSON.parse(presencasData) : [];
      
      const modulosData = await AsyncStorage.getItem('modulos');
      const modulos = modulosData ? JSON.parse(modulosData) : [];
      
      const disciplinasData = await AsyncStorage.getItem('disciplinas');
      const disciplinas = disciplinasData ? JSON.parse(disciplinasData) : [];
      
      const professorsData = await AsyncStorage.getItem('professors');
      const professores = professorsData ? JSON.parse(professorsData) : [];

      // Calcular estatísticas
      const totalPresences = presencas.length;
      
      const presencesByModule = modulos.map((modulo: any) => {
        const presencasModulo = presencas.filter((p: any) => p.moduloId === modulo.id);
        const totalAtraso = presencasModulo.reduce((sum: number, p: any) => sum + (p.atraso || 0), 0);
        
        return {
          id: modulo.id,
          name: modulo.name,
          totalPresences: presencasModulo.length,
          avgAtraso: presencasModulo.length > 0 ? Math.round(totalAtraso / presencasModulo.length) : 0,
        };
      });

      const presencesByProfessor = professores.map((professor: any) => {
        const presencasProfessor = presencas.filter((p: any) => p.professorId === professor.id);
        const totalAtraso = presencasProfessor.reduce((sum: number, p: any) => sum + (p.atraso || 0), 0);
        
        return {
          id: professor.id,
          name: professor.name,
          totalPresences: presencasProfessor.length,
          avgAtraso: presencasProfessor.length > 0 ? Math.round(totalAtraso / presencasProfessor.length) : 0,
        };
      });

      setStatistics({
        totalPresences,
        totalModules: modulos.length,
        totalDisciplines: disciplinas.length,
        totalProfessors: professores.length,
        presencesByModule,
        presencesByProfessor,
      });
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  // Criar disciplina
  const createDiscipline = async (disciplineData: Omit<Discipline, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const nextIdData = await AsyncStorage.getItem('nextDisciplinaId');
      const nextId = nextIdData ? parseInt(nextIdData) : 1;
      
      const newDiscipline: Discipline = {
        ...disciplineData,
        id: nextId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedDisciplines = [...disciplines, newDiscipline];
      setDisciplines(updatedDisciplines);
      
      await AsyncStorage.setItem('disciplinas', JSON.stringify(updatedDisciplines));
      await AsyncStorage.setItem('nextDisciplinaId', (nextId + 1).toString());
      
      return newDiscipline;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar disciplina';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Criar módulo
  const createModule = async (moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const nextIdData = await AsyncStorage.getItem('nextModuloId');
      const nextId = nextIdData ? parseInt(nextIdData) : 1;
      
      const newModule: Module = {
        ...moduleData,
        id: nextId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedModules = [...modules, newModule];
      setModules(updatedModules);
      
      await AsyncStorage.setItem('modulos', JSON.stringify(updatedModules));
      await AsyncStorage.setItem('nextModuloId', (nextId + 1).toString());
      
      return newModule;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar módulo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Gerar QR Code
  const generateQRCode = async (moduleId: number, date: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const module = modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Módulo não encontrado');
      }

      const discipline = disciplines.find(d => d.id === module.disciplineId);
      
      const qrCodeData = {
        type: 'presence',
        moduleId: module.id,
        sessionId: Date.now(), // Usar timestamp como ID temporário
        date: date,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 horas
        module: module.name,
        discipline: discipline?.name || 'Disciplina',
        period: module.period,
        classroom: module.classroom,
        startTime: module.startTime,
        endTime: module.endTime,
      };

      const nextIdData = await AsyncStorage.getItem('nextQRCodeSessionId');
      const nextId = nextIdData ? parseInt(nextIdData) : 1;
      
      const newSession: QRCodeSession = {
        id: nextId,
        moduleId,
        date,
        qrCodeData: JSON.stringify(qrCodeData),
        isActive: true,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      
      const updatedSessions = [...qrCodeSessions, newSession];
      setQrCodeSessions(updatedSessions);
      
      await AsyncStorage.setItem('qrCodeSessions', JSON.stringify(updatedSessions));
      await AsyncStorage.setItem('nextQRCodeSessionId', (nextId + 1).toString());
      
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar QR Code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Gerar QR Codes em lote
  const generateBulkQRCodes = async (moduleIds: number[], dates: string[]) => {
    setLoading(true);
    setError(null);
    
    const results: any[] = [];
    const errors: string[] = [];
    
    try {
      for (const moduleId of moduleIds) {
        for (const date of dates) {
          try {
            const session = await generateQRCode(moduleId, date);
            results.push(session);
          } catch (err) {
            const errorMessage = `Erro no módulo ${moduleId} para ${date}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
            errors.push(errorMessage);
          }
        }
      }
      
      return { results, errors };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na geração em lote';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Funções auxiliares
  const getDisciplineById = (id: number) => disciplines.find(d => d.id === id);
  const getModuleById = (id: number) => modules.find(m => m.id === id);
  const getProfessorById = (id: number) => professors.find(p => p.id === id);

  // Limpar erro
  const clearError = () => setError(null);

  // Carregar dados na inicialização
  useEffect(() => {
    loadAllData();
  }, []);

  return {
    // Estados
    disciplines,
    modules,
    professors,
    qrCodeSessions,
    statistics,
    loading,
    error,
    
    // Ações
    loadAllData,
    createDiscipline,
    createModule,
    generateQRCode,
    generateBulkQRCodes,
    clearError,
    
    // Funções auxiliares
    getDisciplineById,
    getModuleById,
    getProfessorById,
  };
}