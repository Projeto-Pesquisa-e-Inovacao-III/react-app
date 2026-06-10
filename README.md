# CSF Treinamentos - Frontend

Plataforma de gestão de treinamentos e serviços fitness, desenvolvida com React, TypeScript e Vite. O sistema oferece uma interface robusta para a gestão de alunos, personal trainers e administradores.

## 🚀 Sobre o Projeto

O **CSF Treinamentos** é uma aplicação web projetada para centralizar a gestão de atividades físicas, agendamentos e acompanhamento de progresso. A plataforma utiliza um sistema de controle de acesso baseado em funções (RBAC), garantindo que cada tipo de usuário tenha acesso às ferramentas específicas para suas necessidades.

## ✨ Funcionalidades

### 👤 Aluno
- **Acompanhamento de Planos:** Visualização do histórico de planos e detalhes de assinaturas.
- **Agendamentos:** Consulta e gestão de histórico de aulas agendadas.
- **Anamnese:** Preenchimento e edição de informações de saúde e histórico físico.
- **Perfil:** Gestão de dados pessoais, endereços e informações de segurança.

### 🏋️ Personal Trainer
- **Gestão de Alunos:** Visualização de dados dos alunos vinculados.
- **Disponibilidade:** Configuração de horários disponíveis para atendimento.
- **Agenda:** Consulta e acompanhamento de agendamentos realizados pelos alunos.

### 🛡️ Administrador
- **Dashboard:** Painel de métricas e indicadores de desempenho da plataforma.
- **Gestão de Usuários:** Cadastro de novos personal trainers e visualização completa de dados de usuários.
- **Controle Total:** Acesso a todas as funcionalidades de gestão e configuração do sistema.

## 🛠️ Tecnologias Utilizadas

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/), [Material UI (MUI) 7](https://mui.com/), [Emotion](https://emotion.sh/)
- **Gerenciamento de Estado e Dados:** [TanStack Query (React Query)](https://tanstack.com/query/latest), [React Context API]
- **Roteamento:** [React Router 7](https://reactrouter.com/)
- **Componentes e UI:** [Lucide React](https://lucide.dev/), [Embla Carousel](https://www.embla-carousel.com/), [FullCalendar](https://fullcalendar.io/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ferramentas:** [Axios](https://axios-http.com/), [Date-fns](https://date-fns.org/), [SweetAlert2](https://sweetalert2.github.io/)

## 📦 Instalação e Configuração

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão recomendada no `package.json`)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd react-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build`: Compila o projeto para produção (gera a pasta `dist/`).
- `npm run lint`: Executa o ESLint para verificar a qualidade do código.
- `npm run preview`: Visualiza localmente o build de produção.


## 📁 Estrutura de Pastas

```text
src/
├── components/ # Componentes reutilizáveis de UI
├── constants/  # Constantes de configuração e textos
├── hooks/      # Hooks customizados
├── models/     # Definições de tipos e interfaces
├── routes/     # Páginas e componentes de rota
├── services/   # Integração com APIs e autenticação
└── utils/      # Funções utilitárias e helpers
```

## 📄 Licença

Este projeto está sob a licença [LICENSE](LICENSE).
