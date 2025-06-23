import { useEffect, useState } from "react";
import { Link, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Não se esqueça de instalar a dependência

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Verifica se existe um token de autenticação no AsyncStorage
        const token = await AsyncStorage.getItem("authToken");
        setIsAuthenticated(!!token); // Se existir um token, o usuário está autenticado
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false); // Se ocorrer um erro, considerar como não autenticado
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return null; // Evita renderizar antes da verificação
  }

  // Faz o redirecionamento de acordo com o status da autenticação
  return (
    // <Redirect 
    // <Link href={"/(tabs)/home"}
    //   className="flex-1 items-center justify-center"
    //   >
    //   Redirecting...
    // </Link>
    // <Link href={isAuthenticated ? "/(tabs)/home" : "/(auth)/login"}>
    //   Redirecting...
    // </Link>
    <Redirect
      href={isAuthenticated ? "/(root)/(tabs)/home" : "/(root)/(tabs)/home"}
    />
    // // <Link href={isAuthenticated ? "/(tabs)/home" : "/(auth)/login"}>
    // //   Redirecting... 
    // <Link href={'/(tabs)/home'}>

    // </Link>


  );
}
