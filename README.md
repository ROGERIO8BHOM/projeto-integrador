# API HelpDesk

API REST para gerenciamento de chamados de suporte técnico. O sistema permite cadastrar categorias, solicitantes e técnicos, registrar chamados, acompanhar seu atendimento e consultar um relatório resumido por status.

Projeto desenvolvido para o Projeto Integrador do curso **Desenvolvedor Back-End** do programa **Bolsa Futuro Digital**.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)
- [Filtros e relatório](#filtros-e-relatório)
- [Regras de negócio](#regras-de-negócio)
- [Respostas e erros](#respostas-e-erros)
- [Testes](#testes)

## Funcionalidades

- Cadastro, listagem, atualização e exclusão de categorias.
- Cadastro, consulta, atualização e exclusão de solicitantes.
- Cadastro, consulta, atualização e exclusão de técnicos.
- Cadastro, listagem, consulta, atualização e exclusão de chamados.
- Associação de chamado com solicitante, categoria e, opcionalmente, técnico.
- Filtros de chamados por status e prioridade, separadamente ou juntos.
- Relatório de quantidade de chamados agrupados por status.
- Validação de campos obrigatórios, e-mail, IDs, status e prioridades.
- Mensagens de erro e status HTTP apropriados.

## Tecnologias

- JavaScript
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- Git
- GitHub
- Helmet
- CORS
- REST Client, Insomnia, Postman ou Bruno

## Pré-requisitos

- Node.js
- MySQL
- Um cliente para testar requisições HTTP, como a extensão **REST Client** do VS Code, Postman, Insomnia ou Bruno.

## Instalação e execução

1. Clone ou baixe este projeto e entre na pasta dele.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. No MySQL, execute primeiro o arquivo abaixo para criar o banco de dados:

   ```sql
   create_database.sql
   ```

4. Selecione o banco `helpdesk` e execute as tabelas:

   ```sql
   create_tables.sql
   ```

5. Crie o arquivo `.env` na raiz do projeto. Use `.env.example` como referência.
6. Inicie a aplicação:

   ```bash
   npm run dev
   ```

   Para iniciar sem reinicialização automática, use `npm start`.

Por padrão, a API estará disponível em `http://localhost:3000`.

## Configuração do ambiente

Crie o arquivo `.env` na raiz do projeto com suas credenciais do MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=helpdesk
```

> O arquivo `.env` contém dados sensíveis. O `.env.example` pode ser utilizado como modelo.

## Estrutura do projeto

```text
projeto-integrador/
├── database/             # Scripts de criação do banco e das tabelas
├── requests/             # Requisições para REST Client do VS Code
├── src/
│   ├── config/           # Conexão com o banco de dados
│   ├── constants/        # Valores permitidos para chamados
│   ├── controllers/      # Recebem as requisições HTTP
│   ├── database/         # Base dos models e construtor de consultas SQL
│   ├── errors/           # Classe de erros da aplicação
│   ├── middlewares/      # Tratamento centralizado de erros
│   ├── models/           # Acesso aos dados
│   ├── routes/           # Rotas da API
│   ├── services/         # Regras de negócio
│   └── utils/            # Validadores reutilizáveis
├── .env.example          # Modelo de variáveis de ambiente
├── package-lock.json     # Versões exatas das dependências instaladas
├── package.json          # Dependências e comandos do projeto
└── server.js             # Inicialização do servidor
```

## Endpoints

Base URL: `http://localhost:3000`

### Categorias

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/categorias` | Lista todas as categorias |
| POST | `/categorias` | Cadastra uma categoria |
| PUT | `/categorias/:id` | Atualiza uma categoria |
| DELETE | `/categorias/:id` | Exclui uma categoria |

```json
{
  "nome": "Hardware",
  "descricao": "Problemas em computadores e periféricos"
}
```

### Solicitantes

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/solicitantes` | Lista todos os solicitantes |
| GET | `/solicitantes/:id` | Consulta um solicitante por ID |
| GET | `/solicitantes?email=nome@empresa.com` | Consulta por e-mail |
| POST | `/solicitantes` | Cadastra um solicitante |
| PUT | `/solicitantes/:id` | Atualiza um solicitante |
| DELETE | `/solicitantes/:id` | Exclui um solicitante |

```json
{
  "nome": "João Almeida",
  "email": "joao.almeida@empresa.com",
  "setor": "Financeiro"
}
```

### Técnicos

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/tecnicos` | Lista todos os técnicos |
| GET | `/tecnicos?email=nome@empresa.com` | Consulta por e-mail |
| POST | `/tecnicos` | Cadastra um técnico |
| PUT | `/tecnicos/:id` | Atualiza um técnico |
| DELETE | `/tecnicos/:id` | Exclui um técnico |

```json
{
  "nome": "Rogério Foresti",
  "email": "rogerio.foresti@empresa.com"
}
```

### Chamados

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/chamados` | Lista todos os chamados |
| GET | `/chamados/:id` | Consulta um chamado por ID |
| POST | `/chamados` | Cria um chamado |
| PUT | `/chamados/:id` | Atualiza um chamado |
| DELETE | `/chamados/:id` | Exclui um chamado |

Exemplo de criação:

```json
{
  "titulo": "Computador não inicia",
  "descricao": "O computador do setor financeiro não está ligando.",
  "prioridade": "ALTA",
  "solicitante_id": 1,
  "categoria_id": 1
}
```

Para atribuir técnico e iniciar atendimento:

```json
{
  "tecnico_id": 1,
  "status": "EM_ATENDIMENTO"
}
```

Para concluir um chamado:

```json
{
  "status": "CONCLUIDO",
  "solucao": "O cabo de alimentação foi substituído."
}
```

## Filtros e relatório

### Filtros de chamados

Os filtros podem ser usados isoladamente ou combinados:

```http
GET /chamados?status=ABERTO
GET /chamados?prioridade=ALTA
GET /chamados?status=ABERTO&prioridade=ALTA
```

| Campo | Valores aceitos |
| --- | --- |
| `status` | `ABERTO`, `EM_ATENDIMENTO`, `CONCLUIDO` |
| `prioridade` | `BAIXA`, `MEDIA`, `ALTA` |

### Relatório de chamados por status

```http
GET /relatorios/chamados-por-status
```

Exemplo de resposta:

```json
[
  { "status": "ABERTO", "total": 8 },
  { "status": "EM_ATENDIMENTO", "total": 4 },
  { "status": "CONCLUIDO", "total": 15 }
]
```

A consulta usa `COUNT(*)` e `GROUP BY status` no banco de dados.

## Regras de negócio

- Ao criar um chamado, título, descrição, prioridade, solicitante e categoria são obrigatórios.
- O título pode ter, no máximo, 150 caracteres.
- Solicitante e categoria devem existir antes da criação do chamado.
- Para alterar o status para `EM_ATENDIMENTO`, é obrigatório atribuir um técnico.
- Para alterar o status para `CONCLUIDO`, é obrigatório informar uma solução.
- Status e prioridade devem usar apenas os valores permitidos pela API.
- E-mails de solicitantes e técnicos devem ser válidos e únicos.
- Registros com vínculos não podem ser removidos; a API responde com conflito nesse caso.

## Respostas e erros

| Código | Significado | Quando ocorre |
| --- | --- | --- |
| `200 OK` | Sucesso | Consulta, atualização ou exclusão realizada |
| `201 Created` | Criado | Cadastro realizado com sucesso |
| `400 Bad Request` | Requisição inválida | Campo, ID, filtro ou dado inválido |
| `404 Not Found` | Não encontrado | Registro inexistente |
| `409 Conflict` | Conflito | E-mail duplicado ou registro vinculado |
| `500 Internal Server Error` | Erro interno | Falha inesperada no servidor |

Formato padrão de erro:

```json
{
  "error": "Status inválido",
  "status": 400
}
```

Exemplo de resposta de criação:

```json
{
  "message": "Chamado adicionado com sucesso - ID: 1"
}
```

## Testes

Para testar manualmente todos os endpoints, inicie a API e use os arquivos da pasta `requests/` com a extensão **REST Client** do VS Code:

| Arquivo | Recurso testado |
| --- | --- |
| `requests/categorias.rest` | Categorias |
| `requests/solicitantes.rest` | Solicitantes e validações |
| `requests/tecnicos.rest` | Técnicos e validações |
| `requests/chamados.rest` | Chamados, regras de negócio e filtros |
| `requests/relatorios.rest` | Relatório por status |

> Antes de testar chamados, cadastre uma categoria, um solicitante e um técnico. Depois ajuste os IDs no início de `requests/chamados.rest` conforme os registros do seu banco.
