import React, { createContext, useContext, useState } from 'react';

export interface User {
  name: string;
  avatar: string;
  degree: string;
  modules: string[];
  todayModules: number;
  confirmedPresences: number;
  currentSalary: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (token: string, userData: User) => {
    // Aqui você pode salvar o token no AsyncStorage, por exemplo
    setUser(userData);
    console.log('Usuário logado:', userData);
  };

  const signOut = () => {
    setUser(null);
    console.log('Usuário deslogado');
  };

  return (
    <AuthContext.Provider value={{ user, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
