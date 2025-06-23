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
}

const AuthContext = createContext<AuthContextType>({
  user: {
    name: "",
    avatar: "",
    degree: "",
    modules: [],
    todayModules: 0,
    confirmedPresences: 0,
    currentSalary: 0
  },
  signOut: () => {}
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

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}