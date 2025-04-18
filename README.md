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

## Getting Started

To get started with PaperDEX, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sutaro/PaperDEX.git
   cd PaperDEX
   ```

2. **Set up environment variables**:
   - Navigate to each workspace (inside `apps/` or `packages/`)
   - Copy the `.env.example` file to `.env` in each relevant workspace
   - Update the environment variables as needed

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run the application**:
   ```bash
   pnpm dev
   ```

Note: Make sure you have [pnpm](https://pnpm.io/) installed on your system before proceeding.

## Contributing

PRs, ideas, and discussions are welcome! Please open an issue if you have suggestions or find bugs.


## License

MIT © 2025 PaperDEX Team
