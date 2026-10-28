# Contributing to Stellar Music Frontend

Thank you for contributing to the **Stellar Music Web3 Player & Dashboard**!

## Code of Conduct
All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites
- **Node.js**: v20+
- **npm**: v10+
- **Freighter Wallet Extension** (configured for Stellar Testnet)

## Setup & Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Verify production build:
   ```bash
   npm run build
   ```

## Contribution Best Practices
- **Web3 Resilience**: Never assume wallet connection or transaction confirmation will succeed immediately; always handle error states gracefully.
- **Responsive Layout**: Test components across desktop and mobile screen widths.
- **Audio Reliability**: Ensure audio playback state cleanup on unmount.
