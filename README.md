Instruções para executar o projeto em abiente local

1. No terminal, execute o comando 'yarn' para instalar as dependências

2. Crie uma imagem do postgres com o comando abaixo

`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11`
