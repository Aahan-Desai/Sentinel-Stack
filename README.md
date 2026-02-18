# Sentinel Stack

Sentinel Stack is a **multi-tenant SaaS backend** for monitoring service uptime, tracking health checks, and calculating availability metrics using a background worker architecture.

This project is intentionally built to demonstrate **real backend engineering practices** rather than a simple CRUD application.

---

## 🚀 What Problem Does It Solve?

Modern applications depend on multiple internal and external services (APIs, websites, auth servers).  
When a service goes down, teams often find out **after users complain**.

Sentinel Stack allows organizations to:
- Define services they depend on
- Configure automated health checks
- Continuously monitor uptime in the background
- Derive service health and availability metrics
- Enforce strict tenant and role-based isolation

---

## 🧠 Core Concepts

Sentinel Stack is designed as a **production-style SaaS backend**, focusing on:

- **Multi-tenant architecture**: Physical data isolation between organizations.
- **Secure authentication & authorization**: JWT-based auth with Role-Based Access Control.
- **Background processing**: Independent worker handles monitoring logic without blocking the API.
- **Time-based health monitoring**: Tracking uptime percentages and latency over time.
- **Clean modular backend design**: Clear separation of concerns between routes, controllers, and services.

---

## 🏗️ Architecture Overview

The system is split into **two independent processes**:

### 1️⃣ API Server
Responsible for:
- Authentication & authorization
- Tenant isolation
- Managing services and checks
- Exposing REST APIs for the frontend

### 2️⃣ Worker Process
Responsible for:
- Executing scheduled health checks
- Measuring response time
- Recording success/failure
- Feeding data used for uptime calculations

> The worker runs independently of HTTP requests, mirroring real monitoring systems.

---

## 🧩 Domain Model

- **Tenant**: An organization (workspace) using Sentinel Stack.
- **User**: Member or admin belonging to a tenant.
- **Service**: A system being monitored (e.g. API, website).
- **Check**: Configuration defining how and when to monitor a service.
- **CheckResult**: Time-series record of each health check execution.

---

## 🔐 Authentication & Security

- JWT-based authentication with Access and Refresh tokens.
- Refresh tokens stored in `httpOnly` cookies for security.
- Role-Based Access Control (Admin / Member).
- Tenant-level data isolation (Middleware-driven).
- Passwords stored as secure bcrypt hashes.

---

## 📡 Monitoring Logic

- Health checks are configured via APIs.
- Background worker periodically executes checks using Axios.
- Each execution records status (up/down) and response time.
- Uptime percentage and service status are **derived dynamically** from historical data samples.

---

## 📄 API Overview

### Authentication
- `POST /auth/register` - Create a new tenant and admin user
- `POST /auth/login` - Authenticate and receive tokens
- `POST /auth/refresh` - Swap refresh token for a new access token
- `POST /auth/logout` - Clear session and cookies

### Services
- `POST /services` - Create a new service (Admin only)
- `GET /services` - List all services for the tenant (Paginated)
- `GET /services/:id/status` - Get live status and uptime metrics

### Checks
- `POST /services/:id/checks` - Configure monitor frequency (Admin only)
- `GET /services/:id/checks` - List monitor configurations

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Security**: JWT, bcrypt
- **Monitoring**: Background workers, Axios
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons

---

## 🧪 Engineering Highlights

- **Clean Layered Architecture**: Logic flows predictably (routes → controllers → services → models).
- **Centralized Error Handling**: Standardized API responses and error mapping.
- **Pagination**: Built-in support for scalable APIs.
- **Environment-based Configuration**: Securely managed secrets and endpoints.
- **Case-Insensitive Slugs**: Robust tenant resolution logic.

---

## ▶️ Running Locally

### Prerequisites
- Node.js
- MongoDB

### Setup

1. **Install dependencies**
   ```bash
   # Root
   npm install
   # Client
   cd client && npm install
   ```

2. **Create a `.env` file in the root**
   ```env
   PORT=5111
   MONGO_URI=mongodb://localhost:27017/sentinelstack
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLIENT_URL=http://localhost:5173
   ```

3. **Start the system**
   ```bash
   # Start API server (Root)
   npm run dev
   
   # Start Worker process (Root)
   node src/workers/worker.js
   
   # Start Frontend (Client folder)
   npm run dev
   ```

---

## 🔮 Future Improvements

- WebSocket-based real-time dashboard updates
- Redis-backed job queues for check scheduling
- Public status page for organizations
- Integration with Slack/Discord for outage alerts
- Multi-region monitoring probes

---

## 🎯 Why This Project Matters

Sentinel Stack focuses on **how real backend systems are designed**, not just on features. It demonstrates proficiency in multi-tenant SaaS patterns, background processing, and security-conscious development. This project is intended as a **portfolio-quality backend system**, suitable for technical interviews and deep architectural discussions.
