Instruções para executar o projeto em abiente local

1. No terminal, execute o comando 'yarn' para instalar as dependências

2. Crie uma imagem do postgres com o comando abaixo

`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11`

3. Crie um banco de dados com o nome shipets em seu postgres. Você pode utilizar uma interface de usuário compatível com o postgres para tal. Aconselho o uso do Postbird https://electronjs.org/apps/postbird

atente-se de que os dados para se conectar ao banco local são:

host: localhost
username: postgres
password: docker

4. Com o banco de dados "shipets" criado, volte ao terminal e execute o comando

`yarn sequelize db:migrate`

Feito isso, as migrations serão executadas, criando as tabelas e relacionamentos no banco de dados.

5. Você pode criar a sua colecao de requisições  pelo postman ou pelo insomnia. Caso deseje, é possível importar uma coleção pronta do postman por meio do link a seguir: 
