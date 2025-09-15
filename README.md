# Shadow Finance System- Assistente Financeiro

![Imagem do WhatsApp de 2025-06-30 à(s) 18 48 29_6f1ce7f1](https://github.com/user-attachments/assets/eac28cd8-9f51-4c68-9b37-25802b44af69)

## 🚀 Sobre o Projeto

**Shadow Finance** é um assistente financeiro completo, projetado para oferecer uma visão clara e controle total sobre a vida financeira do usuário, com foco em investimentos, dividendos e despesas.

Este repositório contém o código do **Front-End**, desenvolvido com **Next.js**, que consome uma API RESTful construída separadamente com Django REST Framework.

---

## 🌟 Principais Funcionalidades (Frontend)

- **🔐 Autenticação Segura:** Tela de login com uma interface moderna e segura para acesso ao sistema.
- **📈 Painel de Controle:** Uma central de navegação intuitiva para acesso a todas as funcionalidades do sistema.
- **💰 Gestão de Dividendos:**
    - CRUD completo para registro de proventos recebidos.
    - Filtros dinâmicos por ano e mês.
    - Paginação para lidar com grandes volumes de dados.
    - Componentes reutilizáveis (modais, cards) para uma experiência de usuário consistente.
    - Sincronização automática do estado da UI com a API após cada operação.
- **Gestão de Despesas:**
    - CRUD completo para despesas simples
    - Filtros por datas(mês/ano) + status(todos, concluidos, pendentes)
    - Despesa parcelada que cria automaticamente despesas simples
    - Despesa Recorrente que se repete todos os meses utilizando virtualização de dados
- **📱 Design 100% Responsivo:** Interface totalmente adaptada para uma experiência perfeita em desktops e dispositivos móveis.

---

## 🌟 Principais Funcionalidades (Backend)

- **🔐 Autenticação com JWT:** Sistema de autenticação completo com tokens de acesso e de atualização (`refresh tokens`) usando a biblioteca `djangorestframework-simplejwt`.
- **🛡️ Endpoints Seguros:** Cada endpoint é protegido, garantindo que apenas usuários autenticados possam realizar operações. A lógica de negócio assegura o isolamento total dos dados entre os usuários.
- **📈 CRUD Completo:** Endpoints RESTful completos para todas as entidades principais do sistema:
- **⚙️ Paginação e Filtragem:** Suporte nativo para paginação e filtragem nos endpoints de listagem, garantindo alta performance mesmo com grandes volumes de dados.
- **✅ Validação de Dados:** Regras de validação robustas no nível do modelo e do serializer para garantir a integridade e a consistência dos dados.

---

## 🛠️ Tecnologias Utilizadas (Frontend)

| Tecnologia | Propósito |
|---|---|
| **React & Next.js** | Framework principal para construção da interface e renderização. |
| **Tailwind CSS** | Framework CSS para estilização rápida e consistente. |
| **Axios** | Cliente HTTP para consumo da API back-end. |
| **Zustand** | Gerenciamento de estado global da aplicação. |
| **ShadcnUI** | biblioteca de componentes UI moderna baseada em Tailwind. |


---

## 🛠️ Tecnologias Utilizadas (Backend)

| Tecnologia | Propósito |
|---|---|
| **Python** | Linguagem de programação principal. |
| **Django** | Framework web robusto para a estrutura do projeto. |
| **Django REST Framework (DRF)** | Toolkit poderoso para construir APIs Web. |
| **Simple JWT** | Para implementação da autenticação baseada em JSON Web Tokens. |
| **django-filter** | Para adicionar suporte a filtragem avançada nos endpoints. |
| **django-cors-headers** | Para gerenciar as permissões de Cross-Origin Resource Sharing (CORS). |
| **Postgres** | Banco de dados Robusto e Escalável |

---

## ⚙️ Como Rodar o Projeto (Front-End)

**Pré-requisitos:**
- Node.js e npm/yarn instalados.
- Uma instância do back-end (API) rodando.

**Passos:**
1.  Clone o repositório: `git clone https://github.com/DanielErick-dev/Shadow-Finance-system.git`
2.  Navegue até o diretório do projeto: `cd Shadow-Finance-system`
3.  Instale as dependências: `npm install`
4.  Crie um arquivo `.env.local` baseado no `.env.example`.
5.  Configure a variável de ambiente para apontar para a sua API: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
6.  Execute o servidor de desenvolvimento: `npm run dev`
7.  Acesse `http://localhost:3000` no seu navegador.

---

## ⚙️ Como Rodar o Projeto (Back-End)

**Pré-requisitos:**
- Python 3.x instalado.
- Um gerenciador de pacotes como `pip`.

**Passos:**
1.  Clone o repositório:
    ```bash
    git clone https://github.com/DanielErick-dev/Shadow-Finance-system-back.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd Shadow-Finance-System-back
    ```
3.  Crie e ative um ambiente virtual:
    ```bash
    # No Windows
    python -m venv venv
    .\venv\Scripts\activate

    # No macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
4.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
5.  Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` e configure suas variáveis de ambiente

6.  Aplique as migrações do banco de dados:
    ```bash
    python manage.py migrate
    ```
7.  Crie um superusuário para acessar a área administrativa:
    ```bash
    python manage.py createsuperuser
    ```
8.  Execute o servidor de desenvolvimento:
    ```bash
    # Para acesso local e de outros dispositivos na mesma rede
    python manage.py runserver 0.0.0.0:8000
    ```
9.  A API estará disponível em `http://127.0.0.1:8000/api/v1/`.

---

## 📝 Roadmap e Próximos Passos
- [ ] Desenvolvimento de endpoints de agregação para o **Dashboard**.
- [ ] Desenvolvimento do **Dashboard** com gráficos e estatísticas.

