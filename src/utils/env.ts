/**
 * Frontend Environment Configuration & Validation Module
 */

export interface FrontendConfig {
  apiUrl: string;
  stellarNetwork: 'testnet' | 'public';
  contractId: string | null;
  horizonUrl: string;
}

export function validateAndLoadConfig(rawEnv: Record<string, string | undefined>): FrontendConfig {
  const apiUrl = rawEnv.VITE_API_URL?.trim() || '';
  const network = (rawEnv.VITE_STELLAR_NETWORK?.trim().toLowerCase() || 'testnet');

  if (network !== 'testnet' && network !== 'public') {
    throw new Error(`[Config Error] Invalid VITE_STELLAR_NETWORK: "${network}". Expected "testnet" or "public".`);
  }

  const horizonUrl = rawEnv.VITE_HORIZON_URL?.trim() || 'https://horizon-testnet.stellar.org';
  if (!horizonUrl.startsWith('http://') && !horizonUrl.startsWith('https://')) {
    throw new Error(`[Config Error] Invalid VITE_HORIZON_URL: "${horizonUrl}". Must start with http:// or https://.`);
  }

  const contractId = rawEnv.VITE_STELLAR_CONTRACT_ID?.trim() || null;
  if (contractId && !contractId.startsWith('C')) {
    console.warn(`[Config Warning] VITE_STELLAR_CONTRACT_ID should be a Soroban contract address starting with 'C'. Found: ${contractId}`);
  }

  return {
    apiUrl,
    stellarNetwork: network as 'testnet' | 'public',
    contractId,
    horizonUrl,
  };
}

// Global cached config
export const config: FrontendConfig = validateAndLoadConfig(
  typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {}
);
