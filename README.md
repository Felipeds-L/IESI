# IESI - Sistema de Gestão Hospitalar 🏥

![Status](https://img.shields.io/badge/Status-Funcional-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Tech](https://img.shields.io/badge/NodeJS-TypeScript-yellow)

O **IESI** é uma plataforma completa para gestão hospitalar. O sistema gerencia o cadastro de pessoas (médicos, enfermeiros e pacientes), controle de acesso e fluxos administrativos.

O diferencial deste projeto é a adoção rigorosa da **Clean Architecture** (Arquitetura Limpa), garantindo que as regras de negócio (Domínio) sejam independentes de frameworks, banco de dados ou interfaces externas. Todo o ambiente é containerizado com **Docker**, facilitando o deploy e a execução.

---

## Tecnologias e Arquitetura

O sistema foi desenhado para ser modular e escalável:

### Back-end (Clean Architecture)
- **Linguagem:** Node.js com TypeScript.
- **Framework Web:** Express.
- **ORM:** Prisma (Gerenciamento de banco de dados e Migrations).
- **Autenticação:** JWT (JSON Web Token) e Bcrypt para hash de senhas.
- **Camadas:**
  - *Domain:* Entidades e interfaces (sem dependências externas).
  - *Application:* Casos de uso (Use Cases).
  - *Infra:* Repositórios concretos (Prisma), Controllers e rotas.

### Banco de Dados
- **SGBD:** PostgreSQL 15 (Alpine).
- **Infra:** Rodando em container Docker isolado com volume persistente.

### Front-end
- **Tech:** React + Vite + TypeScript.
- **Ambiente:** Node 22 (Alpine) no Docker.

---

## Como Rodar o Projeto

Você não precisa instalar Node ou Postgres na sua máquina. Basta ter o **Docker** e o **Docker Compose**.

### 1. Clone o repositório
```bash
git clone [https://github.com/Felipeds-L/IESI.git](https://github.com/Felipeds-L/IESI.git)
cd IESI
2. Suba o ambiente
Execute o comando abaixo na raiz do projeto. Ele irá construir as imagens, baixar o banco de dados, aplicar as migrações e iniciar os servidores.

Bash

docker-compose up --build
Aguarde: O processo pode levar alguns minutos na primeira vez. O sistema estará pronto quando aparecer no terminal: 🚀 HTTP server running on http://localhost:3000

3. Acessar
Front-end: http://localhost:5173

Back-end (API): http://localhost:3000
