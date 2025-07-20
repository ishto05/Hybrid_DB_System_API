## Hybrid Database System API

A powerful Express.js-based API that smartly separates and manages structured and unstructured data using SQL (MySQL via Sequelize) and NoSQL (MongoDB via Mongoose). It supports JWT authentication, Redis caching, and is designed for future enhancements like RabbitMQ queueing and Elasticsearch search optimization.

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
  * Consumer/producer architecture with routing keys
  * Direct exchange support

### 🧠 Additional Features (Planned)

1. Elasticsearch: Improve full-text search on blob data

---

## 🏗 Tech Stack

**Backend**: Node.js, Express.js
**Structured DB**: MySQL + Sequelize
**Unstructured DB**: MongoDB + Mongoose
**Auth**: JWT (access & refresh tokens)
**Queueing**: RabbitMQ (Direct Exchange with routing keys, Setup by DOCKER)
**Caching**: Redis (ioredis)
**Search (Planned)**: Elasticsearch


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
├── src/
│   ├── app.js
│   ├── config/
│   │   └── env.js
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
│   ├── redis/
│   │   └── config.redis.js
│   ├── routes/
│   │   ├── data.routes.js
│   │

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

## 🧪 Testing Dummy Data

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

### ⚡ Redis Caching (Next Step)

* Frequently accessed user records (like `/data`) can be cached with keys like:

  ```
  user:data:USR_xxx-xxx-xxx
  ```

### ⚙️ RabbitMQ Flow
* Producer sends data using publishToQueue(routingKey, payload)

* routingKey determines where the data goes (sql_save or mongo_save)
* 
* Consumers listen on respective queues and insert data into:
* 
* MySQL → if routingKey = sql_save
* 
* MongoDB → if routingKey = mongo_save
* 
* Uses app_direct as a direct exchange
* 
* If you're pushing to RabbitMQ before the connection is ready, producer throws "Channel not     &* * initialized" – this is handled by initializing RabbitMQ on app startup.

---

## 📦 Docker Support
### 🐇 RabbitMQ via Docker

* If you don’t have RabbitMQ installed locally, you can run it easily using Docker:

```bash
docker run -d --hostname rabbit-host --name rabbitmq \
-p 5672:5672 -p 15672:15672 \
rabbitmq:3-management
```
## Ports:

* 5672 → for backend service (AMQP protocol)

* 15672 → for management UI: http://localhost:15672
* Login: guest | Password: guest

## 🛠 Environment Variable
* Make sure your .env has this line:

```env
RABBITMQ_URL=amqp://localhost
```
* Or if you're using Docker Compose and need a service name like rabbitmq:

```env
RABBITMQ_URL=amqp://rabbitmq
```

## ✍️ Author

* Author: ishto05


---

## 📌 TODO (Upcoming)

* Integrate Elasticsearch for searching
* Rate-limiting via Redis
* Health check endpoints for RabbitMQ & DBs
* Add unit tests for producer/consumer modules
---

## Note
* Feedback on this project is highly appreciated as I strive for industry-level quality.

[MIT](LICENSE)
