import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  StatusBar,
  Dimensions,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QRScannerProps {
  visible: boolean;
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ visible, onBarcodeScanned, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onBarcodeScanned(data);
    }
  };

  const resetScan = () => {
    setScanned(false);
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <SafeAreaView style={styles.container}>
        {!permission ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando permissões da câmera...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.permissionContainer}>
            <View style={styles.permissionContent}>
              <Ionicons name="camera-outline" size={80} color="#10B981" />
              <Text style={styles.permissionTitle}>Acesso à Câmera</Text>
              <Text style={styles.permissionMessage}>
                Para registrar sua presença, precisamos acessar a câmera para escanear o QR Code da sala de aula.
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton} 
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Header com botão de fechar */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Scanner QR Code</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Câmera */}
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
              />
            </View>

            {/* Overlay com área de foco */}
            <View style={styles.overlay}>
              <View style={styles.overlayTop} />
              <View style={styles.overlayMiddle}>
                <View style={styles.overlaySide} />
                <View style={styles.scanArea}>
                  {/* Cantos do scanner */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View style={styles.overlaySide} />
              </View>
              <View style={styles.overlayBottom} />
            </View>

            {/* Instruções */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {scanned 
                  ? '✅ QR Code detectado!' 
                  : 'Posicione o QR Code dentro da área marcada'
                }
              </Text>
            </View>

            {/* Botões inferiores */}
            <View style={styles.bottomContainer}>
              {scanned && (
                <TouchableOpacity style={styles.rescanButton} onPress={resetScan}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.rescanButtonText}>Escanear Novamente</Text>
                </TouchableOpacity>
              )}
              
              <Text style={styles.helpText}>
                Mantenha o QR Code bem iluminado e focado
              </Text>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');
const scanAreaSize = Math.min(width, height) * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 30,
    borderRadius: 20,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionMessage: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
  },
  cancelButtonText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 38, // Mesmo tamanho do closeButton para centralizar o título
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 80, // Altura do header
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: scanAreaSize,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#10B981',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  rescanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  helpText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});
