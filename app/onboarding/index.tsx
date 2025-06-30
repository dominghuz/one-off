import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';
import type { ColorValue } from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  const animationRefs = [
    useRef<LottieView>(null),
    useRef<LottieView>(null),
    useRef<LottieView>(null),
    useRef<LottieView>(null)
  ];

  const slides: {
    title: string;
    description: string;
    animation: any;
    color: readonly [ColorValue, ColorValue, ...ColorValue[]];
    animationStyle: object;
  }[] = [
    {
      title: "Registro de Presença",
      description: "Registre sua presença em segundos com a leitura do QR Code exclusivo da sala de aula.",
      // animation: require('../../assets/animations/splash.json'),
      animation: require('../../assets/animations/qr-code.json'),
      color: ['#10B981', '#059669'] as const,
      animationStyle: { width: width * 0.8, height: width * 0.8 }
    },
    {
      title: "Controle de Aulas",
      description: "Acompanhe seus módulos lecionados por período (manhã, tarde e noite) de forma organizada.",
      animation: require('../../assets/animations/schedule.json'),
      color: ['#3B82F6', '#2563EB'] as const,
      animationStyle: { width: width * 0.9, height: width * 0.6 }
    },
    {
      title: "Relatórios Detalhados",
      description: "Acesse relatórios completos de presença, salário e desempenho em diferentes períodos.",
      animation: require('../../assets/animations/data-report.json'),
      color: ['#8B5CF6', '#7C3AED'] as const,
      animationStyle: { width: width * 0.8, height: width * 0.5 }
    },
    {
      title: "Cálculo Automático",
      description: "Seu salário é calculado automaticamente com base no grau acadêmico e módulos lecionados.",
      animation: require('../../assets/animations/salary-calculation.json'),
      color: ['#FFD700', '#FFA500'] as const,
      animationStyle: { width: width * 0.8, height: width * 0.6 }
    }
  ];

  const handleIndexChanged = (index: number) => {
    // Reinicia a animação anterior
    animationRefs.forEach(ref => ref.current?.reset());
    // Inicia a animação atual
    animationRefs[index]?.current?.play();
  };

  const completeOnboarding = () => {
    // Marcar onboarding como completo no AsyncStorage
    // Navegar para a tela de login
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        onIndexChanged={handleIndexChanged}
        showsPagination={true}
        paginationStyle={styles.pagination}
        dotColor="rgba(255, 255, 255, 0.4)"
        activeDotColor="#ffffff"
      >
        {slides.map((slide, index) => (
          <LinearGradient
            key={index}
            colors={slide.color}
            style={styles.slide}
          >
            <View style={styles.content}>
              <LottieView
                ref={animationRefs[index]}
                source={slide.animation}
                autoPlay={index === 0}
                loop={false}
                style={[styles.animation, slide.animationStyle]}
                resizeMode="contain"
              />
              
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>

              {index === slides.length - 1 && (
                <TouchableOpacity 
                  style={styles.getStartedButton}
                  onPress={completeOnboarding}
                >
                  <Text style={styles.buttonText}>Começar Agora</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40
  },
  animation: {
    marginBottom: 30
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24
  },
  getStartedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  pagination: {
    bottom: 40
  }
});

export default OnboardingScreen;