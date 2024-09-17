# L4. Questão Aberta

## Resposta:

Combinação de `Optimistic Locking` e `Distributed Locking` no controle de transações simultâneas

### Contexto

### Optimistic Locking

Optimistic Locking, como abordagem para controle de concorrência, assume que a ocorrência de conflitos é raro, de modo que em vez de realizar o bloqueio de recursos de forma antecipada, permite que múltiplas transações acessem os mesmos dados simultaneamente. Nesse cenário, a consistência dos dados é verificada somente no momento em que a transação faz a confirmação de suas alterações.

#### Funcionamento:

Cada registro no banco de dados passa a possuir uma coluna adicional, geralmente chamada de version ou timestamp. Quando uma transação lê um registro, ela também lê a versão atual desse registro. Ao tentar atualizar o registro, a transação verifica se a versão no momento do commit ainda corresponde à versão que foi lida inicialmente. Neste momento, podem ocorrer duas coisas: confirmação ou rejeição. Se as versões coincidirem, é permitida a atualização dos dados e a versão é incrementada. Caso contrário, se as versões forem diferentes, isso indica que outra transação modificou o registro e a transação atual é rejeitada ou, em alguns casos, reexecutada.

#### Trade-offs

O Optimistic Locking é ideal para ambientes onde os conflitos são raros, permitindo maior paralelismo sem a necessidade de bloqueios constantes. Além disso, ele facilita a escalabilidade da aplicação, através de escalonamento horizontal, já que não depende de um mecanismo centralizado de bloqueio.
Redução de Deadlocks: Minimiza a ocorrência de deadlocks, pois não mantém bloqueios durante a execução das transações.

Em contra-partida, é possível que em cenários de alta concorrência a taxa de conflitos aumente, e tenhamos mais transações rejeitadas ou que necessitem de reexecuções. Temos também um aumento da complexidade de implementação, já que ele requer uma lógica adicional para gerenciar versões e tratar transações conflitantes.

### Distributed Locking

Se considerarmos cenários de alta concorrência, como múltiplas instâncias de API operando em paralelo, recursos como o Distributed Locking, que funciona em um ambiente distribuído, podem garantir que apenas uma instância da aplicação acesse e modifique um registro de conta específico, por vez.

#### Funcionamento:

Antes de processar uma transação, a instância da API tenta adquirir um lock para a conta específica (por exemplo, através do campo accountId). Se o lock for adquirido com sucesso, a transação é processada de forma exclusiva por essa instância. Após o processamento, o lock é liberado, permitindo que outras transações possam ser processadas para a mesma conta, por qualquer instância da API.

Garantindo que apenas uma instância da aplicação processe uma transação para uma conta específica de cada vez, previnimos que múltiplas transações concorrentes modifiquem os mesmos dados simultaneamente, mantendo a consistência dos saldos nas contas e evitando condições de corrida.

#### Trade-offs

O Distributed locking assegura exclusividade no processamento de transações para uma conta específica, mas requer o gerenciamento de uma infraestrutura adicional. Se não gerenciado corretamente, pode levar a situações onde transações ficam bloqueadas indefinidamente ou nunca conseguem adquirir o lock. Devido a dependência da disponibilidade e performance do sistema de gerenciamento de locks (por exemplo, Redis), isso pode se tornar um ponto de falha se não for corretamente replicado e escalado.

### Combinação de Optimistic Locking e Distributed Locking

Para sistemas de larga escala e em produção, penso que a combinação de Optimistic Locking com Distributed Locking pode oferecer uma solução robusta e eficiente para gerenciar transações simultâneas:

Implementar locks distribuídos para garantir que somente uma instância da aplicação possa processar uma transação para uma conta específica por vez reduz a possibilidade de conflitos durante o processamento inicial da transação. Mas mesmo com o controle exclusivo, é prudente utilizar Optimistic Locking para verificar a consistência dos dados no momento do commit, adicionando uma camada adicional de segurança, garantindo que as transações sejam realmente consistentes, mesmo em casos raros de falhas no mecanismo de lock. Além disso, a combinação permite que o sistema escale horizontalmente com múltiplas instâncias da API, mantendo a integridade dos dados e o desempenho dentro dos limites exigidos.

Fluxo de Implementação Combinada:

<img src="https://github.com/eusouojel/transactions_authorization/blob/main/L4-graphv2.jpg"/>

**Descrição do Fluxo**

1. Recebimento da Transação:
  * A API recebe a solicitação de transação do cliente.
2. Aquisição do Lock Distribuído:
  * A instância da API tenta adquirir um lock distribuído para o accountId correspondente, garantindo que nenhuma outra transação para a mesma conta seja processada simultaneamente.
3. Verificação do Lock:
  * Se o lock for adquirido com sucesso:
    * A transação prossegue para o processamento utilizando Optimistic Locking.
  * Se o lock não for adquirido:
    * A transação é rejeitada imediatamente para evitar espera e potencial timeout.
4. Processamento da Transação com Optimistic Locking:
  * Leitura do Saldo e Versão Atual:
    * A aplicação lê o saldo atual e a versão da conta no banco de dados.
  * Cálculo e Tentativa de Atualização:
    * Calcula o novo saldo com base na transação solicitada.
    * Tenta atualizar o saldo no banco de dados verificando se a versão ainda é a mesma lida inicialmente.
  * Verificação da Versão:
    * Se a versão coincidir:
      * A atualização é confirmada e a versão da conta é incrementada para refletir a alteração.
    * Se a versão não coincidir:
      * Indica que outra transação modificou a conta simultaneamente, e a transação atual é rejeitada ou reexecutada para evitar inconsistências.
5. Liberação do Lock:
  * Após a conclusão do processamento (seja com sucesso ou falha), o lock distribuído é liberado, permitindo que outras transações possam ser processadas para a mesma conta.
6. Resposta ao Cliente:
  * A API responde ao cliente com o resultado da transação, informando sucesso ou falha conforme o processamento realizado.
