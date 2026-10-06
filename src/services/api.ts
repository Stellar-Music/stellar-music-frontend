import { Track, Artist, MusicPass, StreamingSession } from '../types';

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

  // Music Pass
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

  // Streaming Accounting
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

  // Wallet
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
};
