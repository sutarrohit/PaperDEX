# PaperDEX

**PaperDEX** is a paper trading cryptocurrency exchange that allows users to simulate real-world crypto trading using virtual funds. </br>
It supports **market** and **limit** order types and fetches real-time order book data from Binance for an authentic trading experience.


## Tech Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Front End**: [Next.js](https://nextjs.org/)
- **Backend Framework**: [Express.js (per service)](https://expressjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [better-auth](https://www.better-auth.com/)
- **Services**: Microservices architecture


## Features

- 🔐 User Authentication (Register, Login)
- 💵 Virtual Wallets for USDT, BTC, and more
- 📈 Real-time Order Book (Binance mirror)
- 📊 Market & Limit Orders
- ⚙️ Trading Engine for order matching


## Monorepo Structure
```

PaperDEX/
├── apps/
│ └── web/ # Frontend (Next.js or your framework of choice)
├── packages/
│ ├── user-service/ # Express-based Auth API
│ ├── order-service/ # Handles order placement
│ └── db/ # Shared Prisma client and schema

````

## Concepts Behind PaperDEX

-   🧪 Simulates trading without real money
-   📡 Leverages real-time data from Binance
-   ⚖️ Keeps isolated services for scalability
-   🏗 Uses microservice architecture from day one


## Contributing

PRs, ideas, and discussions are welcome! Please open an issue if you have suggestions or find bugs.


## License

MIT © 2025 PaperDEX Team
