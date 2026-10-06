export type TrackStatus = 'DRAFT' | 'PUBLISHED';
export type MusicPassStatus = 'CONFIRMED' | 'FAILED' | 'PENDING';

export interface Artist {
  id: string;
  wallet_address: string;
  display_name: string;
  bio: string | null;
  created_at: string;
}

export interface Track {
  id: string;
  artist_id: string;
  artist_name?: string;
  artist_wallet?: string;
  title: string;
  description: string | null;
  audio_reference: string;
  artwork_reference: string;
  price: number;
  status: TrackStatus;
  genre: string | null;
  duration_seconds: number;
  created_at: string;
}

export interface MusicPass {
  id: string;
  track_id: string;
  purchaser_wallet: string;
  payment_amount: number;
  transaction_hash: string;
  status: MusicPassStatus;
  purchased_at: string;
}

export interface StreamingSession {
  id: string;
  track_id: string;
  listener_wallet: string;
  started_at: string;
  ended_at: string | null;
  duration: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABORTED';
}

export type PurchaseState =
  | 'READY'
  | 'WALLET_REQUIRED'
  | 'SIGNING'
  | 'SUBMITTING'
  | 'CONFIRMING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'REJECTED';
