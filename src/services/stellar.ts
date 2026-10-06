import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const TESTNET_PASSPHRASE = StellarSdk.Networks.TESTNET;

export interface WalletState {
  address: string | null;
  balance: string;
  type: 'freighter' | 'keypair' | null;
  secretKey?: string;
}

export class StellarClient {
  /**
   * Check if Freighter extension is installed
   */
  async isFreighterInstalled(): Promise<boolean> {
    try {
      const res: any = await isConnected();
      return typeof res === 'boolean' ? res : !!res?.isConnected;
    } catch {
      return false;
    }
  }

  /**
   * Request connection to Freighter
   */
  async connectFreighter(): Promise<string> {
    const res: any = await requestAccess();
    const addr = typeof res === 'string' ? res : res?.address;
    if (!addr) {
      throw new Error('Freighter connection rejected by user.');
    }
    return addr;
  }

  /**
   * Generate or retrieve local Testnet Demo Keypair
   */
  getOrCreateDemoKeypair(): StellarSdk.Keypair {
    const storedSecret = localStorage.getItem('stellar_music_demo_secret');
    if (storedSecret) {
      try {
        return StellarSdk.Keypair.fromSecret(storedSecret);
      } catch {
        // invalid stored key, fallthrough to generate new
      }
    }

    const newKeypair = StellarSdk.Keypair.random();
    localStorage.setItem('stellar_music_demo_secret', newKeypair.secret());
    return newKeypair;
  }

  /**
   * Fetch live native XLM balance from Stellar Testnet Horizon
   */
  async getBalance(address: string): Promise<string> {
    try {
      const account = await server.loadAccount(address);
      const native = account.balances.find((b: any) => b.asset_type === 'native');
      return native ? native.balance : '0';
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        return '0 (Unfunded)';
      }
      return '0';
    }
  }

  /**
   * Fund account using Testnet Friendbot
   */
  async fundWithFriendbot(address: string): Promise<void> {
    const friendbotUrl = `https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`;
    const res = await fetch(friendbotUrl);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Friendbot funding failed.');
    }
  }

  /**
   * Execute real Stellar Testnet Payment
   */
  async payForMusicPass(params: {
    senderAddress: string;
    destinationAddress: string;
    amountXLM: number;
    walletType: 'freighter' | 'keypair';
    keypair?: StellarSdk.Keypair;
    memoText?: string;
  }): Promise<{ hash: string; ledger: number }> {
    const { senderAddress, destinationAddress, amountXLM, walletType, keypair, memoText } = params;

    // Load sender account from Testnet
    let senderAccount: any;
    try {
      senderAccount = await server.loadAccount(senderAddress);
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        throw new Error('Sender wallet is not funded on Stellar Testnet. Fund your wallet with Friendbot first.');
      }
      throw err;
    }

    // Build payment transaction
    const baseFee = await server.fetchBaseFee();
    const txBuilder = new StellarSdk.TransactionBuilder(senderAccount, {
      fee: baseFee.toString(),
      networkPassphrase: TESTNET_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amountXLM.toFixed(7),
        })
      )
      .setTimeout(60);

    if (memoText) {
      txBuilder.addMemo(StellarSdk.Memo.text(memoText.substring(0, 28)));
    }

    const transaction = txBuilder.build();

    let signedTxXdr: string;

    if (walletType === 'freighter') {
      // Sign with Freighter
      const xdrToSign = transaction.toXDR();
      const signedRes: any = await signTransaction(xdrToSign, {
        networkPassphrase: TESTNET_PASSPHRASE,
      });

      const signedXdr = typeof signedRes === 'string' ? signedRes : signedRes?.signedTxXdr;

      if (!signedXdr) {
        throw new Error('Transaction was rejected or cancelled in Freighter.');
      }
      signedTxXdr = signedXdr;
    } else {
      // Sign with Keypair
      if (!keypair) {
        throw new Error('Secret keypair missing for transaction signing.');
      }
      transaction.sign(keypair);
      signedTxXdr = transaction.toXDR();
    }

    // Submit signed transaction to Stellar Testnet Horizon
    const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, TESTNET_PASSPHRASE);
    const result = await server.submitTransaction(txToSubmit);

    return {
      hash: result.hash,
      ledger: result.ledger,
    };
  }
}

export const stellarClient = new StellarClient();
