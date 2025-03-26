# PaperDEX

PaperDEX is a demo trading platform where users can log in and receive free demo tokens to practice trading cryptocurrencies. It provides a simulated trading environment, allowing you to test your trading skills and strategies without risking real money.

## Features
- **Demo Trading:** Trade cryptocurrencies using demo tokens.
- **Real-Time Market Data:** Simulated market prices for realistic trading.
- **Track Portfolio:** Monitor your demo assets and portfolio growth.
- **User Authentication:** Secure login and user management.
- **Leaderboard:** Compete with other users and track your ranking.

## Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL
- **API:** Binance API (for simulated market data)
- **Authentication:** JWT
- **Package Manager:** pnpm

## Installation

Make sure you have `pnpm` installed. If not, install it using the following command:
```bash
npm install -g pnpm
```

### Clone the Repository
```bash
git clone https://github.com/your-repo/paperdex.git
cd paperdex
```

### Install Dependencies
```bash
pnpm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and provide the required environment variables:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret
```

### Run Migrations
```bash
pnpm prisma migrate dev
```

### Start the Development Server
```bash
pnpm dev
```
The app will be available at `http://localhost:3000`

## Scripts
- `pnpm dev` - Start the development server
- `pnpm build` - Build the project for production
- `pnpm lint` - Run linter
- `pnpm test` - Run tests

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Happy Trading with PaperDEX! 🚀

