# Implementação de QR Code Scanner com Expo Camera

## Resumo da Pesquisa

Baseado na documentação oficial do Expo Camera e nas melhores práticas encontradas, aqui está o plano para implementar a leitura real de QR Code via câmera:

## 1. Dependências Necessárias

```bash
npx expo install expo-camera
```

## 2. Configuração de Permissões

### app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": false
        }
      ]
    ]
  }
}
```

## 3. Implementação do Scanner

### Componente QRScanner

```typescript
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QRScannerProps {
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onBarcodeScanned, onClose }: QRScannerProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      onBarcodeScanned(data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}>
              <Text style={styles.scanText}>Posicione o QR Code aqui</Text>
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.text}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 200,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

## 4. Integração com o Hook useScan

### Atualização do useScan.ts

```typescript
import { useState } from 'react';
import { registrarPresenca } from '../lib/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  };

  const handleBarcodeScanned = (data: string) => {
    setIsScanning(false);
    
    try {
      // Tentar fazer parse do QR Code (assumindo formato JSON)
      const qrData = JSON.parse(data);
      
      if (qrData.module && qrData.time) {
        setScanResult({
          module: qrData.module,
          time: qrData.time,
          date: new Date().toLocaleDateString('pt-AO'),
          isValid: true
        });
      } else {
        setScanError('QR Code inválido. Verifique se é um código de presença válido.');
      }
    } catch (error) {
      setScanError('QR Code inválido. Formato não reconhecido.');
    }
  };

  const handleConfirmPresence = async () => {
    if (!scanResult) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setScanError('Usuário não autenticado');
        return;
      }

      const professorId = parseInt(token.replace('token-', ''));
      
      if (isNaN(professorId)) {
        setScanError('Token inválido');
        return;
      }

      const presenca = await registrarPresenca(
        professorId,
        scanResult.module,
        scanResult.time,
        new Date()
      );

      console.log("Presença registrada com sucesso:", presenca);
      setScanResult(null);
      
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      setScanError('Erro ao registrar presença. Tente novamente.');
    }
  };

  const handleCloseScan = () => {
    setIsScanning(false);
    setScanError(null);
  };

  return {
    isScanning,
    scanResult,
    setScanResult,
    handleScanPress,
    handleBarcodeScanned,
    handleConfirmPresence,
    handleCloseScan,
    scanError,
    setScanError
  };
}
```

## 5. Atualização da Tela Home

### Modificações no HomeScreen

```typescript
// Adicionar import do QRScanner
import { QRScanner } from '../components/QRScanner';

// No componente HomeScreen, substituir a área de scan por:
{isScanning ? (
  <QRScanner 
    onBarcodeScanned={handleBarcodeScanned}
    onClose={handleCloseScan}
  />
) : scanResult ? (
  <ConfirmationModal 
    scanResult={scanResult}
    onConfirm={handleConfirmPresence}
    onCancel={() => setScanResult(null)}
  />
) : (
  // ... resto do código existente
)}
```

## 6. Formato do QR Code

O QR Code gerado pelo administrador deve ter o formato JSON:

```json
{
  "module": "Matemática",
  "time": "Manhã",
  "classroom": "Sala 101",
  "date": "2025-06-30",
  "valid_until": "2025-06-30T10:00:00Z"
}
```

## 7. Próximos Passos

1. Instalar a dependência expo-camera
2. Configurar as permissões no app.json
3. Executar `npx expo prebuild --clean` para aplicar as mudanças
4. Criar o componente QRScanner
5. Atualizar o hook useScan
6. Modificar a tela Home para usar o scanner real
7. Testar em dispositivo físico (câmera não funciona em simulador)

## 8. Considerações Importantes

- A funcionalidade de câmera só funciona em dispositivos físicos, não em simuladores
- É necessário rebuild do app após adicionar as permissões
- O QR Code deve estar bem iluminado e focado para melhor leitura
- Implementar validação de data/hora para evitar QR Codes expirados

