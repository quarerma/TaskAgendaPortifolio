# TaskAgendaPortifolio

## Código exemplo de um sistema implementado com o intuito armazenar e gerenciar tarefas e horários de uma empresa,

### Funcionamento Back-end:

#### Criado em TypeScript, utilizando do Framework NestJs para melhor escalabilidade e ferramentas de segurança, como Jwt.
#### Requisições são feitas com TokenJwt, com auxilio das bibliotecas: passport e jwt do Nest.
#### Para ações no Banco, foi utilizado a ORM Prisma.

### Funcionamento Front-end:

#### Criado em TypeScript, utilizando React e TailwindCss.
#### Ao realizar Login, o sistema armazena o TokenJwt no navegador para futuras requisições
#### Para medidas de segurança e evitar acessos restritos de usuário, a cada rederização de página é disparada uma função que checa a validade desse Token, é possível ver isso no arquivo protected-pages-component.tsx
