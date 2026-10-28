import { describe, it, expect } from 'vitest';
import {
  isValidStellarAddress,
  validateSplitAllocations,
  validateTrackPrice,
  validateAudioFile,
  validateArtworkFile,
} from './validators';

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
    const invalidChars = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVW19';
    const result = isValidStellarAddress(invalidChars);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Base32');
  });

  it('rejects keys with corrupted checksums', () => {
    const corruptedChecksum = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGG';
    const result = isValidStellarAddress(corruptedChecksum);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('checksum');
  });
});

describe('validateSplitAllocations', () => {
  it('accepts split allocations that sum to exactly 10,000 bps', () => {
    const valid = [
      { share_bps: 5000 },
      { share_bps: 3000 },
      { share_bps: 2000 },
    ];
    expect(validateSplitAllocations(valid)).toEqual({ valid: true });
  });

  it('accepts single 100% (10,000 bps) allocation', () => {
    expect(validateSplitAllocations([{ share_bps: 10000 }])).toEqual({ valid: true });
  });

  it('rejects empty recipient list', () => {
    expect(validateSplitAllocations([])).toEqual({
      valid: false,
      error: 'At least one revenue recipient is required',
    });
  });

  it('rejects recipients exceeding maximum limit of 25', () => {
    const tooMany = Array.from({ length: 26 }, () => ({ share_bps: 384 }));
    expect(validateSplitAllocations(tooMany).error).toContain('maximum recipient limit');
  });

  it('rejects allocations with non-integer or zero bps', () => {
    expect(validateSplitAllocations([{ share_bps: 0 }]).error).toContain('greater than 0%');
    expect(validateSplitAllocations([{ share_bps: 5000.5 }, { share_bps: 4999.5 }]).error).toContain('integer basis points');
  });

  it('rejects allocations where total does not equal 10,000 bps', () => {
    const under = [{ share_bps: 5000 }, { share_bps: 4000 }];
    expect(validateSplitAllocations(under).error).toContain('must equal exactly 100.00%');

    const over = [{ share_bps: 6000 }, { share_bps: 5000 }];
    expect(validateSplitAllocations(over).error).toContain('must equal exactly 100.00%');
  });
});

describe('validateTrackPrice', () => {
  it('accepts valid non-negative XLM prices', () => {
    expect(validateTrackPrice(0)).toEqual({ valid: true });
    expect(validateTrackPrice(2.5)).toEqual({ valid: true });
    expect(validateTrackPrice('10')).toEqual({ valid: true });
    expect(validateTrackPrice('0.0000001')).toEqual({ valid: true });
  });

  it('rejects negative prices', () => {
    expect(validateTrackPrice(-5).error).toContain('cannot be negative');
  });

  it('rejects NaN or non-numeric values', () => {
    expect(validateTrackPrice('abc').error).toContain('valid number');
  });

  it('rejects prices exceeding 100,000 XLM', () => {
    expect(validateTrackPrice(100001).error).toContain('cannot exceed 100,000 XLM');
  });

  it('rejects precision greater than 7 decimal places', () => {
    expect(validateTrackPrice('1.12345678').error).toContain('7 decimal places');
  });
});

describe('validateAudioFile and validateArtworkFile', () => {
  it('accepts supported audio formats under 50MB', () => {
    expect(validateAudioFile({ name: 'track.mp3', size: 10 * 1024 * 1024 })).toEqual({ valid: true });
    expect(validateAudioFile({ name: 'track.wav', size: 45 * 1024 * 1024 })).toEqual({ valid: true });
    expect(validateAudioFile({ name: 'track.flac', size: 20 * 1024 * 1024 })).toEqual({ valid: true });
    expect(validateAudioFile({ name: 'track.ogg', size: 5 * 1024 * 1024 })).toEqual({ valid: true });
  });

  it('rejects unsupported audio formats and oversized audio files', () => {
    expect(validateAudioFile({ name: 'track.exe', size: 1000 }).error).toContain('Unsupported audio format');
    expect(validateAudioFile({ name: 'track.mp3', size: 55 * 1024 * 1024 }).error).toContain('exceeds 50MB limit');
  });

  it('accepts supported artwork formats under 5MB', () => {
    expect(validateArtworkFile({ name: 'cover.jpg', size: 2 * 1024 * 1024 })).toEqual({ valid: true });
    expect(validateArtworkFile({ name: 'cover.png', size: 4 * 1024 * 1024 })).toEqual({ valid: true });
    expect(validateArtworkFile({ name: 'cover.webp', size: 1 * 1024 * 1024 })).toEqual({ valid: true });
  });

  it('rejects unsupported artwork formats and oversized images', () => {
    expect(validateArtworkFile({ name: 'cover.bmp', size: 500 }).error).toContain('Unsupported image format');
    expect(validateArtworkFile({ name: 'cover.jpg', size: 6 * 1024 * 1024 }).error).toContain('exceeds 5MB limit');
  });
});
