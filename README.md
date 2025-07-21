## Hybrid Database System API

A powerful Express.js-based API that smartly separates and manages structured and unstructured data using SQL (MySQL via Sequelize) and NoSQL (MongoDB via Mongoose). It supports JWT authentication, Redis caching, and uses RabbitMQ (via Docker) for queue-based async processing. Elasticsearch integration is planned for future search optimization.

---

## 🚀 Features

### ✅ MVP Features:

* **User Authentication** with JWT tokens (access + refresh tokens)
* **Data Separation**:

  * Structured data (e.g., finance records) → MySQL (via Sequelize)
  * Unstructured data (e.g., logs, feedback) → MongoDB (via Mongoose)
* **Redis**: Cache frequently accessed data
* **RabbitMQ Integration**:

  * Asynchronously offload data processing to queues
  * Producer/Consumer architecture with routing keys
  * Direct exchange setup (via Docker)

### 🧠 Additional Features (Planned)

1. Elasticsearch: Improve full-text search on blob data

---

## 🏗 Tech Stack

* Backend: Node.js, Express.js

* Authentication: JWT (access & refresh tokens)

* Structured Database: MySQL with Sequelize ORM

* Unstructured Database: MongoDB with Mongoose ODM

* Caching: Redis (via ioredis)

* Queueing System: RabbitMQ (Dockerized)

* Direct exchange with routing keys (sql_save, mongo_save)

* Search Engine (Planned): Elasticsearch



---

## 📁 Folder Structure

```bash
Hybrid-system-API/
├── .env.development.local
├── .git/
├── .gitignore
├── eslint.config.js
├── node_modules/
├── package-lock.json
├── package.json
├── README.md
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── env.js
│   │   └── rabbitmq_keys/
│   │       └── rabbitmq.keys.js
│   ├── controllers/
│   │   ├── data.controller.js
│   │   └── user.controller.js
│   ├── database/
│   │   ├── mongodb.config.js
│   │   └── sqldb.config.js
│   ├── middleware/
│   │   └── authguard.middleware.js
│   ├── models/
│   │   ├── mongo/
│   │   │   └── mongo.record.js
│   │   └── sql/
│   │       ├── sql.record.js
│   │       └── sql.user.js
│   ├── routes/
│   │   ├── data.routes.js
│   │   └── user.auth.route.js
│   ├── services/
│   │   ├── config.redis.js
│   │   └── rabbitmq/
│   │       ├── rabbitmq.config.js
│   │       ├── consumer/
│   │       │   ├── consumer.js
│   │       │   ├── mongo.consumer.js
│   │       │   └── sql.consumer.js
│   │       └── producer/
│
```

---

## 🛠 Installation

```bash
git clone https://github.com/ishto05/Hybrid_DB_System_API.git
cd Hybrid_DB_System_API
npm install
```

### ⚙️ Set up environment variables

Create a `.env` file:

```env
PORT=5000
MYSQL_URI=mysql://user:password@localhost:3306/yourdb
MONGO_URI=mongodb://localhost:27017/hybriddb
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_HOST=localhost
REDIS_PORT=6379
RABBITMQ_URL=amqp://localhost
RABBITMQ_EXCHANGE=app_direct
RABBITMQ_EXCHANGE_TYPE=direct
```
---

## 📦 Docker Support

### 🐇 RabbitMQ via Docker

Run RabbitMQ locally via Docker:

```bash
docker run -d --hostname rabbit-host --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management

```

### 📂 Ports:

* `5672` → for backend service (AMQP)
* `15672` → management UI: [http://localhost:15672](http://localhost:15672) (Login: guest / guest)

### ⚙️ Env Var:

```env
RABBITMQ_URL=amqp://localhost
```

Or if using Docker Compose:

```env
RABBITMQ_URL=amqp://rabbitmq
```

---

## 🧚️ Testing Dummy Data

* Structured:

```json
{
  "title": "Netflix Premium Plan",
  "amount": 649.0,
  "userId": "USR_123e4567-e89b-12d3-a456-426614174000"
}
```

* Unstructured:

```json
{
  "userId": "USR_123e4567-e89b-12d3-a456-426614174000",
  "payload": {
    "feedback": "The dashboard needs a dark mode",
    "timestamp": "2025-07-16T12:00:00.000Z"
  }
}
```

---

## 🧠 Concepts

### 🔄 Data Separation Logic

* If the payload contains only numeric/title-like fields → store in SQL.
* If the payload is open-ended or JSON blob → store in Mongo.

### 🔐 Auth Logic

* On register/login, generate `accessToken` + `refreshToken`
* `userId` is shared across both databases for per-user data ownership

### ⚡ Redis Caching 

* Frequently accessed user records (like `/data`) can be cached with keys like:

  ```
  user:data:USR_xxx-xxx-xxx
  ```

### ⚙️ RabbitMQ Flow

* `publishToQueue(routingKey, payload)` sends data to queue
* `routingKey` decides the queue target: `sql_save` or `mongo_save`
* Consumers are bound to these keys and insert data into:

  * MySQL → if `routingKey = sql_save`
  * MongoDB → if `routingKey = mongo_save`
* Exchange used: `app_direct` (direct)
* Producer throws `Channel not initialized` error if RabbitMQ isn't connected; handled by initializing RabbitMQ at app startup

---


## ✍️ Author

* Author: ishto05

---

## 📌 TODO (Upcoming)

* Integrate Elasticsearch for searching
* Rate-limiting via Redis
* Health check endpoints for RabbitMQ & DBs
* Add unit tests for producer/consumer modules

---

## ✨ Note

Feedback on this project is highly appreciated as I strive for industry-level quality.

[MIT](LICENSE)
