# Visão Geral do Projeto

Este projeto implementa um sistema de autorização de transações financeiras utilizando Node.js com ES Modules (ESM). A arquitetura segue os princípios de Domain-Driven Design (DDD), garantindo uma separação clara de responsabilidades entre as diferentes camadas do sistema. O projeto utiliza Knex.js como query builder para interações com o banco de dados e Vitest para testes unitários.

## Arquitetura do Projeto
A arquitetura do projeto está organizada nas seguintes camadas:

- Domínio (/src/domain)
- Aplicação (/src/application)
- Infraestrutura (/src/infrastructure)
- Interfaces (/src/interfaces)
- Testes (/tests)

Cada camada possui responsabilidades específicas, facilitando a manutenção, escalabilidade e teste do sistema.

### Camada de Domínio (/src/domain)

#### Responsabilidade:

A camada de Domínio encapsula a lógica de negócio central do sistema, definindo as entidades, serviços e interfaces de repositórios que representam as regras e comportamentos essenciais para o funcionamento do autorizador de transações financeiras.

#### Componentes:

* Entidades (entities):
  * Account: Representa uma conta bancária com atributos como id, foodBalance, mealBalance e cashBalance. Esta entidade é fundamental para gerenciar os saldos disponíveis para diferentes tipos de transações.
  * Transaction: Representa uma transação com atributos accountID, totalAmount, mcc e merchant. Ela é fundamental para registrar as transações solicitadas para a aplicação, transações essas que manipulam os saldos disponíveis nas contas.
    
* Serviços (services):

  * transactionAuthorizationService: Implementa a lógica de autorização das transações. Este serviço valida os inputs da transação, determina qual tipo de saldo (alimentação, refeição ou dinheiro) deve ser utilizado para a transação e atualiza o saldo da conta de acordo.
  * validationService (validationService.js): Responsável por validar os inputs das transações, garantindo que o totalAmount seja um número positivo e que o mcc seja um código válido.

* Repositórios (repositories):

  * AccountRepository: Define a interface para operações relacionadas às contas, como encontrar uma conta por ID e atualizar os saldos da conta.
  * TransactionRepository: Define a interface para operações relacionadas às transações, especificamente a criação de novas transações no sistema.

#### Interação com Outras Camadas:

A camada de Domínio é utilizada pela camada de Aplicação para orquestrar os casos de uso. As interfaces de repositórios definidas aqui são implementadas na camada de Infraestrutura, permitindo que a lógica de negócio permaneça desacoplada das implementações de persistência de dados.



### Camada de Aplicação (/src/application)

#### Responsabilidade:

A camada de Aplicação coordena a execução das ações específicas do sistema, integrando as entidades, serviços de domínio e repositórios para realizar funcionalidades concretas. Ela atua como a ponte entre a camada de Domínio e as interfaces externas (como a API).

#### Componentes Principais:

* Casos de Uso (useCases):
  * authorizeTransactionUseCase: Orquestra o processo completo de autorização de uma transação financeira.
  * createAccount: Cria uma nova conta de usuário com saldos iniciais para foodBalance, mealBalance e cashBalance.
  * addBalance: Adiciona um valor a um tipo específico de saldo (foodBalance, mealBalance ou cashBalance) de uma conta existente.
  * getAccount: Recupera os dados completos de uma conta específica, incluindo os saldos atuais.

#### Interação com Outras Camadas:

Os casos de uso da camada de Aplicação utilizam as entidades e serviços da camada de Domínio para executar a lógica de negócio e interagem com os repositórios da camada de Infraestrutura para persistir e recuperar dados necessários para a operação.

### Camada de Infraestrutura (/src/infrastructure)

#### Responsabilidade:

A camada de Infraestrutura fornece implementações concretas para as interfaces de repositórios definidas na camada de Domínio, além de gerenciar integrações com sistemas externos, como bancos de dados. Ela é responsável pela persistência de dados e configurações necessárias para o funcionamento do sistema.

#### Componentes Principais:

* Persistência (persistence/repositories):
  * AccountRepositoryDatabase: Implementa a interface AccountRepository utilizando Knex.js para interagir com o banco de dados.
  * TransactionRepositoryDatabase: Implementa a interface TransactionRepository utilizando Knex.js para inserir novas transações no banco de dados.

#### Interação com Outras Camadas:

A camada de Infraestrutura implementa as interfaces de repositórios definidas na camada de Domínio, permitindo que a lógica de negócio interaja com os dados de forma desacoplada. Além disso, utiliza configurações definidas para conectar-se e operar sobre o banco de dados conforme as necessidades do sistema.

### Camada de Interface (/src/interfaces)

#### Responsabilidade:

A camada de Interfaces expõe as funcionalidades do sistema através de endpoints HTTP, permitindo que clientes externos (como aplicações frontend ou outros serviços) interajam com o autorizador de transações financeiras.

#### Componentes Principais:

* Controladores (controllers):
  * transactionController: Manipula as requisições HTTP relacionadas a transações. Este controlador recebe os dados da requisição, invoca o caso de uso authorizeTransactionUseCase com os parâmetros fornecidos e retorna a resposta adequada ao cliente com base no resultado da autorização.
  * Rotas (routes):
    * accountRoutes: ...
    * transactionRoutes: Define os endpoints da API relacionados a transações. Mapeia rotas específicas para os controladores correspondentes.
  * accountController: O Account Controller gerencia as requisições relacionadas às operações de contas, interagindo com os casos de uso correspondentes para executar as ações necessárias.
    * Métodos Implementados:
      * createAccount: Responsável por criar uma nova conta
      * addBalance: Responsável por adicionar saldo a um tipo específico de balance de uma conta existente
      * getAccount: Responsável por recuperar os dados de uma conta específica

#### Interação com Outras Camadas:

Os controladores da camada de API utilizam os casos de uso da camada de Aplicação para executar operações solicitadas pelos clientes. A API atua como a interface de entrada para o sistema, recebendo requisições externas, processando-as através das camadas internas e retornando respostas apropriadas.

### Detalhes da API

A API do projeto expõe endpoints para autorizar transações financeiras, permitindo que clientes externos interajam com o sistema de forma segura e eficiente.

#### Autorizar Transação

* URL: /api/v1/transactions/
* Método: POST
* Descrição: Autoriza uma transação financeira para uma conta específica.
* Parâmetros no corpo da requisição (JSON):

  |Campo|Tipo|Obrigatório|Descrição|
  |-----|----|-----------|---------|
  |accountId|number|Sim|Identificador único da conta|
  |totalAmount|number|Sim|Valor a ser debitado de um saldo específico|
  |mcc|string|Sim|Mcc referente a um saldo específico da conta|
  |merchant|string|Sim|Nome do comerciante que está solicitando o débito|

* Exemplo de requisição JSON:
```json
{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}
```

* Exemplos de Requisição com cURL
```bash
curl -X POST http://localhost:3000/api/v1/transactions \
-H "Content-Type: application/json" \
-d '{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}'
```

* Respostas:
  * Sucesso (Código 00):
    * Status: 200 OK
    * Body:
      ```json
      {
        "code": "00"
      }
      ```

  * Saldo Insuficiente (Código 51):
    * Status: 200 OK
    * Body:
      ```json
      {
        "code": "51"
      }
      ```

  * Conta Não Encontrada (Código 07):
    * Status: 200 OK
    * Body:
      ```json
      {
        "code": "07"
      }
      ```

  * Entrada Inválida (Código 07):
    * Status: 200 OK
    * Body:
      ```json
      {
        "code": "07"
      }
      ```

  * Falhas gerais que impedem a autorização (Código 07):
    * Status: 200 OK
    * Body:
      ```json
      {
        "code": "07"
      }
      ```

#### Criar Nova Conta

* URL: /api/accounts/create
* Método: POST
* Descrição: Cria uma nova conta com saldos iniciais.
* Parâmetros no Corpo da Requisição (JSON):

  |Campo|Tipo|Obrigatório|Descrição|
  |-----|----|-----------|---------|
  |id|string| Sim| Identificador único da conta|
  |foodBalance|	number|	Sim|	Saldo inicial para alimentação|
  |mealBalance|	number|	Sim|	Saldo inicial para refeições|
  |cashBalance|	number|	Sim|	Saldo inicial em dinheiro|

* Exemplo de Requisição:
```json
{
  "id": "acc123",
  "foodBalance": 100,
  "mealBalance": 50,
  "cashBalance": 200
}
```

* Respostas:
  * Sucesso (201 Created):
    ```json
    {
      "success": true
    }
    ```
  * Falha (400 Bad Request):
    ```json
    {
      "success": false,
      "message": "Detalhes do erro."
    }
    ```

#### Adicionar Saldo a uma Conta

* URL: /api/v1/accounts/add-balance
* Método: POST
* Descrição: Adiciona saldo a um tipo específico de balance de uma conta existente.
* Parâmetros no Corpo da Requisição (JSON):

  |Campo|Tipo|Obrigatório|Descrição|
  |-----|----|-----------|---------|
  |accountId|	string|	Sim|	Identificador da conta|
  |balanceType|	string|	Sim|	Tipo de saldo a ser adicionado (foodBalance, |mealBalance, cashBalance)|
  |amount|	number|	Sim|	Valor a ser adicionado|

* Exemplo de Requisição:
  ```json
  {
    "accountId": "acc123",
    "balanceType": "foodBalance",
    "amount": 50
  }
  ```
* Respostas:
  * Sucesso (200 OK):
    ```json
    {
      "success": true
    }
    ```
  * Falha (400 Bad Request):
    ```json
    {
      "success": false,
      "message": "Detalhes do erro."
    }
    ```

#### Obter Dados de uma Conta

* URL: /api/accounts/:accountId
* Método: GET
* Descrição: Recupera os dados completos de uma conta específica, incluindo os saldos atuais.
* Parâmetros na URL:
  |Campo|Tipo|Obrigatório|Descrição|
  |-----|----|-----------|---------|
  |accountId|	string|	Sim|	Identificador da conta a ser buscada|

* Exemplo de Requisição:
    ```bash
    GET /api/v1/accounts/acc123
    ```
* Respostas:
  * Sucesso (200 OK):
    ```json
    {
      "success": true,
      "account": {
        "id": "acc123",
        "foodBalance": 150,
        "mealBalance": 50,
        "cashBalance": 200
      }
    }
    ```
  * Falha (404 Not Found):
    ```json
    {
      "success": false,
      "message": "Account not found."
    }
    ```


#### Collection do Postman AQUI.

### Teste

O projeto inclui uma suite de testes unitários para garantir a qualidade e a correta funcionalidade dos casos de uso e do repositório de contas. Os testes são implementados utilizando Vitest.

#### Executando os Testes

Instalar Dependências de Desenvolvimento

Caso ainda não tenha instalado, execute:

```bash
npm install --save-dev vitest
```

Executar os Testes

```bash
npm test
```

#### Cobertura dos Testes

Os testes abrangem os seguintes cenários:

* `authorizeTransactionUseCase`
  * Orquestração correta do processo de autorização.
  * Integração com o authorizeTransactionService.
  * Respostas corretas para diferentes resultados de autorização.
  * Tratamento de exceções e erros durante a autorização.
* `createAccountUseCase`
  * Criação bem-sucedida de uma nova conta.
  * Falha na criação devido a erros de validação ou banco de dados.
* `addBalanceUseCase`
  * Adição de saldo bem-sucedida em diferentes tipos de balance.
  * Tentativa de adicionar saldo com tipo de balance inválido.
  * Tentativa de adicionar saldo com valor negativo ou zero.
  * Falha na adição de saldo devido a erros no banco de dados
* `getAccountUseCase`
  * Recuperação bem-sucedida dos dados de uma conta existente.
  * Tentativa de recuperar dados de uma conta inexistente.
  * Falha na recuperação devido a erros no banco de dados.
* `validateTransactionInput`
  * Validação bem-sucedida de entradas válidas.
  * Detecção de entradas inválidas ou incompletas.
  * Tratamento de tipos de dados incorretos.
  * Respostas adequadas para diferentes tipos de erros de validação.
* `authorizeTransactionService`
  * Autorização bem-sucedida de transações válidas.
  * Rejeição de transações não autorizadas.
  * Tratamento de erros internos durante o processo de autorização.
  * Integração correta com serviços externos de autorização (se aplicável).

### Dependências Principais

* Node.js: Ambiente de execução para JavaScript no servidor.
* Express.js: Framework web para construção de APIs.
* Knex.js: Query builder para facilitar interações com o banco de dados.
* Vitest: Framework de testes para garantir a qualidade do código.
* SQlite: Banco de dados.
* ES Modules (ESM): Sistema de módulos nativo do Node.js para melhor organização e modularidade do código.

