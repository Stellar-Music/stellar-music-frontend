# 🎵 Stellar Music — Frontend (`stellar-music-frontend`)

[![Netlify Status](https://api.netlify.com/api/v1/badges/ab1b7042-2733-4165-9c7a-4751372be07c/deploy-status)](https://stellar-music-app.netlify.app)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-blue.svg)](https://stellar.org)

> **🚀 Live Web Application**: [https://stellar-music-app.netlify.app](https://stellar-music-app.netlify.app)

Modern decentralized music streaming web application with real **Stellar Testnet** wallet integration, verifiable **Music Pass** access, and **Collaborator Revenue Split Agreements**.

## 📌 Architectural Responsibility & Core Principle

* **Frontend provides the user experience, audio streaming player, split agreement orchestration, and wallet interaction.**
* **Real Stellar Testnet Transactions**: Does not simulate blockchain payments or signatures with mock balances or fake hashes. Payments and agreements are signed cryptographically and reconciled against public Stellar records.
* **Modern Music Product Experience**: Designed as a sleek, premium streaming application (dark glassmorphism, responsive playback, vibrant glowing accents) rather than a cluttered blockchain dashboard.
* **Level 2 Principle**: Clear distinction between **Financial Agreement** (`Define → Review → Sign → Lock`) and **Revenue Settlement** (Level 3 automated revenue pools).

```
       [ Artist / Collaborator ]
                  │
        (Defines Split Terms)
                  ▼
   ┌─────────────────────────────┐
   │    Stellar Web Frontend     │
   │  - Audio Player Engine      │──────► [ Stellar Horizon Testnet / Soroban ]
   │  - Revenue Split Modals     │        (Real Ledger Payment & Contract Approvals)
   │  - Multi-Party Signing Flow │
   │  - Contributor Dashboard    │
   └──────────────┬──────────────┘
                  │ (API Sync & Signature Recording)
                  ▼
      [ Stellar Music Backend ]
```

---

## 🎧 Level 2 User Journey

```
   1. Artist Selects Track (From catalog or discovery grid)
             ↓
   2. Create Revenue Split (Add contributors, roles, percentages)
             ↓
   3. Live 100.0% Allocation Validation (Enforced in UI, backend, contract)
             ↓
   4. Generate Agreement & Deterministic SHA-256 Hash
             ↓
   5. Contributors Review Exact Agreement Terms
             ↓
   6. Connect Stellar Wallet & Cryptographically Sign
             ↓
   7. Real-Time Tracking: All Required Signatures Collected
             ↓
   8. Agreement Automatically LOCKS & Becomes Immutable
             ↓
   9. Ready for Level 3 Automated Settlement
```

---

## 🌟 Core Features

### 1. Collaborator Revenue Split Definition
* Extensible contributor roles (`Artist`, `Producer`, `Songwriter`, `Composer`, `Engineer`, `Label`, `Other`).
* Real-time visual progress bar enforcing exactly **100.0%** total allocation.
* Stellar public key format validation (`G...`).
* Rejection of duplicate contributor entries or empty allocations.

### 2. Multi-Party Split Agreement Review & Signing
* Full breakdown of participating contributors, assigned roles, and share percentages.
* **Deterministic Agreement Hash (SHA-256)** display card with 1-click clipboard copy.
* Explicit wallet confirmation: *"By signing, you cryptographically authorize this exact revenue split agreement terms"*.
* Real-time signature collection progress counter (`Signed` vs `Pending`).
* Once all required contributors sign, agreement auto-locks with an immutable green **LOCKED** banner.

### 3. Splits & Collaborations Dashboard
* **My Collaborations**: Filter agreements by `All`, `Awaiting My Signature`, `Awaiting Others`, and `Locked & Ready`.
* **Artist Catalog**: Full overview of track agreement versions (`v1`, `v2`) with 1-click actions to view agreements or draft new revisions.

### 4. High-Fidelity Audio Player (Level 1 Foundation)
* Persistent bottom player bar with glassmorphism blurred backdrop.
* Features: Play/Pause, 10-second skip back/forward, smooth range seek slider, current time, total duration, volume slider with mute toggle.
* Automatically synchronized with backend streaming accounting (`/api/streams/start`, `/api/streams/:id/heartbeat`, `/api/streams/:id/end`).
* Audio streams via HTTP Range requests (`206 Partial Content`).

### 5. Stellar Testnet Wallet Integration
* **Freighter Extension**: Integrates seamlessly with Stellar's official `@stellar/freighter-api`.
* **1-Click Testnet Demo Keypair**: Generates an in-browser cryptographic keypair funded with 10,000 Testnet XLM via Friendbot with 1 click, allowing immediate testing without extensions.
* Live balance polling and address truncation.
* Clear visual identification of **Stellar Testnet**.

### 6. Music Pass 8-State Purchase Flow
Distinguishes states strictly to prevent misleading UI or accidental double-spends:
1. `READY`: Wallet connected, pass price reviewed.
2. `WALLET_REQUIRED`: Prompts listener to connect wallet before purchasing.
3. `SIGNING`: Awaiting cryptographic signature in wallet.
4. `SUBMITTING`: Submitting signed transaction to Stellar Testnet Horizon.
5. `CONFIRMING`: Ledger confirmation detected; waiting for backend independent reconciliation.
6. `CONFIRMED`: Verified! Access granted immediately. Clickable link to Stellar Expert Explorer displayed.
7. `FAILED`: Displays ledger or network error message with retry option.
8. `REJECTED`: Handles user rejection or cancellation cleanly.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy the template configuration:
```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend instance:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_STELLAR_NETWORK=TESTNET
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

---

## 🔒 Security Principles
* Non-custodial: Secret keys never touch frontend logs, local storage, or network payloads.
* Deterministic hashing: Changing any contributor or percentage immediately yields a distinct hash, preventing signature replay.
* Locked agreements cannot be altered in frontend state; backend and smart contracts reject mutations post-lock.
