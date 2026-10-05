<div align="center">

# 🟠 Gerenciador de Eventos

**Cadastre eventos, organize palestrantes e mantenha tudo em um só lugar.**

Interface web simples, API REST e banco de dados relacional para gerenciar eventos e seus palestrantes.

![Node.js](https://img.shields.io/badge/Node.js-24-ED984F?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-ED984F?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-ED984F?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-ED984F?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-ED984F?logo=postgresql&logoColor=white)

</div>

---

## ✨ O projeto

O Gerenciador de Eventos oferece uma interface para cadastrar palestrantes, criar eventos e gerenciar a programação. Também disponibiliza uma API REST para consultar e alterar os registros.

Um evento pode ter vários palestrantes, e um palestrante pode participar de vários eventos. Os vínculos são armazenados na tabela `evento_palestrantes`.

## 🖥️ Interface

Depois de iniciar a aplicação, acesse **[http://localhost:3000](http://localhost:3000)**.

- **Eventos:** lista os eventos cadastrados e permite editar ou excluir cada um.
- **Cadastro de evento:** informa nome, descrição, local e palestrante.
- **Cadastro de palestrante:** registra nome e e-mail, com validação do endereço.
- Os formulários exigem os campos obrigatórios e confirmam o cadastro após salvar.

## 🧰 Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js e TypeScript | Execução e desenvolvimento |
| Express 5 | Servidor e API REST |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Armazenamento dos registros |
| HTML, CSS e JavaScript | Interface web |

## 🚀 Como executar

### Pré-requisitos

- Node.js e npm
- PostgreSQL

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o banco de dados

No PostgreSQL, crie um banco chamado `eventos_db`:

```sql
CREATE DATABASE eventos_db;
```

Copie `.env.example` para `.env` e ajuste a URL de conexão com as credenciais do seu PostgreSQL:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventos_db"
```

### 3. Prepare o banco e inicie o projeto

```bash
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

A interface e a API estarão disponíveis em **[http://localhost:3000](http://localhost:3000)**.

Para carregar os dados de exemplo, execute:

```bash
psql -d eventos_db -f database/03_seed.sql
```

### Produção

```bash
npm run build
npm start
```

## 🗂️ Estrutura do projeto

```text
├── database/
│   ├── 01_schema.sql              # Estrutura do banco
│   ├── 02_views.sql               # View de eventos e palestrantes
│   ├── 03_seed.sql                # Dados de exemplo
│   ├── 04_backup_completo.sql     # Backup do banco
│   └── 05_consultas.sql           # Consultas de exemplo
├── prisma/
│   └── schema.prisma              # Modelos e relacionamentos
├── public/
│   ├── app.js                     # Interações da interface
│   ├── index.html                 # Páginas do sistema
│   └── styles.css                # Estilos
├── src/
│   ├── controllers/               # Regras dos endpoints
│   ├── database/                  # Cliente Prisma
│   ├── middlewares/               # Tratamento de erros
│   ├── routes/                    # Rotas da API
│   ├── app.ts                     # Configuração do Express
│   └── server.ts                  # Inicialização do servidor
├── diagrama_er.png                # Diagrama entidade-relacionamento
└── MODELO_LOGICO.md               # Modelo lógico do banco
```

## 🧩 Modelo de dados

| Tabela | Campos |
| --- | --- |
| `eventos` | `id`, `nome`, `descricao`, `local` |
| `palestrantes` | `id`, `nome`, `email` |
| `evento_palestrantes` | `evento_id`, `palestrante_id` |

O e-mail do palestrante é único. A tabela de vínculo tem uma chave primária composta pelas chaves estrangeiras e usa exclusão em cascata.

<details>
<summary>Ver diagrama entidade-relacionamento</summary>
<br />

![Diagrama entidade-relacionamento de eventos e palestrantes](./diagrama_er.png)

</details>

## 📡 API REST

Todas as rotas estão disponíveis na raiz do servidor local, por exemplo: `http://localhost:3000/eventos`.

### Eventos

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/eventos` | Lista eventos com seus palestrantes |
| `GET` | `/eventos/:id` | Consulta um evento |
| `POST` | `/eventos` | Cadastra um evento |
| `PUT` | `/eventos/:id` | Atualiza um evento e seus vínculos |
| `DELETE` | `/eventos/:id` | Exclui um evento |
| `POST` | `/eventos/:eventoId/palestrantes/:palestranteId` | Vincula um palestrante |
| `GET` | `/eventos/:eventoId/palestrantes` | Lista os palestrantes do evento |
| `DELETE` | `/eventos/:eventoId/palestrantes/:palestranteId` | Remove um vínculo |

### Palestrantes

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/palestrantes` | Lista palestrantes |
| `GET` | `/palestrantes/:id` | Consulta um palestrante |
| `POST` | `/palestrantes` | Cadastra um palestrante |
| `PUT` | `/palestrantes/:id` | Atualiza um palestrante |
| `DELETE` | `/palestrantes/:id` | Exclui um palestrante |

## 📨 Exemplos de requisição

### Cadastrar um evento

`POST /eventos`

```json
{
  "nome": "Hackathon 2026",
  "descricao": "Desafio para estudantes de tecnologia.",
  "local": "FIAP",
  "palestranteIds": [1]
}
```

`palestranteIds` é opcional na API. Quando informado, deve conter os IDs dos palestrantes já cadastrados.

### Cadastrar um palestrante

`POST /palestrantes`

```json
{
  "nome": "Kamilly Ribeiro",
  "email": "kamilly.ribeiro@hotmail.com"
}
```

## 🗃️ Scripts SQL

Os scripts da pasta `database/` permitem consultar, configurar e carregar dados no PostgreSQL. Atenção: `01_schema.sql` recria as tabelas e remove as tabelas existentes com os mesmos nomes. Use-o somente em um banco de desenvolvimento sem dados que queira preservar.

---

<div align="center">

Feito para conectar pessoas e boas ideias. 🟠

</div>
