# Stellar Music Frontend — Continuous Deployment & Netlify Pipeline

## 1. Production Hosting Topology

The **Stellar Music** frontend single-page application is hosted globally on **Netlify** with automatic global CDN edge caching, SSL termination, and automated continuous deployment.

- **Production Domain**: [https://stellar-music-app.netlify.app](https://stellar-music-app.netlify.app)
- **Deployment Trigger**: Automated Webhook on push to `main` branch of [`Stellar-Music/stellar-music-frontend`](https://github.com/Stellar-Music/stellar-music-frontend).

---

## 2. Netlify Build Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  VITE_STELLAR_NETWORK = "TESTNET"
  VITE_SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org"
  VITE_CONTRACT_ID = "CBUNX6PF4OOFGQ434IBVCLRBR6OBQOM5PTYUES7X6KSN2AIER6VMJK7K"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 3. Pipeline Lifecycle & Deployment Verification

1. **Pre-Deployment CI Gates (GitHub Actions)**:
   - Type checking: `tsc --noEmit`
   - Test execution: `vitest run` (130 passing tests)
   - Code formatting: `prettier --check .`
2. **Build Execution**:
   - Compiles React 19 + TypeScript + Vite.
   - Generates code-split bundles (vendor-react, vendor-stellar, vendor-icons).
3. **Atomic Rollouts**: Netlify deploys instantaneously without downtime. Rollback to prior immutable deploy hashes is available with one click.
