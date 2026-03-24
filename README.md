<div align="center">

<img src="./assets/logo-igris-platform.png" alt="Igris Platform Logo" width="90"/>

# IGRIS

**The knight that protects your servers.**
An **Observability and AIOps platform** designed to detect anomalies and predict infrastructure failures before users even notice them.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat\&logo=typescript\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat\&logo=node.js\&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat\&logo=python\&logoColor=white)

</div>

---

# Overview

Modern applications generate massive volumes of logs and operational events.
When something breaks, engineering teams often spend **hours investigating logs and metrics** to identify the root cause.

**Igris** is an observability and AIOps platform designed to **proactively detect anomalies in system behavior** by analyzing real-time log streams using Machine Learning models.

Instead of reacting to failures, **Igris predicts them**.

The platform continuously monitors infrastructure signals and alerts engineers when abnormal patterns appear — often **before a failure impacts users**.

---

# Screenshot

<img src="./assets/print-dashboard.png" alt="print dashboard"/>

---

# Key Features

### Real-time Log Ingestion

High-throughput ingestion pipeline designed to process large volumes of system and application logs.

### AI-powered Anomaly Detection

Machine Learning models such as **Isolation Forests** and **Autoencoders** detect subtle behavioral anomalies in infrastructure data.

### Proactive Alerting

Receive alerts via push notifications, dashboards, or webhooks before failures escalate.

### Unified Observability Dashboard

A centralized interface to visualize logs, anomalies, alerts, and infrastructure health.

---

# System Architecture

Igris follows an **event-driven architecture** where telemetry is ingested, stored, analyzed by ML models, and transformed into actionable insights.

```text
[ Hardware / Servers ]
          │
          ▼
   Agent (Node.js) ──────────► Collects CPU/RAM/System Metrics
          │
          ▼
 API Gateway (Fastify) ──────► PostgreSQL (Relational Data & Servers)
          │
          ▼
 InfluxDB (Time-Series) ─────► Stores historical telemetry
          │
          ▼
  AI Engine (Python) ────────► Runs Isolation Forest Anomaly Detection
          │
          ▼
Alerts & Event Processing ───► Triggers Anomaly Webhooks
          │
          ▼
 Web Dashboard (React) ──────► Real-time Observability
```

The platform separates responsibilities into independent services to ensure scalability and flexibility.

---

# Monorepo Architecture

This project is structured as a **monorepo** to facilitate collaboration, code sharing, and scalability across services.

## Project Structure

```
igris-platform
│
├── apps
│   ├── api        # Log ingestion service (Node.js + Fastify)
│   ├── web        # Observability dashboard (React)
|   ├── ai-engine  # Machine learning worker (Python)
|   ├── agent      # hardware metrics collector (Node.js)
│   └── mobile     # Mobile alerting app (React Native)
│
├── packages
│   └── database   # Database schema and ORM configuration
│
└── docs
    ├── adr        # Architectural Decision Records
    └── architecture
```

Shared packages allow all services to reuse types, schemas, and core logic while maintaining service independence.

---

# Tech Stack

## Backend

* Node.js
* Fastify
* TypeScript

## Frontend & Mobile

* React
* React Native

## Machine Learning

* Python
* Isolation Forest
* Autoencoders

## Database & Infrastructure

* PostgreSQL (Relational Data)
* Drizzle ORM
* InfluxDB (Time-Series Data)
* Docker & Docker Compose

## Architecture

* Event-driven architecture
* Microservices
* Monorepo with shared packages

---

# Project Status

**Phase 1 (MVP) is officially complete and functional.** The core infrastructure is up and running, featuring:
* Real-time hardware telemetry agent
* Log ingestion pipeline via Fastify
* Machine learning anomaly detection (Isolation Forest)
* Unified observability dashboard

---

# Roadmap

### Phase 1 — MVP ✅
* [x] Log ingestion API
* [x] Basic anomaly detection
* [x] Initial dashboard
* [x] Alert system

### Phase 2 — Observability Platform

* Advanced anomaly detection models
* Infrastructure metrics integration
* Alert routing
* Historical anomaly analysis

### Phase 3 — AIOps Platform

* Predictive infrastructure analytics
* Automated incident detection
* AI-assisted root cause analysis
* Automated remediation workflows

---

# Vision

The long-term vision of **Igris** is to evolve into a **fully autonomous AIOps platform** capable of:

* Predicting infrastructure failures before they happen
* Automatically detecting incidents
* Assisting engineers in root cause analysis
* Providing intelligent remediation suggestions

Ultimately, Igris aims to reduce operational complexity and empower teams to focus on building reliable systems.

---

# 🚀 Getting Started

The entire platform is containerized for easy deployment and testing.

### Prerequisites
* Docker & Docker Compose
* Git

### Quick Start

1. Clone the repository:
   ```bash
   git clone [https://github.com/danilotavares-dev/igris-platform.git](https://github.com/danilotavares-dev/igris-platform.git)
   cd igris-platform
   ```
2.  Start the platform:
   ```bash
   docker compose up --build -d
   ```
3. Access the services:
* Dashboard: http://localhost:5173

* API: http://localhost:3333

* InfluxDB: http://localhost:8086

---
# Contributing

Contributions are welcome!

As the project evolves, a detailed **CONTRIBUTING.md** guide will be provided.

For now:

1. Open an issue describing your idea
2. Discuss architecture or improvements
3. Submit a pull request

---

# 📄 License

This project is licensed under the **Apache 2.0 License**.

See the [LICENSE](LICENSE) file for more information.
