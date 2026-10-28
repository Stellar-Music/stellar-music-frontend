import { describe, it, expect, vi } from 'vitest';
import { HorizonRpcPool, StellarClient } from './stellar';

describe('HorizonRpcPool', () => {
  it('initializes with default testnet endpoints', () => {
    const pool = new HorizonRpcPool();
    expect(pool.getActiveEndpoint()).toBe('https://horizon-testnet.stellar.org');
    expect(pool.getAllEndpoints().length).toBeGreaterThanOrEqual(2);
  });

  it('switches to secondary endpoint upon call to switchToNext', () => {
    const pool = new HorizonRpcPool(['https://primary.rpc', 'https://secondary.rpc']);
    expect(pool.getActiveEndpoint()).toBe('https://primary.rpc');

    pool.switchToNext();
    expect(pool.getActiveEndpoint()).toBe('https://secondary.rpc');

    // Wraps around
    pool.switchToNext();
    expect(pool.getActiveEndpoint()).toBe('https://primary.rpc');
  });

  it('executes operation successfully without failover when primary succeeds', async () => {
    const pool = new HorizonRpcPool(['https://primary.rpc', 'https://secondary.rpc']);
    const mockOp = vi.fn().mockResolvedValue('success_payload');

    const result = await pool.executeWithFailover(mockOp);
    expect(result).toBe('success_payload');
    expect(mockOp).toHaveBeenCalledTimes(1);
    expect(pool.getActiveEndpoint()).toBe('https://primary.rpc');
  });

  it('automatically fails over to secondary server when primary operation throws network error', async () => {
    const pool = new HorizonRpcPool(['https://primary.rpc', 'https://secondary.rpc']);
    let callCount = 0;

    const mockOp = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error('503 Service Unavailable / Network Timeout');
      }
      return 'recovered_payload';
    });

    const result = await pool.executeWithFailover(mockOp);
    expect(result).toBe('recovered_payload');
    expect(mockOp).toHaveBeenCalledTimes(2);
    expect(pool.getActiveEndpoint()).toBe('https://secondary.rpc');
  });

  it('does not failover for NotFoundError (e.g. unfunded new accounts)', async () => {
    const pool = new HorizonRpcPool(['https://primary.rpc', 'https://secondary.rpc']);
    const notFoundError = new Error('Account Not Found');
    notFoundError.name = 'NotFoundError';

    const mockOp = vi.fn().mockRejectedValue(notFoundError);

    await expect(pool.executeWithFailover(mockOp)).rejects.toThrow('Account Not Found');
    expect(mockOp).toHaveBeenCalledTimes(1);
    expect(pool.getActiveEndpoint()).toBe('https://primary.rpc');
  });
});

describe('StellarClient diagnostic status', () => {
  it('reports active RPC endpoint in getRpcStatus', () => {
    const pool = new HorizonRpcPool(['https://primary.rpc', 'https://backup.rpc']);
    const client = new StellarClient(pool);
    const status = client.getRpcStatus();

    expect(status.activeEndpoint).toBe('https://primary.rpc');
    expect(status.endpoints).toEqual(['https://primary.rpc', 'https://backup.rpc']);
  });
});
