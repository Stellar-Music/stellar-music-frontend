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

/**
 * Validates contributor split allocations (must sum to exactly 10,000 bps = 100.00%)
 */
export function validateSplitAllocations(recipients: { share_bps: number }[]): ValidationResult {
  if (!recipients || recipients.length === 0) {
    return { valid: false, error: 'At least one revenue recipient is required' };
  }

  if (recipients.length > 25) {
    return { valid: false, error: 'Exceeds maximum recipient limit of 25 collaborators' };
  }

  let totalBps = 0;
  for (let i = 0; i < recipients.length; i++) {
    const bps = recipients[i].share_bps;
    if (typeof bps !== 'number' || isNaN(bps) || !Number.isInteger(bps)) {
      return { valid: false, error: `Recipient #${i + 1} share must be an integer basis points value` };
    }
    if (bps <= 0) {
      return { valid: false, error: `Recipient #${i + 1} share must be greater than 0% (0 bps)` };
    }
    if (bps > 10000) {
      return { valid: false, error: `Recipient #${i + 1} share cannot exceed 100% (10,000 bps)` };
    }
    totalBps += bps;
  }

  if (totalBps !== 10000) {
    const diff = (10000 - totalBps) / 100;
    return {
      valid: false,
      error: `Total split allocation must equal exactly 100.00% (currently ${(totalBps / 100).toFixed(2)}%, diff: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}%)`,
    };
  }

  return { valid: true };
}

/**
 * Validates track pass price in XLM
 */
export function validateTrackPrice(price: number | string): ValidationResult {
  const num = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, error: 'Price must be a valid number' };
  }

  if (num < 0) {
    return { valid: false, error: 'Price cannot be negative' };
  }

  if (num > 100000) {
    return { valid: false, error: 'Price cannot exceed 100,000 XLM' };
  }

  // Maximum 7 decimal places for Stellar stroops (1 stroop = 0.0000001 XLM)
  const parts = num.toString().split('.');
  if (parts.length > 1 && parts[1].length > 7) {
    return { valid: false, error: 'Price cannot have more than 7 decimal places (stroop precision)' };
  }

  return { valid: true };
}

/**
 * Validates audio file upload format and size (max 50MB)
 */
export function validateAudioFile(file: { name: string; size: number }): ValidationResult {
  const allowedExtensions = ['.mp3', '.wav', '.flac', '.ogg'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported audio format "${ext}". Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Audio file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 50MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validates artwork image upload format and size (max 5MB)
 */
export function validateArtworkFile(file: { name: string; size: number }): ValidationResult {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported image format "${ext}". Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Artwork file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 5MB limit`,
    };
  }

  return { valid: true };
}
