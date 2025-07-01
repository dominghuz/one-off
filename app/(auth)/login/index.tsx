import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateUser } from '../../../lib/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const result = await authenticateUser(email.trim(), password);
      
      if (result) {
        // Mark onboarding as completed
        await AsyncStorage.setItem('onboardingCompleted', 'true');
        
        // Redirect based on user type
        if (result.type === 'coordenador') {
          router.replace('/(coordinator)/dashboard');
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userType: 'professor' | 'coordinator') => {
    if (userType === 'professor') {
      setEmail('joao@ispozango.ao');
      setPassword('123456');
    } else {
      setEmail('coordenador@ispozango.ao');
      setPassword('coord123');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ 
              borderRadius: 50, 
              backgroundColor: '#10B98120', 
              padding: 16, 
              marginBottom: 16 
            }}>
              <Ionicons name="school" size={48} color="#10B981" />
            </View>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: 8 
            }}>
              Bem-vindo
            </Text>
            <Text style={{ 
              color: '#6B7280', 
              textAlign: 'center' 
            }}>
              Sistema de Gestão Acadêmica
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ marginBottom: 24 }}>
            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: 8 
              }}>
                Email
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: 8, 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                paddingHorizontal: 12, 
                paddingVertical: 12 
              }}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    color: '#111827' 
                  }}
                  placeholder="seu.email@ispozango.ao"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: 8 
              }}>
                Senha
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: 8, 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                paddingHorizontal: 12, 
                paddingVertical: 12 
              }}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    color: '#111827' 
                  }}
                  placeholder="Sua senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              borderRadius: 8,
              paddingVertical: 16,
              marginBottom: 16,
              backgroundColor: loading ? '#9CA3AF' : '#10B981',
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ 
                color: 'white', 
                textAlign: 'center', 
                fontSize: 18, 
                fontWeight: '600' 
              }}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Login Section */}
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: '#E5E7EB', 
            paddingTop: 24 
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500', 
              color: '#374151', 
              textAlign: 'center', 
              marginBottom: 16 
            }}>
              Acesso Rápido para Demonstração
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => quickLogin('professor')}
                disabled={loading}
                style={{ 
                  flex: 1, 
                  borderRadius: 8, 
                  backgroundColor: '#DBEAFE', 
                  padding: 12 
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="person" size={24} color="#3B82F6" />
                  <Text style={{ 
                    color: '#1D4ED8', 
                    fontWeight: '500', 
                    marginTop: 4 
                  }}>Professor</Text>
                  <Text style={{ 
                    color: '#2563EB', 
                    fontSize: 12, 
                    marginTop: 4 
                  }}>João Silva</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => quickLogin('coordinator')}
                disabled={loading}
                style={{ 
                  flex: 1, 
                  borderRadius: 8, 
                  backgroundColor: '#F3E8FF', 
                  padding: 12 
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="settings" size={24} color="#8B5CF6" />
                  <Text style={{ 
                    color: '#7C3AED', 
                    fontWeight: '500', 
                    marginTop: 4 
                  }}>Coordenador</Text>
                  <Text style={{ 
                    color: '#8B5CF6', 
                    fontSize: 12, 
                    marginTop: 4 
                  }}>Dr. António</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Credentials Info */}
          <View style={{ 
            marginTop: 24, 
            borderRadius: 8, 
            backgroundColor: '#EFF6FF', 
            padding: 16 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: '#1E3A8A', 
                  marginBottom: 4 
                }}>
                  Credenciais de Demonstração
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: '#1D4ED8', 
                  lineHeight: 16 
                }}>
                  <Text style={{ fontWeight: '500' }}>Professor:</Text> joao@ispozango.ao / 123456{'\n'}
                  <Text style={{ fontWeight: '500' }}>Coordenador:</Text> coordenador@ispozango.ao / coord123
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 32 }}>
            <Text style={{ 
              textAlign: 'center', 
              fontSize: 12, 
              color: '#9CA3AF' 
            }}>
              Sistema de Gestão Acadêmica v2.0
            </Text>
            <Text style={{ 
              textAlign: 'center', 
              fontSize: 12, 
              color: '#D1D5DB', 
              marginTop: 4 
            }}>
              ISPOZANGO - {new Date().getFullYear()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}