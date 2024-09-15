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
    * Funções Principais:
      * authorizeTransactionService: Autoriza a transação baseada nas regras de negócio, verificando a validade dos inputs e a disponibilidade de saldo.
      * getMerchantMcc: Obtém o código MCC (Merchant Category Code) baseado no nome do comerciante, permitindo ajustes no processo de validação se necessário.

  * validationService (validationService.js): Responsável por validar os inputs das transações, garantindo que o totalAmount seja um número positivo e que o mcc seja um código válido.
    * Funções Principais:
      * validateTransactionInput: Realiza as validações necessárias nos dados de entrada da transação.

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
  * authorizeTransactionUseCase: Orquestra o processo completo de autorização de uma transação financeira. Este caso de uso realiza as seguintes etapas:

    1.  Recuperação da Conta: Utiliza o AccountRepository para buscar a conta pelo accountId.
    2.  Validação da Conta: Verifica se a conta existe; caso contrário, retorna um erro.
    3.  Autorização da Transação: Invoca o authorizeTransactionService para validar e autorizar a transação.
    4.  Registro da Transação: Utiliza o TransactionRepository para registrar a nova transação no sistema.
    5.  Atualização da Conta: Atualiza os saldos da conta com base na autorização realizada.
    6.  Resposta Final: Retorna o resultado da autorização, indicando sucesso ou falha com os respectivos códigos.

#### Interação com Outras Camadas:

Os casos de uso da camada de Aplicação utilizam as entidades e serviços da camada de Domínio para executar a lógica de negócio e interagem com os repositórios da camada de Infraestrutura para persistir e recuperar dados necessários para a operação.

### Camada de Infraestrutura (/src/infrastructure)

#### Responsabilidade:

A camada de Infraestrutura fornece implementações concretas para as interfaces de repositórios definidas na camada de Domínio, além de gerenciar integrações com sistemas externos, como bancos de dados. Ela é responsável pela persistência de dados e configurações necessárias para o funcionamento do sistema.

#### Componentes Principais:

* Persistência (persistence/repositories):
  * AccountRepositoryDatabase: Implementa a interface AccountRepository utilizando Knex.js para interagir com o banco de dados. As principais operações incluem:
    * findById: Busca uma conta no banco de dados pelo seu id.
    * update: Atualiza os saldos da conta no banco de dados após a autorização da transação.
  * TransactionRepositoryDatabase: Implementa a interface TransactionRepository utilizando Knex.js para inserir novas transações no banco de dados.
    * create: Registra uma nova transação financeira no banco de dados.

#### Interação com Outras Camadas:

A camada de Infraestrutura implementa as interfaces de repositórios definidas na camada de Domínio, permitindo que a lógica de negócio interaja com os dados de forma desacoplada. Além disso, utiliza configurações definidas para conectar-se e operar sobre o banco de dados conforme as necessidades do sistema.

### Camada de Interface (/src/interfaces)

#### Responsabilidade:

A camada de Interfaces expõe as funcionalidades do sistema através de endpoints HTTP, permitindo que clientes externos (como aplicações frontend ou outros serviços) interajam com o autorizador de transações financeiras.

#### Componentes Principais:

* Controladores (controllers):
  * transactionController: Manipula as requisições HTTP relacionadas a transações. Este controlador recebe os dados da requisição, invoca o caso de uso authorizeTransactionUseCase com os parâmetros fornecidos e retorna a resposta adequada ao cliente com base no resultado da autorização.
    * Funções Principais:
      * authorizeTransaction: Processa a autorização de uma transação, lidando com respostas de sucesso, falha ou erros internos.
  * Rotas (routes):
    * transactionRoutes: Define os endpoints da API relacionados a transações. Mapeia rotas específicas para os controladores correspondentes.
  * Principais Endpoints:
    * POST /api/transactions: Endpoint para autorizar uma nova transação financeira. Invoca a função authorizeTransaction do transactionController.

#### Interação com Outras Camadas:

Os controladores da camada de API utilizam os casos de uso da camada de Aplicação para executar operações solicitadas pelos clientes. A API atua como a interface de entrada para o sistema, recebendo requisições externas, processando-as através das camadas internas e retornando respostas apropriadas.

### Detalhes da API

A API do projeto expõe endpoints para autorizar transações financeiras, permitindo que clientes externos interajam com o sistema de forma segura e eficiente.

#### Autorizar Transação

* URL: /api/transactions/
* Método: POST
* Descrição: Autoriza uma transação financeira para uma conta específica.
* Body da Requisição:
```json
{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}
```

* Parâmetros:
  * accountId (string): Identificador único da conta.
  * totalAmount (number): Valor total da transação.
  * mcc (string): Código de categoria do comerciante (Merchant Category Code).
  * merchant (string): Nome do comerciante.

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
      
#### Exemplos de Requisição com cURL


```bash
curl -X POST http://localhost:3000/api/transactions/authorize \
-H "Content-Type: application/json" \
-d '{
  "accountId": "123",
  "totalAmount": 50.0,
  "mcc": "5411",
  "merchant": "UBER TRIP                   SAO PAULO BR"
}'
```

#### Collection do Postman AQUI.

### Dependências Principais
* Node.js: Ambiente de execução para JavaScript no servidor.
* Express.js: Framework web para construção de APIs.
* Knex.js: Query builder para facilitar interações com o banco de dados.
* Vitest: Framework de testes para garantir a qualidade do código.
* SQlite: Banco de dados.
* ES Modules (ESM): Sistema de módulos nativo do Node.js para melhor organização e modularidade do código.
