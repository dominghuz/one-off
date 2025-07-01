# Requisitos do Perfil Coordenador

## 1. Estado Atual do Projeto

O aplicativo atual, desenvolvido em React Native (Expo), foca no perfil do **Professor** e oferece as seguintes funcionalidades:

- **Autenticação:** Login de professores com credenciais pré-definidas (joao@ispozango.ao, maria@ispozango.ao com senha 123456).
- **Persistência de Dados:** Utiliza `AsyncStorage` para simular um banco de dados local, armazenando informações de professores e presenças.
- **Registro de Presença:** Permite que o professor escaneie um QR Code para registrar sua presença em um módulo/aula.
- **Cálculo de Atraso:** A lógica de registro de presença inclui um cálculo simplificado de atraso.
- **Cálculo de Salário:** Baseado nas presenças registradas e no nível acadêmico do professor.
- **Interface de Usuário:** Telas de login, home com status do dia (módulos, presenças, salário) e um modal de scanner de QR Code em tela cheia.
- **Tecnologias:** React Native, Expo, AsyncStorage, Tailwind CSS (para estilização).

## 2. Requisitos para o Perfil Coordenador

O objetivo é adicionar um novo perfil de usuário, o **Coordenador**, com funcionalidades administrativas e de gerenciamento. Este perfil será fundamental para a gestão acadêmica e a geração de dados para estatísticas reais.

### 2.1. Funcionalidades Principais

#### 2.1.1. Gerenciamento de Módulos e Disciplinas
O Coordenador deverá ser capaz de:
- **Adicionar novos módulos/disciplinas:** Incluindo nome, descrição, professor(es) associado(s), horário, dias da semana e sala.
- **Visualizar módulos/disciplinas existentes:** Listar todos os módulos/disciplinas cadastrados.
- **Editar módulos/disciplinas:** Modificar informações de módulos/disciplinas existentes.
- **Remover módulos/disciplinas:** Excluir módulos/disciplinas do sistema.

#### 2.1.2. Geração de QR Codes
O Coordenador precisará de uma ferramenta para gerar QR Codes para cada aula/módulo. Estes QR Codes deverão conter informações essenciais para o registro de presença, como:
- **ID do Módulo/Disciplina:** Para identificar a qual aula o QR Code pertence.
- **Data e Hora:** Para validar a presença em um horário específico.
- **Informações da Sala:** Opcional, mas útil para validação.

#### 2.1.3. Gerenciamento de Professores
Embora o foco principal seja módulos e QR Codes, o Coordenador pode precisar de funcionalidades básicas de gerenciamento de professores, como:
- **Visualizar lista de professores:** Apenas para referência.
- **Associar professores a módulos/disciplinas:** Definir qual professor ministra qual módulo.

#### 2.1.4. Estatísticas e Relatórios
Esta é uma funcionalidade crucial para o Coordenador, permitindo uma visão geral e detalhada dos dados de presença e desempenho.
- **Total de Presenças:** Número total de presenças registradas por período (dia, semana, mês).
- **Presenças por Módulo/Disciplina:** Quantidade de presenças em cada módulo/disciplina.
- **Presenças por Professor:** Desempenho de presença de cada professor.
- **Taxa de Atraso:** Percentual de atrasos por professor e por módulo.
- **Relatórios de Salário:** Visão consolidada dos salários calculados para os professores.
- **Visualização de Dados:** Apresentação dos dados de forma clara e organizada, possivelmente com gráficos simples.

### 2.2. Autenticação e Permissões
- Será necessário um sistema de autenticação para o Coordenador, separado do login do Professor.
- O Coordenador terá acesso a funcionalidades restritas, enquanto o Professor terá acesso apenas às suas funcionalidades de registro de presença e visualização de status.

### 2.3. Impacto no Modelo de Dados (AsyncStorage)
As novas funcionalidades exigirão a expansão do modelo de dados atual para incluir:
- **Entidade Coordenador:** Para armazenar credenciais e informações do Coordenador.
- **Entidade Módulo/Disciplina:** Com campos para nome, descrição, professor(es) associado(s), horário, dias, sala.
- **Entidade Aula/Sessão:** Para registrar instâncias de aulas e associar QR Codes gerados.
- **Atualização da Entidade Presença:** Para vincular a presenças a módulos/aulas específicos.

### 2.4. Considerações Técnicas
- **Backend:** Continuaremos utilizando `AsyncStorage` para a persistência de dados local, expandindo a lógica existente para gerenciar as novas entidades.
- **Frontend:** Novas telas e componentes serão desenvolvidos para o perfil Coordenador, incluindo formulários de cadastro, listagens e dashboards de estatísticas.
- **Geração de QR Code:** A geração será feita no frontend, com a possibilidade de exportar a imagem do QR Code.

Esta é uma visão geral dos requisitos. À medida que avançamos, mais detalhes serão definidos.

