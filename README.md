# API Node.js + TypeScript para Integração com Trello

## **Visão Geral do Projeto**
Este projeto é uma API backend construída com Node.js e TypeScript, projetada para integrar com o Trello e servir como backend para uma aplicação React.js + TypeScript. A API é estruturada para escalabilidade e facilidade de manutenção, seguindo uma arquitetura em camadas para separar responsabilidades e garantir um código limpo.

## **Funcionalidades**
- Integração com a API do Trello para buscar e gerenciar dados.
- Endpoints RESTful para comunicação eficiente com o frontend.
- Arquitetura modular e escalável.
- Suporte a variáveis de ambiente para configuração segura.

## **Tecnologias Utilizadas**
### **Bibliotecas Principais**
1. **Express**: Framework web para construção de APIs RESTful.
2. **Axios**: Cliente HTTP para fazer requisições à API do Trello.
3. **dotenv**: Carrega variáveis de ambiente de um arquivo `.env`.
4. **cors**: Habilita o Cross-Origin Resource Sharing.

### **Ferramentas de Desenvolvimento**
1. **TypeScript**: Adiciona tipagem estática ao JavaScript para maior confiabilidade no código.
2. **ts-node**: Executa arquivos TypeScript diretamente.
3. **ESLint**: Garante a qualidade e consistência do código.
4. **Prettier**: Formata o código para melhor legibilidade.
5. **@types/node & @types/express**: Fornece definições de tipo para TypeScript.


### **Estrutura de Pastas**
```plaintext
src/
├── controllers/       # Contém a lógica de negócio e integrações com a API do Trello
├── services/          # Lida com requisições e respostas HTTP
├── db/                # Simula um banco de dados da aplicação
├── config/            # Armazena configurações
├── types/             # Tipagem dos dados
├── middlewares/       # Implementa funções de middleware reutilizáveis
├── utils/             # Fornece funções utilitárias
index.ts               # Ponto de entrada principal da aplicação + Rotas da aplicação
```

## **Instruções de Configuração**

### **Pré-requisitos**
- Node.js e npm instalados.
- Uma conta no Trello e chave e token da API.

### **Instalação**
1. Clone o repositório:
   ```bash
   git clone https://github.com/mazuttidev/api-hos-suport-helper.git
   cd api-hos-suport-helper
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```plaintext
TRELLO_API_USER_ID=trello-api-user-id
TRELLO_API_KEY=trello-api-key
TRELLO_API_TOKEN=trello-api-token
TRELLO_BOARD_ID=trello-board-id
PORT=port
TRELLO_LIST_ID=trello-list-id
TRELLO_BASE_URL=trello-base-url
JWT_SECRET=secret-para-autenticacao
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## **Endpoints**

/login                              # Autenticação do Projeto
/solicitacoes                       # Dados das solicitações [ listagem ]
/solicitacoes/nova-solicitacao      # Formulário para nova Solicitação
/chat/:cardId                       # Busca os dados do Chat
/chat/:cardId/nova-mensagem         # Envia uma nova mensagem no Chat

### **URL Base**
```
http://localhost:3000/
```

### **Rotas TRELLO API Disponíveis**
1. **GET /trello/cards/{cardId}:** Busca as informações de um card específico no Trello.
2. **GET /trello/boards/{boardId}/cards:** Retorna a lista de cards de um quadro específico no Trello.
3. **GET /trello/cards/{cardId}/actions:** Obtém as ações associadas a um card específico, podendo incluir filtros via parâmetros.
4. **POST /trello/cards:** Cria um novo card no Trello.
5. **POST /trello/cards/{cardId}/attachments:** Adiciona um anexo a um card específico no Trello.
6. **POST /trello/cards/{cardId}/actions/comments:** Adiciona um comentário a um card específico no Trello.


## **Licença**
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

