L4. Questão Aberta

Contexto:

Em um sistema de autorização de transações financeiras em produção, a integridade e consistência dos dados são fundamentais para garantir a confiança dos usuários e a conformidade com as operações e possíveis regulamentações financeiras.

Quando múltiplas transações são iniciadas simultaneamente surge a possibilidade de ocorrem condições de corrida que podem comprometer o saldo disponível. Considerando que todas as solicitações de transação são síncronas e precisam ser processadas rapidamente (menos de 100 ms) para evitar timeouts, é essencial implementar mecanismos possam garantir que apenas uma transação por conta seja processada em um determinado momento.


Para gerenciar essas transações simultâneas, vamos considerar:
1. Consistência de Dados: Isso evita que condições de corrida levem a inconsistências nos saldos.
2. Desempenho: Manter o tempo de processamento abaixo de 100 ms por transação para garantir a experiência do usuário e evitar timeouts.

Antes de elaborar uma solução, vamos considerar os seguintes aspectos:
* Escalabilidade: O sistema deve ser capaz de lidar com um grande volume de transações simultâneas sem que o desempenho seja degradado.
* Atomicidade: Cada transação deve ser processada de forma completa ou, caso contrário, não ser processada, afim de garantir que não haja estados intermediários.
* Isolamento: As transações devem ser isoladas umas das outras para evitar interferências, garantindo que o resultado de uma transação não afete outra.
* Latência: A solução deve garantir que as transações sejam processadas rapidamente, mantendo o tempo total de processamento abaixo de 100 ms.


Soluções Propostas

Para garantir que apenas uma transação por conta seja processada em um determinado momento em um ambiente de produção, várias abordagens podem ser consideradas, mas as abordagens (ou combinações delas) podem ser as mais adequadas para o problema apresentado:

Controle de Concorrência no Nível do Banco de Dados

Utilizar Transações (transactions) ACID com Níveis de Isolamento Apropriados

Utilizar as propriedades ACID das transações de banco de dados garantem que operações sobre uma mesma conta sejam processadas isoladamente. Isso pode ser feito a nível de isolamento serializado, definindo que as transações seja iniciadas e finalizadas de forma completamente isoladas de outras transações. Dessa forma, ao atualizar um saldo de uma conta, a utilização de bloqueios impedem que outras transações acessem ou modifiquem a mesma linha simultaneamente.

Com essa abordagem, é possível obter consistência dos dados, garantindo que apenas uma transação possa modificar os saldos de uma conta por vez. Além disso, o processo é realizado pelo próprio banco de dados, que gerencia os bloqueios e o isolamento.

Em contra-partida, dependendo dos níveis de isolamento e bloqueios necessários, pode haver impactos importantes na performance, principalmente quando em alta concorrência.


Controle de Concorrência no Nível da Aplicação

Filas de Processamento por Conta

A utilização de filas dedicada para cada podem garantir que as transações sejam, para cada conta em particular, processadas de forma sequencial. Essa estrutura pode ser feita utilizando soluções como o Amazon SQS, RabbitMQ, Kafka ou Redis Streams. O funcionamento seria basicamente o de receber uma transação, enfileirá-la na fila correspondente a cada conta. Em seguida, um processamento sequencial seria realizado por consumidores (consumers), que processariam as transações uma de cada vez, garantindo que não haja concorrência na atualização dos saldos da conta.

Com essa abordagem, é possível criar um isolamento completo, garantindo que apenas uma transação seja processada por vez, por conta. Além disso, ganhamos temos a capacidade de escalar horizontalmente, uma vez que há a possibilidade de adicionar mais consumers, aumentando a capacidade de processamento.

Em contra-partida, podemos introduzir uma latência adicional quando há um acumula de transações enfileiradas ou quando no atraso do processamento das mesmas. Fora isso, a manutenção da infraestrutura de filas e o gerenciamento dos consumers trazem uma maior complexidade para a aplicação.


Resposta a questão L4: Uma combinação de abordagens

É possível utilizar os benefícios e diminuir as desvantagens de cada uma das soluções acima, combinando as abordagens, ou seja:

Realizar o controle de concorrência no Banco de Dados, utilizando transações ACID e bloqueios exclusivos para garantir a consistência dos dados e implementar filas para gerenciar a ordem de processamento das transações de cada conta.

Fluxo de Processamento de Transações

O fluxo abaixo exemplifica como as transações podem ser processadas utilizando controle de concorrência a nível de banco de dados e filas de processamento na aplicação:


[Cliente] 
    |
    v
[API de Transação]
    |
    v
[Enfileirar Transação na Fila da Conta]
    |
    v
[Consumidor da Fila]
    |
    v
[Iniciar Transação no Banco de Dados]
    |
    v
[Selecionar Conta com Bloqueio Exclusivo]
    |
    v
[Verificar Saldo]
    |
    |-- Saldo >= Montante --|
    |                       |
    v                       v
[Atualizar Saldo]     [Rollback]
    |                       |
    v                       v
[Registrar Transação]  [Log de Erro]
    |
    v
[Commit]
    |
    v
[Responder ao Cliente com Sucesso]


Consideraçõ