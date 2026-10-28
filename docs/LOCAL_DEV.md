# Stellar Music — Frontend Local Development Guide

This guide provides instructions for running, debugging, and testing the `stellar-music-frontend` application locally against the Stellar Testnet.

---

## 🛠 Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher (Node 20+ LTS recommended)
- **npm**: v9.0.0 or higher
- **Web Browser**: Chrome, Brave, Firefox, or Edge
- **Freighter Wallet Extension** *(Optional)*: [freighter.app](https://www.freighter.app/) (Not required if using Demo Mode)

---

## ⚙️ Quick Start

### 1. Clone & Install Dependencies
```bash
cd stellar-music-frontend
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```

Default configuration variables:
```env
# Backend API service URL (leave blank if running reverse proxy or same domain)
VITE_API_URL=http://localhost:3001

# Stellar Network Target (testnet | public)
VITE_STELLAR_NETWORK=testnet

# Primary Horizon RPC Server
VITE_HORIZON_URL=https://horizon-testnet.stellar.org

# Deployed Soroban Music Pass Contract Address (Optional)
VITE_STELLAR_CONTRACT_ID=
```

### 3. Launch Development Server
```bash
npm run dev
```
The application will launch with hot module reloading at `http://localhost:5173`.

---

## 💳 Stellar Wallet Connection Options

Stellar Music provides two frictionless options for connecting a Stellar Testnet wallet:

### Option A: 1-Click Instant Evaluator Keypair (Recommended for Judges)
- Click **Connect Wallet** > **Instant Testnet Keypair (1-Click)**.
- The application automatically generates an Ed25519 keypair and requests 10,000 free Testnet XLM from the Stellar Friendbot API.
- Evaluators can inspect the public key and secret seed directly in the wallet modal, copy them with one click, or verify balances on StellarExpert.

### Option B: Freighter Browser Extension
1. Install the [Freighter extension](https://www.freighter.app/).
2. In Freighter settings, ensure the network is set to **Testnet**.
3. Fund your account with 10,000 Testnet XLM using the Stellar Laboratory Friendbot.
4. Click **Connect Wallet** > **Freighter Wallet**.

---

## 🧪 Testing & Verification

Run the test suite and verify type integrity with the following commands:

```bash
# Run all unit and integration test suites
npm test

# Run tests with V8 code coverage report
npm run test:coverage

# Perform strict TypeScript compilation check (noEmit)
npm run typecheck

# Production build and bundle size verification
npm run build
```

---

## 🎵 Audio Streaming & Settlement Architecture

1. **Decentralized Music Passes**:
   - Access to full high-bitrate tracks is governed by on-chain pass purchase transactions.
   - Purchases execute a direct non-custodial XLM payment on the Stellar ledger.
2. **Byte-Range Streaming**:
   - Audio files are served with HTTP 206 Partial Content headers for instant playback and responsive scrubbing.
3. **Automated Settlement & SSE**:
   - Contributor revenue pools accumulate funds on-chain.
   - When settlement transactions execute, Server-Sent Events (SSE) push live toast notifications to all connected clients.

---

## 🚨 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Unfunded Account"** | Stellar Testnet accounts require a minimum balance of 1 XLM. | Click **Get 10,000 Testnet XLM** in the Navbar or use the Stellar Laboratory faucet. |
| **Freighter Pop-up Blocked** | Browser blocked extension window. | Ensure pop-ups are allowed for `localhost:5173` or use the Instant Keypair mode. |
| **Horizon 503 / Timeout** | Stellar Testnet Horizon rate limit reached. | The built-in `HorizonRpcPool` automatically switches to backup endpoints (`rpc-testnet.stellar.org`). |
| **CORS Audio Errors** | Backend not accepting requests from origin. | Verify `CORS_ORIGIN` in `stellar-music-backend/.env` includes `http://localhost:5173`. |
