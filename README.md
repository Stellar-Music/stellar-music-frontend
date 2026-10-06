# 🎵 Stellar Music — Frontend (`stellar-music-frontend`)

Modern decentralized music streaming web application with real **Stellar Testnet** wallet integration and verifiable **Music Pass** access.

## 📌 Architectural Responsibility & Core Principle

* **Frontend provides the user experience, audio streaming player, and wallet interaction.**
* **Real Stellar Testnet Transactions**: Does not simulate blockchain payments with mock balances or fake hashes. Payments are signed cryptographically and submitted to the public Stellar Testnet ledger.
* **Modern Music Product Experience**: Designed as a sleek, premium streaming application (dark glassmorphism, responsive playback, vibrant glowing accents) rather than a cluttered blockchain dashboard.

```
       [ Listener User ]
               │
        (Signs Payment)
               ▼
   ┌───────────────────────────┐
   │    Stellar Web Frontend   │
   │  - Audio Player Engine    │──────► [ Stellar Horizon Testnet ]
   │  - Wallet Integration     │        (Real Ledger Payment)
   │  - 8-State Music Pass UI  │
   └─────────────┬─────────────┘
                 │ (Submit Tx Hash for Verification)
                 ▼
     [ Stellar Music Backend ]
```

---

## 🎧 Level 1 User Journey

```
   1. Artist Publishes Track (Metadata, audio, cover art, price in XLM)
             ↓
   2. Listener Discovers Track (Landing page, genre filters, search)
             ↓
   3. Connect Stellar Wallet (Freighter or 1-Click Testnet Keypair)
             ↓
   4. Purchase Music Pass (Review payment details & destination)
             ↓
   5. Sign & Submit Real Transaction to Stellar Testnet Horizon
             ↓
   6. Ledger Confirmation & Backend Independent Reconciliation
             ↓
   7. Access Granted & Streaming Unlocked
             ↓
   8. High-Fidelity Audio Stream & Streaming Accounting Recorded
```

---

## 🌟 Core Features

### 1. Landing & Discovery Page
* Platform introduction highlighting decentralized non-custodial streaming.
* Filter by genres: `Synthwave`, `Ambient`, `Afrobeats`, `Electronic`, `Lo-Fi`.
* Real-time search across tracks and artist names.
* Track cards displaying album artwork, artist, duration, price pill, and pass access status (`Free Stream`, `Pass Granted`, or `Pass Required`).

### 2. High-Fidelity Audio Player
* Persistent bottom player bar with glassmorphism blurred backdrop.
* Features: Play/Pause, 10-second skip back/forward, smooth range seek slider, current time, total duration, volume slider with mute toggle.
* Automatically synchronized with backend streaming accounting (`/api/streams/start`, `/api/streams/:id/heartbeat`, `/api/streams/:id/end`).
* Audio streams via HTTP Range requests (`206 Partial Content`).

### 3. Artist Publishing Studio
* Modal to publish or save drafts (`DRAFT` vs `PUBLISHED`).
* Collects: track title, artist display name, description, genre, cover artwork file upload/preview, audio file upload, and Music Pass price in XLM.
* Immediate validation and automatic indexing.

### 4. Stellar Testnet Wallet Integration
* **Freighter Extension**: Integrates seamlessly with Stellar's official `@stellar/freighter-api`.
* **1-Click Testnet Demo Keypair**: Generates an in-browser cryptographic keypair funded with 10,000 Testnet XLM via Friendbot with 1 click, allowing immediate testing without extensions.
* Live balance polling and address truncation.
* Clear visual identification of **Stellar Testnet**.

### 5. Music Pass 8-State Purchase Flow
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

### 3. Start Development Server
Ensure the backend is running on `http://localhost:4000`:
```bash
npm run dev
```

App will launch on `http://localhost:3000`.

### 4. Production Build
```bash
npm run build
npm run preview
```
