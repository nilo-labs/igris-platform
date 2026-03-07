# 🛡️ Igris Platform
> The knight that protects your server. An Observability and AIOps platform.

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

## 📖 Overview
Companies spend a significant amount of money trying to understand what is going wrong with their servers. **Igris** is a monitoring tool designed to predict when a server might fail or when an API is about to start malfunctioning before the end user even notices.

Using an event-driven architecture and Machine Learning models for anomaly detection, **Igris** analyzes real-time log streams and triggers critical alerts when abnormal behavior is detected.

## 🏗️ Monorepo Architecture
This project is structured to scale, using microservices and shared packages:

- **`apps/api`**: Log ingestion engine built with Node.js (Fastify).
- **`apps/web`**: Administrative dashboard and analytics interface (React).
- **`apps/mobile`**: Mobile application for receiving alerts and push notifications (React Native).
- **`services/ml-engine`**: Python worker responsible for anomaly detection models (Isolation Forest / Autoencoders).
- **`packages/`**: Global type definitions, database schemas (Drizzle ORM), and shared configurations.

## 🚀 Running the Project (Work in Progress)
*Setup instructions will be added soon as the MVP development progresses.*

## 📄 License
This project is licensed under the [Apache 2.0](LICENSE).