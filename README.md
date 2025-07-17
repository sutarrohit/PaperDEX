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


## Features

- 🔐 User Authentication (Register, Login)
- 💵 Virtual Wallets for USDT, BTC, and more
- 📈 Real-time Order Book (Binance mirror)
- 📊 Market & Limit Orders


## Monorepo Structure
```
PaperDEX/
├── .devcontainer/            # Devcontainer config for VS Code remote development
├── .github/                  # GitHub workflows and issue templates
├── vscode/                   # VS Code settings
├── apps/
│   └── web/                  # Frontend application built with Next.js
├── deploy/                   # Deployment-related files/scripts
├── packages/                 # Shared and backend services
│   ├── db/                   # Prisma schema and database utilities
│   ├── eslint-config/        # Shared ESLint configuration
│   ├── lib/                  # Shared libraries (e.g., utils, email, error handlers)
│   ├── order-service/        # Microservice for order management and matching engine
│   ├── typescript-config/    # Shared TypeScript configurations
│   └── user-service/         # Microservice for user authentication and management
├── .dockerignore             # Specifies files to ignore in Docker build context
├── .env.example              # Example environment variables file
├── .gitignore                # Specifies files to ignore in Git
├── .npmrc                    # NPM configuration file
├── .prettierrc               # Prettier configuration file
├── docker-compose.yml        # Docker Compose config for running services
├── package.json              # Root package metadata and scripts
├── pnpm-lock.yaml            # Lockfile for reproducible installs (pnpm)
├── pnpm-workspace.yaml       # Workspace definitions for monorepo (pnpm)
├── README.md                 # Project documentation
├── turbo.json                # Turborepo configuration

````

## Getting Started

To get started with PaperDEX, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sutaro/PaperDEX.git
   ```

     ```bash
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
