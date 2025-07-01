import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  degree?: string;
  institution?: string;
  modules?: string[];
  todayModules?: number;
  confirmedPresences?: number;
  currentSalary?: number;
}

interface AuthContextType {
  user: User | null;
  userType: 'professor' | 'coordenador' | null;
  login: (token: string, userData: User, type: 'professor' | 'coordenador') => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'professor' | 'coordenador' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const storedUserType = await AsyncStorage.getItem('userType');
      const userId = await AsyncStorage.getItem('userId');

      if (token && storedUserType && userId) {
        // Carregar dados do usuário baseado no tipo
        if (storedUserType === 'professor') {
          const professorsData = await AsyncStorage.getItem('professors');
          if (professorsData) {
            const professors = JSON.parse(professorsData);
            const professor = professors.find((p: any) => p.id === parseInt(userId));
            if (professor) {
              setUser(professor);
              setUserType('professor');
            }
          }
        } else if (storedUserType === 'coordenador') {
          const coordenadoresData = await AsyncStorage.getItem('coordenadores');
          if (coordenadoresData) {
            const coordenadores = JSON.parse(coordenadoresData);
            const coordenador = coordenadores.find((c: any) => c.id === parseInt(userId));
            if (coordenador) {
              setUser(coordenador);
              setUserType('coordenador');
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, userData: User, type: 'professor' | 'coordenador') => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userType', type);
      await AsyncStorage.setItem('userId', userData.id.toString());
      
      setUser(userData);
      setUserType(type);
      
      console.log('Usuário logado:', userData, 'Tipo:', type);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userType', 'userId']);
      setUser(null);
      setUserType(null);
      console.log('Usuário deslogado');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);