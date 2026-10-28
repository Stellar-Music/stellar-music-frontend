import { describe, it, expect, vi } from 'vitest';
import { validateAndLoadConfig } from './env';

describe('Environment Validator (validateAndLoadConfig)', () => {
  it('loads valid configuration with defaults when given empty env', () => {
    const config = validateAndLoadConfig({});
    expect(config.apiUrl).toBe('');
    expect(config.stellarNetwork).toBe('testnet');
    expect(config.contractId).toBeNull();
    expect(config.horizonUrl).toBe('https://horizon-testnet.stellar.org');
  });

  it('parses custom valid environment variables', () => {
    const custom = {
      VITE_API_URL: 'https://api.stellar-music.org',
      VITE_STELLAR_NETWORK: 'testnet',
      VITE_STELLAR_CONTRACT_ID: 'CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS',
      VITE_HORIZON_URL: 'https://rpc-testnet.stellar.org',
    };

    const config = validateAndLoadConfig(custom);
    expect(config.apiUrl).toBe('https://api.stellar-music.org');
    expect(config.stellarNetwork).toBe('testnet');
    expect(config.contractId).toBe('CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS');
    expect(config.horizonUrl).toBe('https://rpc-testnet.stellar.org');
  });

  it('rejects invalid stellar network values', () => {
    expect(() =>
      validateAndLoadConfig({ VITE_STELLAR_NETWORK: 'ethereum' })
    ).toThrow('Invalid VITE_STELLAR_NETWORK');
  });

  it('rejects invalid horizon URLs without protocol', () => {
    expect(() =>
      validateAndLoadConfig({ VITE_HORIZON_URL: 'horizon-testnet.stellar.org' })
    ).toThrow('Invalid VITE_HORIZON_URL');
  });

  it('warns when contract ID does not start with C', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config = validateAndLoadConfig({
      VITE_STELLAR_CONTRACT_ID: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS',
    });

    expect(warnSpy).toHaveBeenCalled();
    expect(config.contractId).toBe('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS');
    warnSpy.mockRestore();
  });
});
