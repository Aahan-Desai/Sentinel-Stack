# Sentinel Stack

> A production-grade multi-tenant SaaS backend for monitoring service health, executing automated uptime checks, and calculating availability metrics using a background worker architecture.

Sentinel Stack is designed to demonstrate **real backend engineering practices** rather than simple CRUD operations.

## Problem Statement

Modern applications depend on multiple internal and external services (APIs, websites, authentication systems). When one of these services goes down, teams often discover the issue only **after users complain**.

### Sentinel Stack Solves This By:

- Allowing teams to define services and health checks
- Continuously monitoring them in the background
- Storing historical results
- Exposing real-time service health and uptime metrics through APIs

## Key Features

- **Multi-tenant architecture** with strict tenant isolation
- **Role-Based Access Control** (Admin / Member)
- **JWT authentication** with refresh token support
- **Configurable service and health check management**
- **Background worker** for scheduled uptime checks
- **Time-series storage** of check results
- **Derived uptime percentage** and service status
- **Centralized error handling**
- **Pagination** for scalable APIs
- **Rate limiting** on authentication endpoints

## Architecture Overview

Sentinel Stack is split into **two independent processes**:

### 1. API Server
- Handles authentication and authorization
- Exposes REST APIs for services, checks, and status
- Performs validation and configuration only

### 2. Worker Process
- Runs independently of HTTP requests
- Periodically executes health checks based on configured intervals
- Records results used for uptime calculations

Both processes share the same database but have **clearly separated responsibilities**.

## Core Domain Model

```
Tenant
  └── Service
      └── Check
          └── CheckResult
```

### Domain Concepts

- **Tenant**: An organization using Sentinel Stack
- **Service**: A logical system being monitored (e.g., Auth API, Website)
- **Check**: An HTTP endpoint with an interval and timeout
- **CheckResult**: The outcome of each heartbeat execution

This structure allows clean aggregation of uptime metrics and strong tenant isolation.

## Background Processing

Monitoring execution is **decoupled from HTTP requests**:

- APIs are used only to configure services and checks
- A worker process periodically determines which checks are due
- Each check execution records a result (up/down, response time)
- Uptime is derived dynamically from historical results rather than stored directly

This mirrors how **real-world monitoring platforms** are built.

## API Overview

### Authentication
- `POST /auth/register` - Register a new tenant
- `POST /auth/login` - Login and receive JWT
- `POST /auth/refresh` - Refresh expired token
- `POST /auth/logout` - Logout user

### Services
- `POST /services` - Create service (admin only)
- `GET /services` - List services (paginated)
- `GET /services/:serviceId/status` - Get real-time service status

### Checks
- `POST /services/:serviceId/checks` - Create health check (admin only)
- `GET /services/:serviceId/checks` - List checks (paginated)

**All endpoints enforce tenant isolation and role-based access control.**

## Security Considerations

- **JWT-based authentication** with role-based authorization
- **Tenant isolation** enforced at the database query level
- **Rate limiting** applied to authentication endpoints
- **Centralized error handling** to avoid information leakage

## Tech Stack

- **Node.js** / Express
- **MongoDB** with Mongoose
- **JWT** Authentication
- **Background workers** (Node.js)
- **Axios** for HTTP health checks

## Trade-offs & Future Improvements

- **Offset-based pagination** was chosen for simplicity; cursor-based pagination could be introduced at scale
- **Worker execution** is currently in-process and can be migrated to a queue-based system (e.g., BullMQ, Redis)
- **WebSocket-based real-time updates** planned for live dashboards
- **Metrics caching** could be added for high-traffic dashboards
- **Containerized deployment** with Nginx planned for production use

## Running Locally

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables
4. Start the API server:
   ```bash
   npm run dev
   ```
5. Start the worker process:
   ```bash
   node src/workers/worker.js
   ```

Final Note

Sentinel Stack is intentionally designed to focus on **backend architecture**, **background processing**, and **system design trade-offs**, rather than frontend-heavy features.

It serves as a portfolio project that reflects how **production monitoring systems** are structured.
