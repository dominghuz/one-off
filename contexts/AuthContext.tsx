import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  avatar: string;
  degree: string;
  modules: string[];
  todayModules: number;
  confirmedPresences: number;
  currentSalary: number;
}

interface AuthContextType {
  user: User;
  signOut: () => void;
  login: (token: string, userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    name: '',
    avatar: '',
    degree: '',
    modules: [],
    todayModules: 0,
    confirmedPresences: 0,
    currentSalary: 0,
  },
  signOut: () => {},
  login: async () => {},
});

export function AuthProvider({ children }: React.PropsWithChildren<object>) {
  const [user, setUser] = useState({
    name: "Professor Exemplo",
    avatar: "https://github.com/dominghuz.png",
    degree: "Doutor",
    modules: ["Matemática", "Física"],
    todayModules: 2,
    confirmedPresences: 5,
    currentSalary: 35000
  });

  const signOut = () => {
    // Implementação real faria logout
    console.log("Usuário deslogado");
  };

  const login = async (token: string, userData: User) => {
    // Implementação real faria login
    setUser(userData);
    console.log("Usuário logado com token:", token);
  };

  return <AuthContext.Provider value={{ user, login, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}