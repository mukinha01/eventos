<div align="center">

# 
Eventos

### API para organizar eventos e palestrantes

Cadastre eventos, gerencie palestrantes e mantenha os vínculos entre eles em um só lugar.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)

</div>

---

##  Sobre o projeto

Uma API REST desenvolvida para o gerenciamento de eventos e palestrantes. Um evento pode ter vários palestrantes, e cada palestrante pode participar de vários eventos.

O projeto foi organizado para separar inicialização da aplicação, rotas, controllers, conexão com o banco e scripts SQL.

##  Tecnologias

- Node.js e TypeScript
- Express 5
- Prisma ORM
- PostgreSQL
- CORS e dotenv

##  Estrutura

```text
├── database/
│   ├── 01_schema.sql              # Tabelas, campos e chaves
│   ├── 02_views.sql               # View de eventos com palestrantes
│   ├── 03_seed.sql                # Dados de exemplo
│   ├── 04_backup_completo.sql     # Backup SQL completo
│   └── 05_consultas.sql           # Consultas de exemplo
├── prisma/
│   └── schema.prisma              # Modelos e relações do Prisma
├── src/
│   ├── controllers/               # Regras dos endpoints
│   ├── database/prisma.ts         # Cliente Prisma
│   ├── middlewares/               # Tratamento de erros
│   ├── routes/                    # Rotas da API
│   ├── app.ts                     # Configuração do Express
│   └── server.ts                  # Inicialização do servidor
├── diagrama_er.png                # Diagrama entidade-relacionamento
└── MODELO_LOGICO.md               # Descrição do modelo lógico
```

## 🧩 Modelo de dados

O relacionamento muitos-para-muitos é representado pela tabela `evento_palestrantes`.

| Tabela | Campos |
| --- | --- |
| `eventos` | `id`, `nome`, `descricao`, `local` |
| `palestrantes` | `id`, `nome`, `email` |
| `evento_palestrantes` | `evento_id`, `palestrante_id` |

Os campos de cadastro são obrigatórios. O e-mail do palestrante é único. A tabela associativa usa uma chave primária composta pelas duas chaves estrangeiras.

### Diagrama ER

![Diagrama entidade-relacionamento de eventos e palestrantes](./diagrama_er.png)

##  Como executar

### Pré-requisitos

- Node.js e npm
- PostgreSQL

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o banco e configure o ambiente

No PostgreSQL, crie o banco:

```sql
CREATE DATABASE eventos_db;
```

Copie `.env.example` para `.env` e ajuste os dados de acesso, se necessário:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventos_db"
```

### 3. Prepare o Prisma e inicie a API

```bash
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

A API estará disponível em `http://localhost:3000`.

Para compilar e iniciar a versão de produção:

```bash
npm run build
npm start
```

## 📡 Endpoints

### Eventos

| Método | Rota | Ação |
| --- | --- | --- |
| `POST` | `/eventos` | Cadastra um evento |
| `GET` | `/eventos` | Lista eventos e seus vínculos com palestrantes |
| `GET` | `/eventos/:id` | Busca um evento |
| `PUT` | `/eventos/:id` | Atualiza um evento |
| `DELETE` | `/eventos/:id` | Exclui um evento |
| `POST` | `/eventos/:eventoId/palestrantes/:palestranteId` | Adiciona palestrante ao evento |
| `GET` | `/eventos/:eventoId/palestrantes` | Lista palestrantes do evento |
| `DELETE` | `/eventos/:eventoId/palestrantes/:palestranteId` | Remove palestrante do evento |

### Palestrantes

| Método | Rota | Ação |
| --- | --- | --- |
| `POST` | `/palestrantes` | Cadastra um palestrante |
| `GET` | `/palestrantes` | Lista palestrantes |
| `GET` | `/palestrantes/:id` | Busca um palestrante |
| `PUT` | `/palestrantes/:id` | Atualiza um palestrante |
| `DELETE` | `/palestrantes/:id` | Exclui um palestrante |

## 🧪 Exemplos de requisição

### Cadastrar um evento

`POST /eventos`

```json
{
  "nome": "Hackathon 2026",
  "descricao": "Desafio para estudantes de tecnologia.",
  "local": "FIAP"
}
```

### Cadastrar um palestrante

`POST /palestrantes`

```json
{
  "nome": "Kamilly Ribeiro",
  "email": "kamilly.ribeiro@hotmail.com"
}
```

### Vincular palestrante a evento

`POST /eventos/1/palestrantes/1`

As rotas de criação e atualização exigem o preenchimento dos campos obrigatórios. A view `vw_eventos_com_palestrantes` também está disponível nos scripts SQL.

##  Scripts do banco

Os arquivos SQL foram separados para facilitar a leitura e execução. `01_schema.sql` recria as tabelas e remove as tabelas existentes com os mesmos nomes; use-o somente em um banco de desenvolvimento sem dados que queira preservar. `04_backup_completo.sql` contém estrutura, relacionamentos, view e dados de exemplo em um único arquivo.

##  Licença

Projeto de estudo. Consulte as condições de uso com o autor antes de reutilizar.
