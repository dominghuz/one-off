import { Platform } from 'react-native';

// Detectar se estamos no ambiente web
const isWeb = Platform.OS === 'web';

// Importar a versão apropriada baseada no ambiente
let databaseModule: any;

if (isWeb) {
  // Para web, usar a versão com localStorage
  databaseModule = require('./database-web');
} else {
  // Para mobile, usar a versão com Prisma (quando disponível)
  // Por enquanto, usar também a versão web como fallback
  databaseModule = require('./database-web');
}

// Re-exportar todas as funções
export const initializeDatabase = databaseModule.initializeDatabase;
export const authenticateUser = databaseModule.authenticateUser;
export const registrarPresenca = databaseModule.registrarPresenca;
export const getPresencasProfessor = databaseModule.getPresencasProfessor;
export const calcularSalario = databaseModule.calcularSalario;
export const prisma = databaseModule.prisma;

