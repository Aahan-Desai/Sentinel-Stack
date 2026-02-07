# Sentinel Stack

Sentinel Stack is a **multi-tenant SaaS backend** for monitoring service uptime, tracking health checks, and calculating availability metrics using a background worker architecture.

This project is intentionally built to demonstrate **real backend engineering practices** rather than a simple CRUD application.

---

## 🚀 What Problem Does It Solve?

Modern applications depend on multiple internal and external services (APIs, websites, auth servers).  
When a service goes down, teams often find out **after users complain**.

Sentinel Stack allows organizations to:
- define services they depend on
- configure automated health checks
- continuously monitor uptime in the background
- derive service health and availability metrics
- enforce strict tenant and role-based isolation

---

## 🧠 Core Concepts

Sentinel Stack is designed as a **production-style SaaS backend**, focusing on:

- Multi-tenant architecture
- Secure authentication & authorization
- Background processing
- Time-based health monitoring
- Clean modular backend design

---

## 🏗️ Architecture Overview

The system is split into **two independent processes**:

### 1️⃣ API Server
Responsible for:
- Authentication & authorization
- Tenant isolation
- Managing services and checks
- Exposing REST APIs

### 2️⃣ Worker Process
Responsible for:
- Executing scheduled health checks
- Measuring response time
- Recording success/failure
- Feeding data used for uptime calculations

> The worker runs independently of HTTP requests, mirroring real monitoring systems.

---

## 🧩 Domain Model

Tenant
└── User
└── Service
└── Check
└── CheckResult


### Explanation
- **Tenant**: An organization using Sentinel Stack
- **User**: Member or admin belonging to a tenant
- **Service**: A system being monitored (e.g. API, website)
- **Check**: Configuration defining how and when to monitor a service
- **CheckResult**: Time-series record of each health check execution

---

## 🔐 Authentication & Security

- JWT-based authentication
- Refresh tokens stored in httpOnly cookies
- Role-Based Access Control (Admin / Member)
- Tenant-level data isolation
- Rate-limited authentication endpoints
- Passwords stored as secure hashes

---

## 📡 Monitoring Logic

- Health checks are configured via APIs
- Background worker periodically executes checks
- Each execution records:
  - status (up/down)
  - response time
- Uptime percentage and service status are **derived dynamically** from historical data

---

## 📄 API Overview

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Services
- `POST /services` (admin only)
- `GET /services` (paginated)
- `GET /services/:id/status`

### Checks
- `POST /services/:id/checks` (admin only)
- `GET /services/:id/checks` (paginated)

All routes enforce authentication, authorization, and tenant isolation.

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Background workers
- Axios (for HTTP checks)

---

## 🧪 Engineering Highlights

- Clean layered architecture (routes → controllers → services → models)
- Centralized error handling
- Pagination for scalable APIs
- Secure defaults (hidden password fields, explicit selection)
- Environment-based configuration
- Git-safe secrets management

---

## ▶️ Running Locally

### Prerequisites
- Node.js
- MongoDB

### Setup

1. Install dependencies

### Explanation
- **Tenant**: An organization using Sentinel Stack
- **User**: Member or admin belonging to a tenant
- **Service**: A system being monitored (e.g. API, website)
- **Check**: Configuration defining how and when to monitor a service
- **CheckResult**: Time-series record of each health check execution

---

## 🔐 Authentication & Security

- JWT-based authentication
- Refresh tokens stored in httpOnly cookies
- Role-Based Access Control (Admin / Member)
- Tenant-level data isolation
- Rate-limited authentication endpoints
- Passwords stored as secure hashes

---

## 📡 Monitoring Logic

- Health checks are configured via APIs
- Background worker periodically executes checks
- Each execution records:
  - status (up/down)
  - response time
- Uptime percentage and service status are **derived dynamically** from historical data

---

## 📄 API Overview

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Services
- `POST /services` (admin only)
- `GET /services` (paginated)
- `GET /services/:id/status`

### Checks
- `POST /services/:id/checks` (admin only)
- `GET /services/:id/checks` (paginated)

All routes enforce authentication, authorization, and tenant isolation.

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Background workers
- Axios (for HTTP checks)

---

## 🧪 Engineering Highlights

- Clean layered architecture (routes → controllers → services → models)
- Centralized error handling
- Pagination for scalable APIs
- Secure defaults (hidden password fields, explicit selection)
- Environment-based configuration
- Git-safe secrets management

---

## ▶️ Running Locally

### Prerequisites
- Node.js
- MongoDB

### Setup

1. Install dependencies
npm install


2. Create a `.env` file
PORT=5111
MONGO_URI=mongodb://localhost:27017/sentinelstack
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret file


3. Start API server
npm run dev

4. Start worker process
node src/workers/worker.js


---

## 🔮 Future Improvements

- WebSocket-based real-time updates
- Redis-backed job queues
- Docker + Nginx deployment
- Public status dashboards
- Metrics aggregation & caching

---

## 🎯 Why This Project Matters

Sentinel Stack focuses on **how real backend systems are designed**, not just on features.

It demonstrates:
- backend architecture thinking
- multi-tenant SaaS patterns
- background processing
- security-conscious development

This project is intended as a **portfolio-quality backend system**, suitable for technical interviews and real-world discussion.

