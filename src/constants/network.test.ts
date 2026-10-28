import { describe, it, expect } from 'vitest';
import {
  STELLAR_NETWORK,
  FINANCIAL_CONSTANTS,
  getStellarExpertAccountUrl,
  getStellarExpertTxUrl,
  getStellarExpertContractUrl,
} from './network';

describe('Network Constants & Resolvers', () => {
  it('exposes accurate Stellar Testnet parameters', () => {
    expect(STELLAR_NETWORK.NETWORK_ID).toBe('testnet');
    expect(STELLAR_NETWORK.PASSPHRASE).toContain('Test SDF Network');
    expect(FINANCIAL_CONSTANTS.STROOPS_PER_XLM).toBe(10_000_000);
    expect(FINANCIAL_CONSTANTS.TOTAL_SPLIT_BPS).toBe(10_000);
    expect(FINANCIAL_CONSTANTS.MAX_RECIPIENTS).toBe(25);
  });

  it('resolves valid StellarExpert account URLs', () => {
    const addr = 'GBCG2X7MBTQFBHCYJ4UQSZ7XSZR7L4TUQIVA624SCLDLUF23MABAPIPG';
    const url = getStellarExpertAccountUrl(addr);
    expect(url).toBe(`https://stellar.expert/explorer/testnet/account/${addr}`);
  });

  it('resolves valid StellarExpert transaction URLs and cleans leading 0x', () => {
    const hashWithout0x = 'a1b2c3d4e5f6';
    expect(getStellarExpertTxUrl(hashWithout0x)).toBe(
      'https://stellar.expert/explorer/testnet/tx/a1b2c3d4e5f6'
    );

    const hashWith0x = '0xa1b2c3d4e5f6';
    expect(getStellarExpertTxUrl(hashWith0x)).toBe(
      'https://stellar.expert/explorer/testnet/tx/a1b2c3d4e5f6'
    );
  });

  it('resolves valid StellarExpert contract URLs', () => {
    const contract = 'CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS';
    expect(getStellarExpertContractUrl(contract)).toBe(
      `https://stellar.expert/explorer/testnet/contract/${contract}`
    );
  });
});
