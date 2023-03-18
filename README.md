# Projeto Trybe Futebol Clube :soccer:

## Sobre o projeto:
<details>
  <summary><strong>O que é o Trybe Futebol Clube?</strong></summary>
  O Trybe Futebol Clube é uma aplicação full-stack de gerenciamento de partidas e classificação de um campeonato de futebol.
</details>

<details>
  <summary><strong>O que eu posso fazer nele?</strong></summary>
  Usuário: <br />
  O usuário pode consultar partidas em andamento e/ou finalizadas além de consultar a classificação dos times como mandantes, como visitantes e também a classificação geral. <br /><br />
  Adminstrador: <br />
  Além de todos os acessos que o usuário comum tem, o administrador pode iniciar partidas, editar e/ou finalizar partidas em andamento.
</details>

<details>
  <summary><strong>Qual foi o principal desafio?</strong></summary>
  O principal desafio foi desenvolver um back-end funcional e intgerá-lo ao front-end já pronto, além de fazer testes de integração para garantir o funcionamento correto da API.
</details>

## Tecnologias:
<details>
  <summary><strong>Como o projeto foi organizado?</strong></summary>
  O projeto seguiu o conceito de arquitetura em camadas, onde foram usadas três camadas. São elas:
  <br />
  <br />
  
  * Camada Model:
    * Camada responsável pela comunicação entre o back-end e o banco de dados.
  * Camada Service:
    * Camada responsável pelas regras de negócio da aplicação.
  * Camada Controller:
    * Camada responsável por receber a requisição e devolver a resposta ao cliente (front-end).
  
</details>

<details>
  <summary><strong>Quais tecnologias foram usadas no projeto?</strong></summary>
  
  * Node.js,
  * Express.js,
  * TypeScript,
  * MySQL,
  * Sequelize,
  * JsonWebToken,
  * Mocha,
  * Chai,
  * Sinon
  
</details>

## Execução do projeto:
<details>
  <summary><strong>Posso executar esse projeto no meu computador?</strong></summary>
  
  Sim! Você pode clonar o repositório e testar a aplicação em sua máquina seguindo os passos abaixo. Recomendo usar o [Docker](https://www.docker.com/).
  <br />
  
  1. Clone o repositório.
  * `git clone git@github.com:rafaelsisoares/trybe-futebol-clube.git`
  * Depois entre no repositório clonado
    * `cd trybe-futebol-clube`
    
  2. Instale as dependências.
  * `npm install`
   
  3. Execute o script de inicialização dos containers.
  * `npm run compose:up`
  * Para parar os serviços:
    * `npm run compose:down`
</details>

<br />
<details>
  <summary>Observações :eyes:</summary>
  
  O código do front-end foi desenvolvido e fornecido pela [Trybe](https://www.betrybe.com/).
</details>
<!-- Olá, Tryber!
Esse é apenas um arquivo inicial para o README do seu projeto.
É essencial que você preencha esse documento por conta própria, ok?
Não deixe de usar nossas dicas de escrita de README de projetos, e deixe sua criatividade brilhar!
:warning: IMPORTANTE: você precisa deixar nítido:
- quais arquivos/pastas foram desenvolvidos por você; 
- quais arquivos/pastas foram desenvolvidos por outra pessoa estudante;
- quais arquivos/pastas foram desenvolvidos pela Trybe.
-->
