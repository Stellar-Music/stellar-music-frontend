# Stellar Music Frontend Deployment Guide

This guide outlines the production build and deployment procedures for the **Stellar Music** decentralized web3 streaming application.

---

## 1. Architecture & Design Principles

The frontend is built with **React 18**, **Vite 6**, and `@stellar/stellar-sdk` using non-custodial web3 principles:
- **Zero Private Key Custody**: Users interact via the Freighter browser extension or locally generated testnet demo keypairs.
- **Client-Side Cryptographic Verifications**: On-chain passes and StrKey account checksums are validated client-side.
- **Optimized Code Splitting**: Heavy dependencies (`@stellar/stellar-sdk`, `lucide-react`) are isolated into cacheable manual chunks.

---

## 2. Environment Variables Configuration

Create a `.env` file in the frontend repository root or configure these variables in your hosting provider's dashboard:

| Variable | Description | Default (Testnet) | Production (Mainnet) |
|---|---|---|---|
| `VITE_STELLAR_NETWORK` | Stellar network passphrase identifier | `TESTNET` | `PUBLIC` |
| `VITE_HORIZON_URL` | Horizon REST API endpoint | `https://horizon-testnet.stellar.org` | `https://horizon.stellar.org` |
| `VITE_SOROBAN_RPC_URL` | Soroban JSON-RPC endpoint | `https://soroban-testnet.stellar.org` | Dedicated high-availability RPC |
| `VITE_CONTRACT_ID` | Soroban Revenue Split Smart Contract ID | Contract address (C...) | Mainnet contract address |
| `VITE_API_BASE_URL` | Backend streaming and settlement API base URL | `http://localhost:4000` | `https://api.stellar-music.org` |

---

## 3. Production Build & Verification

Run strict static typecheck and production bundling:

```bash
# 1. Typecheck the entire TypeScript codebase
npm run typecheck

# 2. Run unit and component test suites
npm test

# 3. Compile optimized production distribution
npm run build
```

The output artifacts will be placed in the `dist/` directory:
- `dist/index.html`: Optimized HTML entry point with PWA meta tags
- `dist/assets/vendor-stellar-*.js`: Isolated Stellar SDK and Freighter libraries
- `dist/assets/vendor-react-*.js`: React and ReactDOM runtime
- `dist/assets/vendor-icons-*.js`: Lucide icons bundle
- `dist/assets/index-*.js`: Application code

---

## 4. Deployment Platforms

### Option A: Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy from the root of `stellar-music-frontend`:
   ```bash
   vercel --prod
   ```
3. Set SPA rewrites in `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Option B: Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Client-side routing is handled automatically by the included `public/_redirects` file (`/* /index.html 200`).

### Option C: Cloudflare Pages
1. Deploy using Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name=stellar-music
   ```

### Option D: Decentralized Hosting (IPFS / Fleek)
Because Stellar Music is a decentralized non-custodial application, the built `dist/` folder can be pinned directly to IPFS:
```bash
ipfs add -r dist/
```

---

## 5. Security & Content Security Policy (CSP)

Ensure your hosting headers permit necessary Stellar RPC and Horizon network connections:

```http
Content-Security-Policy: default-src 'self'; connect-src 'self' https://horizon-testnet.stellar.org https://soroban-testnet.stellar.org https://friendbot.stellar.org; img-src 'self' data: https:; media-src 'self' blob: https:;
```

---

## 6. Pre-Flight Checklist for Hackathon Evaluators

- [ ] **Freighter Compatibility**: Test connect with Freighter wallet extension.
- [ ] **Demo Mode**: Verify "Activate Judge Demo Mode" connects a pre-funded test account without requiring extensions.
- [ ] **Pass Purchase**: Test pass payment; verify transaction opens on [StellarExpert Testnet](https://stellar.expert/explorer/testnet).
- [ ] **Split Studio**: Test split agreement creation ensuring 10,000 BPS validation passes.
- [ ] **Realtime Events**: Verify SSE settlement toasts fire upon on-chain distribution.
