# Checklist de Testes - Aplicativo de Presença

## 🔍 Testes de Código

### 1. Verificação de TypeScript
- [ ] Verificar tipos em todos os arquivos
- [ ] Resolver warnings de TypeScript
- [ ] Validar interfaces e tipos

### 2. Verificação de Dependências
- [ ] Verificar se expo-camera está instalado
- [ ] Verificar compatibilidade de versões
- [ ] Resolver conflitos de dependências

### 3. Verificação de Importações
- [ ] Verificar imports em QRScanner.tsx
- [ ] Verificar imports em useScan.ts
- [ ] Verificar imports em home.tsx

## 🧪 Testes Funcionais

### 1. Autenticação
- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Persistência de sessão
- [ ] Logout funcional

### 2. QR Code Scanner
- [ ] Abertura da câmera
- [ ] Permissões de câmera
- [ ] Leitura de QR Code JSON
- [ ] Leitura de QR Code texto simples
- [ ] Validação de QR Code expirado
- [ ] Validação de QR Code de data incorreta
- [ ] Cancelamento do scanner

### 3. Registro de Presença
- [ ] Confirmação de presença
- [ ] Cálculo de atraso
- [ ] Persistência no banco
- [ ] Feedback de sucesso/erro

### 4. Interface do Usuário
- [ ] Responsividade em diferentes tamanhos
- [ ] Navegação entre telas
- [ ] Estados de loading
- [ ] Tratamento de erros

## 🔧 Testes de Integração

### 1. Fluxo Completo
- [ ] Login → Home → Scanner → Confirmação → Sucesso
- [ ] Verificar dados persistidos
- [ ] Verificar cálculos de salário

### 2. Cenários de Erro
- [ ] Falha na câmera
- [ ] QR Code inválido
- [ ] Erro de rede/banco
- [ ] Permissões negadas

## 📱 Testes de Dispositivo

### 1. Ambiente Web
- [ ] Funcionamento com localStorage
- [ ] Fallback sem câmera
- [ ] Responsividade

### 2. Ambiente Mobile
- [ ] Funcionamento com Prisma
- [ ] Câmera real
- [ ] Permissões nativas

## 🐛 Problemas Identificados e Correções

### 1. Problemas Potenciais
- [ ] Expo Camera pode não funcionar em web
- [ ] Prisma pode ter problemas de compatibilidade
- [ ] Tipos TypeScript podem estar incorretos

### 2. Correções Implementadas
- [x] Fallback para web sem câmera
- [x] Sistema de detecção de ambiente
- [x] Validação robusta de QR Codes

## 📋 Checklist de Deploy

### 1. Preparação
- [ ] Instalar expo-camera
- [ ] Executar prebuild
- [ ] Testar em dispositivo real

### 2. Configurações
- [ ] Permissões configuradas
- [ ] Plugins corretos no app.json
- [ ] Variáveis de ambiente

### 3. Build
- [ ] Build de desenvolvimento funcional
- [ ] Build de produção testado
- [ ] Distribuição configurada

## 🎯 Critérios de Aceitação

### Funcionalidades Essenciais
- [x] Professor pode fazer login
- [x] Professor pode escanear QR Code
- [x] Sistema registra presença corretamente
- [x] Sistema calcula atraso automaticamente
- [x] Dados são persistidos localmente

### Funcionalidades Avançadas
- [x] Validação de QR Codes
- [x] Interface intuitiva
- [x] Tratamento de erros
- [x] Compatibilidade web/mobile

### Performance
- [ ] Tempo de resposta < 2s
- [ ] Scanner responsivo
- [ ] Interface fluida

## 📝 Notas de Teste

### Dados de Teste
- **Email:** joao@ispozango.ao
- **Senha:** 123456
- **QR Code JSON:** `{"module":"Matemática","time":"Manhã","classroom":"Sala 101"}`
- **QR Code Texto:** `Matemática|Manhã|Sala 101`

### Comandos de Teste
```bash
# Instalar dependências
npm install
npx expo install expo-camera

# Rebuild
npx expo prebuild --clean

# Executar
npx expo start

# Verificar tipos
npx tsc --noEmit
```

## ✅ Status dos Testes

- **Implementação:** ✅ Completa
- **Testes de Código:** 🔄 Em andamento
- **Testes Funcionais:** ⏳ Pendente
- **Testes de Dispositivo:** ⏳ Pendente
- **Deploy:** ⏳ Pendente

