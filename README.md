# 🧾 Sistema de Ordem e Gerenciamento

Este projeto é um sistema completo de ordem e gerenciamento, com **back-end em Python (FastAPI)** e **front-end em Next.js**, oferecendo uma interface moderna, responsiva e intuitiva para diferentes tipos de usuários como funcionários, supervisores e gerentes.

---

## 🚀 Tecnologias Utilizadas

### 🔧 Back-End (API)
- **[FastAPI](https://fastapi.tiangolo.com/)** – Framework rápido e moderno para APIs com Python
- **[SQLAlchemy](https://www.sqlalchemy.org/)** – ORM para modelagem e conexão com banco de dados
- **[Pydantic](https://docs.pydantic.dev/)** – Validação de dados com Python
- **[Uvicorn](https://www.uvicorn.org/)** – Servidor ASGI leve e de alta performance
- **[SQLite](https://www.sqlite.org/)** – Banco de dados leve utilizado para ambiente local e desenvolvimento

### 🎨 Front-End (Next.js)

- **[Next.js](https://nextjs.org/)** – Framework React para aplicações web otimizadas
- **[TypeScript](https://www.typescriptlang.org/)** – Linguagem com tipagem estática que melhora a escalabilidade e manutenção do código
- **[shadcn/ui](https://ui.shadcn.com/)** – Componentes UI modernos e personalizáveis
- **[Tailwind CSS](https://tailwindcss.com/)** – Utilitário de classes para estilização rápida e responsiva
- **[React Hook Form](https://react-hook-form.com/)** – Gerenciamento de formulários em React
- **[Zod](https://zod.dev/)** – Validação de schemas no front-end integrada ao React Hook Form
- **[Axios](https://axios-http.com/)** – Cliente HTTP para comunicação com o back-end
- **Pages Router** do Next.js – Navegação entre páginas baseada em arquivos




---

## 🗃️ Banco de Dados

O projeto utiliza **SQLite** como banco de dados principal durante o desenvolvimento. A integração é feita via **SQLAlchemy**, o que permite adaptar facilmente para outros bancos como PostgreSQL ou MySQL, caso necessário em produção.

### Estrutura básica:
- Tabelas de usuários, ordens e perfis (funcionário, supervisor, gerente)
- Relacionamentos definidos com ORM
- Migrações podem ser gerenciadas com ferramentas como Alembic (não incluído inicialmente)

---

## 📁 Estrutura do Projeto

.
├── api/
│ ├── main.py
│ ├── models.py
│ ├── database.py
│ └── ...
├── frontend-app/
│ ├── pages/
│ ├── components/
│ ├── public/
│ └── ...
└── README.md


---

## 📄 Funcionalidades

- Página de Login
- Página de Cadastro
- Dashboard principal
- Página de Funcionários
- Página de Supervisores
- Página de Gerentes

---

## 🛠️ Como Instalar o Projeto

### 🔙 Back-End (FastAPI + SQLAlchemy)

1. Acesse a pasta do back-end:
   ```bash
   cd api
    pip install fastapi sqlalchemy pydantic uvicorn
    cd app
    python -m uvicorn main:app --reload


### 🔜 Front-End (Next.js)

1. Acesse a pasta do front-end
```bash
    npm install
    npm run build
    npm run dev
```

### 🌐 Fluxo da Aplicação
O sistema foi pensado para atender diferentes tipos de usuários com acesso direcionado e permissões distintas:

- Cadastro: Cadastrar o usuário para ter uma conta para acessar a aplicação

- Login: Logar com o usuário para entrar na aplicação

- Funcionário: Criação e visualização de ordens

- Supervisor: Gerenciamento das ordens e acompanhamento da equipe

- Gerente: Acesso completo com controle total do sistema e geração de relatórios

📌 Requisitos
-Node.js v18 ou superior

- Python 3.9 ou superior

- Navegador moderno (Chrome, Firefox, Edge, etc.)

📄 Licença
Este projeto está licenciado sob os termos da MIT License.
