import { describe, it, expect } from 'vitest';
import { isValidStellarAddress } from './validators';

describe('isValidStellarAddress validator', () => {
  it('validates authentic 56-character Stellar public keys', () => {
    const valid = 'GBCG2X7MBTQFBHCYJ4UQSZ7XSZR7L4TUQIVA624SCLDLUF23MABAPIPG';
    const result = isValidStellarAddress(valid);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects empty or whitespace input', () => {
    expect(isValidStellarAddress('')).toEqual({ valid: false, error: 'Stellar address is required' });
    expect(isValidStellarAddress('   ')).toEqual({ valid: false, error: 'Stellar address is required' });
    expect(isValidStellarAddress(null)).toEqual({ valid: false, error: 'Stellar address is required' });
  });

  it('warns when user inadvertently pastes a secret key', () => {
    const secret = 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U64MM6CSFTN2YR7C2OJ3GV';
    const result = isValidStellarAddress(secret);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Secret key entered');
  });

  it('rejects contract IDs (C...)', () => {
    const contract = 'CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS';
    const result = isValidStellarAddress(contract);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Contract ID entered');
  });

  it('rejects addresses with invalid length', () => {
    const short = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KV';
    const result = isValidStellarAddress(short);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid address length');
  });

  it('rejects invalid Base32 characters (0, 1, 8, 9)', () => {
    // Contains '1', '8', '9' which are not valid Base32 RFC 4648
    const invalidChars = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVW19';
    const result = isValidStellarAddress(invalidChars);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Base32');
  });

  it('rejects keys with corrupted checksums', () => {
    // 56 valid Base32 chars starting with G, but corrupted CRC checksum
    const corruptedChecksum = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGG';
    const result = isValidStellarAddress(corruptedChecksum);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('checksum');
  });
});
