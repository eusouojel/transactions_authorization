🔍 Visão Geral do Projeto

Este projeto implementa um sistema de autorização de transações financeiras utilizando Node.js com ES Modules (ESM). A arquitetura segue os princípios de Domain-Driven Design (DDD), garantindo uma separação clara de responsabilidades entre as diferentes camadas do sistema. O projeto utiliza Knex.js como query builder para interações com o banco de dados e Vitest para testes unitários.

🏗️ Arquitetura do Projeto
A arquitetura do projeto está organizada nas seguintes camadas:

Domínio (/src/domain)
Aplicação (/src/application)
Infraestrutura (/src/infrastructure)
API (/src/api)
Testes (/tests)
Cada camada possui responsabilidades específicas, facilitando a manutenção, escalabilidade e teste do sistema.

1. 🏛️ Camada de Domínio (/src/domain)
Responsabilidade:
A camada de Domínio encapsula a lógica de negócio central do sistema. Ela define as regras e comportamentos que são essenciais para o funcionamento do autorizador de transações financeiras.

Componentes Principais:

Entidades (entities): Representações dos objetos de negócio, contendo atributos e métodos que definem seu estado e comportamento.
Exemplo: Account representa uma conta bancária com saldos específicos.
Serviços (services): Contém a lógica de negócio que não pertence a uma única entidade, ou seja, operações que envolvem múltiplas entidades ou regras complexas.
Exemplo: transactionAuthorizationService gerencia a autorização de transações, incluindo validações e atualizações de saldo.
Repositórios (repositories): Define interfaces para acesso a dados, permitindo que a lógica de domínio permaneça independente das implementações de infraestrutura.
Exemplo: AccountRepository e TransactionRepository fornecem métodos para interagir com os dados das contas e transações, respectivamente.
Interação com Outras Camadas:
A camada de Domínio é utilizada pela camada de Aplicação para orquestrar os casos de uso. Ela também define as interfaces que a camada de Infraestrutura implementa para persistência de dados.

2. 🚀 Camada de Aplicação (/src/application)
Responsabilidade:
A camada de Aplicação orquestra a execução de ações específicas do sistema, coordenando a interação entre as diferentes partes do Domínio e Infraestrutura para realizar funcionalidades concretas.

Componentes Principais:

Casos de Uso (useCases): Implementam as operações que o sistema pode realizar, seguindo os requisitos de negócio. Cada caso de uso representa uma ação específica que pode ser executada pelo sistema.
Exemplo: authorizeTransactionUseCase gerencia o processo completo de autorização de uma transação, integrando repositórios e serviços de domínio.
Interação com Outras Camadas:
Os casos de uso utilizam as entidades e serviços da camada de Domínio para executar a lógica de negócio. Eles também interagem com os repositórios da camada de Infraestrutura para persistir e recuperar dados.

3. 🏗️ Camada de Infraestrutura (/src/infrastructure)
Responsabilidade:
A camada de Infraestrutura fornece implementações concretas para as interfaces definidas na camada de Domínio, além de gerenciar integrações com sistemas externos, como bancos de dados.

Componentes Principais:

Persistência (persistence): Implementa os repositórios utilizando ferramentas como Knex.js para interações com o banco de dados.
Exemplo: AccountRepositoryDatabase e TransactionRepositoryDatabase são implementações que utilizam Knex.js para acessar e modificar dados no banco.
Configurações (config): Contém arquivos de configuração para diferentes ambientes (desenvolvimento, teste, produção), incluindo configurações de banco de dados.
Exemplo: knexfile.cjs define as configurações do Knex.js para diferentes ambientes.
Interação com Outras Camadas:
A camada de Infraestrutura implementa as interfaces dos repositórios definidos na camada de Domínio, permitindo que a lógica de negócio interaja com os dados sem depender de detalhes de implementação.

4. 🌐 Camada de API (/src/api)
Responsabilidade:
A camada de API expõe as funcionalidades do sistema através de endpoints HTTP, permitindo que clientes externos interajam com o autorizador de transações financeiras.

Componentes Principais:

Controladores (controllers): Manipulam as requisições HTTP recebidas, invocando os casos de uso da camada de Aplicação e retornando as respostas apropriadas aos clientes.
Exemplo: transactionController gerencia a autorização de transações recebidas via requisições HTTP.
Rotas (routes): Define os endpoints da API, mapeando URLs e métodos HTTP para os controladores correspondentes.
Exemplo: transactionRoutes define a rota /authorize para processar requisições de autorização de transações.
Servidor (server.js): Inicializa e configura o servidor web (usando Express.js), aplicando middlewares necessários e registrando as rotas definidas.
Interação com Outras Camadas:
Os controladores da camada de API utilizam os casos de uso da camada de Aplicação para executar operações solicitadas pelos clientes. A API atua como a interface de entrada para o sistema, recebendo e respondendo a requisições externas.

5. 🧪 Camada de Testes (/tests)
Responsabilidade:
A camada de Testes garante a qualidade e confiabilidade do sistema através de testes automatizados. Ela verifica se as diferentes partes do sistema funcionam conforme o esperado.

Componentes Principais:

Testes Unitários (unit): Testam unidades individuais do código (como funções ou classes) de forma isolada, assegurando que cada componente funcione corretamente por si só.
Testes de Integração (integration): Verificam a interação entre diferentes partes do sistema, garantindo que os componentes funcionem juntos de maneira harmoniosa.
Ferramentas Utilizadas:

Vitest: Framework de testes utilizado para escrever e executar os testes unitários e de integração.
Mocking: Utilização de mocks para simular comportamentos de dependências externas, como o banco de dados, garantindo que os testes sejam rápidos e isolados.
Interação com Outras Camadas:
Os testes interagem com todas as camadas do sistema, validando tanto a lógica de negócio (Domínio e Aplicação) quanto as implementações de Infraestrutura e a API.

🛠️ Configuração do Ambiente
1. Pré-requisitos

Node.js: Versão 14 ou superior.
Banco de Dados: PostgreSQL ou outro banco de dados compatível.
Knex CLI: Ferramenta de linha de comando para gerenciamento de migrações e seeds do Knex.js.
Git: Para controle de versão e clonagem do repositório.
2. Instalação

Clone o repositório e instale as dependências:

bash
Copiar código
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
3. Configuração de Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis (substitua pelos valores corretos):

env
Copiar código
PORT=3000
DATABASE_HOST=127.0.0.1
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
Nota: As variáveis de ambiente são utilizadas nas configurações do Knex.js para conectar ao banco de dados.

4. Migrando o Banco de Dados

Execute as migrações para criar as tabelas necessárias:

bash
Copiar código
npx knex migrate:latest
5. Populando o Banco de Dados com Seeds (Opcional)

Para inserir dados iniciais no banco de dados, execute os seeds:

bash
Copiar código
npx knex seed:run
6. Rodando o Servidor

Inicie o servidor da API:

bash
Copiar código
npm start
O servidor estará rodando na porta definida na variável PORT (por padrão, 3000).

🌐 Detalhes da API
A API expõe endpoints para autorizar transações financeiras. A seguir, são descritos os principais endpoints disponíveis.

1. Autorizar Transação

URL: /api/transactions/authorize
Método: POST
Descrição: Autoriza uma transação financeira para uma conta específica.
Body da Requisição:
json
Copiar código
{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}
Parâmetros:
accountId (string): Identificador único da conta.
totalAmount (number): Valor total da transação.
mcc (string): Código de categoria do comerciante (Merchant Category Code).
merchant (string): Nome do comerciante.
Respostas:
Sucesso (Código 00):
Status: 200 OK
Body:
json
Copiar código
{
  "code": "00"
}
Falha - Conta Não Encontrada (Código 07):
Status: 400 Bad Request
Body:
json
Copiar código
{
  "code": "07",
  "message": "Account not found."
}
Falha - Entrada Inválida (Código 07):
Status: 400 Bad Request
Body:
json
Copiar código
{
  "code": "07",
  "message": "Invalid MCC code."
}
Falha - Saldo Insuficiente (Código 51):
Status: 400 Bad Request
Body:
json
Copiar código
{
  "code": "51",
  "message": "Insufficient balance."
}
Erro Interno (Código 500):
Status: 500 Internal Server Error
Body:
json
Copiar código
{
  "message": "Internal Server Error"
}
Exemplos de Requisição com cURL

Sucesso:
bash
Copiar código
curl -X POST http://localhost:3000/api/transactions/authorize \
-H "Content-Type: application/json" \
-d '{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}'
Falha - Saldo Insuficiente:
bash
Copiar código
curl -X POST http://localhost:3000/api/transactions/authorize \
-H "Content-Type: application/json" \
-d '{
  "accountId": "123",
  "totalAmount": 1000.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}'
🧰 Dependências Principais
Node.js: Ambiente de execução para JavaScript no servidor.
Express.js: Framework web para construção de APIs.
Knex.js: Query builder para facilitar interações com o banco de dados.
Vitest: Framework de testes para garantir a qualidade do código.
PostgreSQL: Sistema de gerenciamento de banco de dados relacional.
ES Modules (ESM): Sistema de módulos nativo do Node.js para melhor organização e modularidade do código.
dotenv: Para carregar variáveis de ambiente a partir do arquivo .env.

📚 Referências Adicionais
Knex.js Documentation
Vitest Documentation
Express.js Documentation
Node.js ESM Documentation