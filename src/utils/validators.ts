import * as StellarSdk from '@stellar/stellar-sdk';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a Stellar public account address (G...) including StrKey checksum.
 */
export function isValidStellarAddress(address: string | null | undefined): ValidationResult {
  if (!address || !address.trim()) {
    return { valid: false, error: 'Stellar address is required' };
  }

  const clean = address.trim();

  if (!clean.startsWith('G')) {
    if (clean.startsWith('S')) {
      return { valid: false, error: 'Security warning: Secret key entered. Never paste secret keys!' };
    }
    if (clean.startsWith('C')) {
      return { valid: false, error: 'Contract ID entered. Individual contributor account (G...) required.' };
    }
    return { valid: false, error: 'Stellar account addresses must start with "G"' };
  }

  if (clean.length !== 56) {
    return {
      valid: false,
      error: `Invalid address length (${clean.length}/56 characters)`,
    };
  }

  const base32Regex = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]+$/;
  if (!base32Regex.test(clean)) {
    return { valid: false, error: 'Contains invalid Base32 characters' };
  }

  try {
    const isValid = StellarSdk.StrKey.isValidEd25519PublicKey(clean);
    if (!isValid) {
      return { valid: false, error: 'Invalid Stellar public key checksum' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid Stellar StrKey encoding' };
  }
}
