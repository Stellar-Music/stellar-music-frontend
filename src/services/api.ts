import { Track, Artist, MusicPass, StreamingSession, SplitAgreement, SplitContributor, SplitSignature, AgreementEvent, ContributorInput } from '../types';

const API_BASE = '/api';

export const api = {
  // Tracks
  async getTracks(params: { genre?: string; search?: string } = {}): Promise<Track[]> {
    const query = new URLSearchParams();
    if (params.genre) query.append('genre', params.genre);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/tracks?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getTrackById(id: string): Promise<Track> {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    const data = await res.json();
    return data.data;
  },

  async uploadMedia(formData: FormData): Promise<{ audio_reference: string; artwork_reference: string }> {
    const res = await fetch(`${API_BASE}/tracks/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload media');
    return data.data;
  },

  async createTrack(payload: any): Promise<Track> {
    const res = await fetch(`${API_BASE}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create track');
    return data.data;
  },

  // Artists
  async getArtists(): Promise<Artist[]> {
    const res = await fetch(`${API_BASE}/artists`);
    const data = await res.json();
    return data.data || [];
  },

  async createArtist(payload: { wallet_address: string; display_name: string; bio?: string }): Promise<Artist> {
    const res = await fetch(`${API_BASE}/artists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register artist');
    return data.data;
  },

  // Music Pass (Level 1)
  async checkPass(trackId: string, wallet: string): Promise<boolean> {
    if (!wallet) return false;
    const res = await fetch(`${API_BASE}/passes/check/${trackId}/${wallet}`);
    const data = await res.json();
    return !!data.hasAccess;
  },

  async purchasePass(payload: {
    track_id: string;
    purchaser_wallet: string;
    transaction_hash: string;
  }): Promise<{ pass: MusicPass; explorer_url: string }> {
    const res = await fetch(`${API_BASE}/passes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to record pass purchase');
    return { pass: data.data, explorer_url: data.explorer_url };
  },

  // Streaming Accounting (Level 1)
  async startStream(trackId: string, listenerWallet: string): Promise<StreamingSession> {
    const res = await fetch(`${API_BASE}/streams/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track_id: trackId, listener_wallet: listenerWallet }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start streaming session');
    return data.data;
  },

  async heartbeatStream(sessionId: string, durationSeconds: number): Promise<void> {
    await fetch(`${API_BASE}/streams/${sessionId}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_seconds: durationSeconds }),
    });
  },

  async endStream(sessionId: string, durationSeconds: number): Promise<void> {
    await fetch(`${API_BASE}/streams/${sessionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_seconds: durationSeconds }),
    });
  },

  // Wallet Faucet (Level 1)
  async fundTestnetWallet(walletAddress: string): Promise<any> {
    const res = await fetch(`${API_BASE}/wallet/fund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Friendbot funding request failed');
    return data;
  },

  async getWalletBalance(walletAddress: string): Promise<string> {
    const res = await fetch(`${API_BASE}/wallet/balance/${walletAddress}`);
    const data = await res.json();
    return data.balance || '0';
  },

  // =========================================================================
  // LEVEL 2: REVENUE SPLIT AGREEMENT API
  // =========================================================================

  async createSplitAgreement(
    trackId: string,
    createdByWallet: string,
    contributors: ContributorInput[]
  ): Promise<{ agreement: SplitAgreement; contributors: SplitContributor[] }> {
    const res = await fetch(`${API_BASE}/tracks/${trackId}/splits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        created_by_wallet: createdByWallet,
        contributors,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create revenue split agreement');
    return data.data;
  },

  async getTrackSplits(trackId: string): Promise<SplitAgreement[]> {
    const res = await fetch(`${API_BASE}/tracks/${trackId}/splits`);
    const data = await res.json();
    return data.data || [];
  },

  async getActiveLockedSplit(trackId: string): Promise<{ agreement: SplitAgreement; contributors: SplitContributor[] } | null> {
    const res = await fetch(`${API_BASE}/tracks/${trackId}/splits/active`);
    if (res.status === 404) return null;
    const data = await res.json();
    return data.data || null;
  },

  async getSplitById(id: string): Promise<{
    agreement: SplitAgreement;
    contributors: SplitContributor[];
    signatures: SplitSignature[];
    events: AgreementEvent[];
  }> {
    const res = await fetch(`${API_BASE}/splits/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load agreement');
    return data.data;
  },

  async signSplitAgreement(
    id: string,
    contributorWallet: string,
    signatureRef?: string
  ): Promise<{ agreement: SplitAgreement; isLocked: boolean }> {
    const res = await fetch(`${API_BASE}/splits/${id}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributor_wallet: contributorWallet,
        signature_ref: signatureRef,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sign agreement');
    return data.data;
  },

  async rejectSplitAgreement(
    id: string,
    contributorWallet: string,
    reason?: string
  ): Promise<SplitAgreement> {
    const res = await fetch(`${API_BASE}/splits/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributor_wallet: contributorWallet,
        reason,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reject agreement');
    return data.data;
  },

  async getMySplits(wallet: string): Promise<{
    awaiting_my_signature: any[];
    awaiting_others: any[];
    locked: any[];
    other: any[];
  }> {
    const res = await fetch(`${API_BASE}/me/splits?wallet=${encodeURIComponent(wallet)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load splits dashboard');
    return data.data;
  },

  // =========================================================================
  // LEVEL 3: AUTOMATED SETTLEMENT & REALTIME EARNINGS API
  // =========================================================================

  async getRevenuePools(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/revenue/pools`);
    const data = await res.json();
    return data.data || [];
  },

  async getSettlements(trackId?: string): Promise<any[]> {
    const url = trackId ? `${API_BASE}/settlements?track_id=${trackId}` : `${API_BASE}/settlements`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  },

  async getSettlementById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/settlements/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settlement');
    return data.data;
  },

  async reconcileSettlement(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/settlements/reconcile/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reconcile settlement');
    return data.data;
  },

  async executeTrackSettlement(trackId: string, amount: number, poolId?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/settlements/track/${trackId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, pool_id: poolId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Settlement execution failed');
    return data.data;
  },

  async runAutomatedSettlement(): Promise<any> {
    const res = await fetch(`${API_BASE}/settlements/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Automated settlement run failed');
    return data.data;
  },

  async getContributorEarnings(wallet: string): Promise<any> {
    const res = await fetch(`${API_BASE}/earnings/contributor/${encodeURIComponent(wallet)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch contributor earnings');
    return data.data;
  },

  async getArtistRevenue(wallet: string): Promise<any> {
    const res = await fetch(`${API_BASE}/earnings/artist/${encodeURIComponent(wallet)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch artist revenue');
    return data.data;
  },

  async getTrackRevenue(trackId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/revenue/track/${trackId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch track revenue');
    return data.data;
  },
};
