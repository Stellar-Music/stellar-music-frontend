/**
 * Centralized Stellar Network, Soroban Smart Contract & Explorer Constants
 */

export const STELLAR_NETWORK = {
  PASSPHRASE: 'Test SDF Network ; September 2015',
  NETWORK_ID: 'testnet',
  HORIZON_PRIMARY: 'https://horizon-testnet.stellar.org',
  HORIZON_FALLBACK: 'https://rpc-testnet.stellar.org',
  SOROBAN_RPC: 'https://soroban-testnet.stellar.org',
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
  EXPLORER_BASE: 'https://stellar.expert/explorer/testnet',
  LABORATORY_URL: 'https://laboratory.stellar.org/#account-creator?network=test',
} as const;

export const FINANCIAL_CONSTANTS = {
  STROOPS_PER_XLM: 10_000_000,
  MIN_PASS_PRICE_STROOPS: 100_000, // 0.01 XLM
  MIN_PASS_PRICE_XLM: 0.01,
  TOTAL_SPLIT_BPS: 10_000, // 100.00%
  MAX_RECIPIENTS: 25,
} as const;

/**
 * Resolves StellarExpert URL for account details
 */
export function getStellarExpertAccountUrl(address: string): string {
  const clean = address.trim();
  return `${STELLAR_NETWORK.EXPLORER_BASE}/account/${clean}`;
}

/**
 * Resolves StellarExpert URL for transaction hash
 */
export function getStellarExpertTxUrl(txHash: string): string {
  const clean = txHash.trim().replace(/^0x/, '');
  return `${STELLAR_NETWORK.EXPLORER_BASE}/tx/${clean}`;
}

/**
 * Resolves StellarExpert URL for Soroban contract details
 */
export function getStellarExpertContractUrl(contractId: string): string {
  const clean = contractId.trim();
  return `${STELLAR_NETWORK.EXPLORER_BASE}/contract/${clean}`;
}
