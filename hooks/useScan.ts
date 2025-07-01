import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  registrarPresenca, 
  getQRCodeSessionById, 
  getModuleById,
  getProfessorById 
} from '../lib/database';

export interface ScanResult {
  type: string;
  moduleId: number;
  date: string;
  sessionId: number;
  expiresAt: string;
  moduleName?: string;
  professorName?: string;
}

export function useScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScanPress = () => {
    setScanError(null);
    setIsScanning(true);
  };

  const handleCloseScan = () => {
    setIsScanning(false);
    setScanResult(null);
    setScanError(null);
  };

  const validateQRCode = (data: string): ScanResult | null => {
    try {
      // Try to parse as JSON first (new format)
      const parsed = JSON.parse(data);
      
      if (parsed.type === 'presence' && parsed.moduleId && parsed.sessionId) {
        // Check if QR Code is expired
        const expiresAt = new Date(parsed.expiresAt);
        const now = new Date();
        
        if (now > expiresAt) {
          throw new Error('QR Code expirado. Solicite um novo QR Code ao coordenador.');
        }

        // Check if the date matches today (optional validation)
        const qrDate = new Date(parsed.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        qrDate.setHours(0, 0, 0, 0);
        
        if (qrDate.getTime() !== today.getTime()) {
          throw new Error('Este QR Code é para uma data diferente de hoje.');
        }

        return {
          type: parsed.type,
          moduleId: parsed.moduleId,
          date: parsed.date,
          sessionId: parsed.sessionId,
          expiresAt: parsed.expiresAt,
        };
      } else {
        throw new Error('QR Code inválido. Formato não reconhecido.');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Not JSON, try legacy format or simple text
        if (data.includes('modulo') || data.includes('aula')) {
          throw new Error('QR Code em formato antigo. Solicite um novo QR Code ao coordenador.');
        } else {
          throw new Error('QR Code inválido. Não é um QR Code de presença.');
        }
      } else {
        throw error;
      }
    }
  };

  const handleBarcodeScanned = async (data: string) => {
    try {
      setLoading(true);
      setScanError(null);

      // Validate QR Code format and expiration
      const validatedData = validateQRCode(data);
      
      if (!validatedData) {
        throw new Error('QR Code inválido');
      }

      // Get additional module information
      const module = await getModuleById(validatedData.moduleId);
      if (!module) {
        throw new Error('Módulo não encontrado. Contacte o coordenador.');
      }

      // Get professor information
      const professor = await getProfessorById(module.professorId);
      
      // Add module and professor names to scan result
      const enrichedResult: ScanResult = {
        ...validatedData,
        moduleName: module.name,
        professorName: professor?.name || 'Professor não encontrado',
      };

      setScanResult(enrichedResult);
      setIsScanning(false);
    } catch (error) {
      console.error('QR Code scan error:', error);
      setScanError(error instanceof Error ? error.message : 'Erro ao processar QR Code');
      setIsScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPresence = async () => {
    if (!scanResult) {
      setScanError('Nenhum QR Code escaneado');
      return;
    }

    try {
      setLoading(true);
      setScanError(null);

      // Get current user (professor) ID from auth token
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken || !authToken.startsWith('professor-')) {
        throw new Error('Usuário não autenticado como professor');
      }

      const professorId = parseInt(authToken.replace('professor-', ''));

      // Verify QR Code session exists and is valid
      const qrSession = await getQRCodeSessionById(scanResult.sessionId);
      if (!qrSession) {
        throw new Error('Sessão de QR Code não encontrada');
      }

      // Check if QR Code is still valid
      const now = new Date();
      if (now > new Date(qrSession.expiresAt)) {
        throw new Error('QR Code expirado');
      }

      // Register presence
      const presenca = await registrarPresenca(
        professorId,
        scanResult.moduleId,
        scanResult.sessionId,
        now
      );

      // Show success message
      const module = await getModuleById(scanResult.moduleId);
      const atrasoMessage = presenca.atraso > 0 
        ? ` (${presenca.atraso} minutos de atraso)`
        : ' (no horário)';

      setScanResult(null);
      setScanError(null);
      
      // You might want to show a success toast or alert here
      console.log(`Presença registrada com sucesso para ${module?.name}${atrasoMessage}`);
      
    } catch (error) {
      console.error('Presence registration error:', error);
      setScanError(error instanceof Error ? error.message : 'Erro ao registrar presença');
    } finally {
      setLoading(false);
    }
  };

  return {
    isScanning,
    scanResult,
    scanError,
    loading,
    setScanResult,
    setScanError,
    handleScanPress,
    handleBarcodeScanned,
    handleConfirmPresence,
    handleCloseScan,
  };
}

