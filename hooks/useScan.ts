import { useState } from 'react';

type ScanResult = {
  module: string;
  time: string;
  date: string;
  isValid: boolean;
} | null;

export function useScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>(null);
  const [scanError, setScanError] = useState<null | string>(null);

  const handleScanPress = () => {
    setIsScanning(true);
    setScanError(null);
    
    // Simulando o processo de escaneamento
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulando um QR code válido (em uma implementação real, isso viria do scanner)
      const randomModule = ["Matemática", "Física", "Química"][Math.floor(Math.random() * 3)];
      const randomTime = ["Manhã", "Tarde", "Noite"][Math.floor(Math.random() * 3)];
      
      setScanResult({
        module: randomModule,
        time: randomTime,
        date: new Date().toLocaleDateString('pt-AO'),
        isValid: true
      });
    }, 2000);
  };

  const handleConfirmPresence = () => {
    console.log("Presença confirmada para:", scanResult);
    setScanResult(null);
  };

  return {
    isScanning,
    scanResult,
    setScanResult, // ✅ <-- ISSO AQUI
    handleScanPress,
    handleConfirmPresence,
    scanError,
    setScanError
  };
}
