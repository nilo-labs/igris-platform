# 🛡️ Igris Platform
> O cavaleiro que protege o seu servidor. Plataforma de Observabilidade e AIOps.

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

## 📖 Visão Geral
Empresas pagam muito caro para entender o que está dando errado em seus servidores. O **Igris** é uma ferramenta de monitoramento que prevê quando um servidor vai cair ou uma API vai começar a falhar antes mesmo que o usuário final perceba.

Utilizando uma arquitetura orientada a eventos e modelos de Machine Learning para detecção de anomalias, o Igris analisa fluxos de logs em tempo real e dispara alertas críticos.

## 🏗️ Arquitetura do Monorepo
Este projeto foi estruturado para escalar, utilizando microsserviços e pacotes compartilhados:

- **`apps/api`**: O motor de ingestão de logs em Node.js (Fastify).
- **`apps/web`**: Dashboard administrativo e gráficos de análise (React).
- **`apps/mobile`**: Aplicativo para recebimento de alertas e notificações push (React Native).
- **`services/ml-engine`**: Worker em Python responsável pelo modelo de detecção de anomalias (Isolation Forest/Autoencoders).
- **`packages/`**: Tipagens Globais, Schemas de Banco de Dados (Drizzle ORM) e configurações compartilhadas.

## 🚀 Como Executar (Em Desenvolvimento)
*As instruções de setup serão adicionadas em breve conforme o MVP for finalizado.*

## 📄 Licença
Este projeto está sob a licença [Apache 2.0](LICENSE).