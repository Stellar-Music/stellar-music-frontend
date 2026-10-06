export type TrackStatus = 'DRAFT' | 'PUBLISHED';
export type MusicPassStatus = 'CONFIRMED' | 'FAILED' | 'PENDING';

export type SplitAgreementStatus =
  | 'DRAFT'
  | 'AWAITING_SIGNATURES'
  | 'PARTIALLY_SIGNED'
  | 'LOCKED'
  | 'REJECTED'
  | 'SUPERSEDED';

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
  has_split?: boolean;
  split_status?: SplitAgreementStatus;
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

// =========================================================================
// LEVEL 2: REVENUE SPLIT AGREEMENT TYPES
// =========================================================================

export interface SplitContributor {
  id: string;
  agreement_id: string;
  wallet_address: string;
  display_name: string;
  role: string;
  percentage: number;
  share_basis_points: number;
  has_signed: boolean;
  signed_at: string | null;
  signature_ref: string | null;
}

export interface SplitAgreement {
  id: string;
  track_id: string;
  version: number;
  status: SplitAgreementStatus;
  agreement_hash: string;
  created_by: string;
  created_at: string;
  locked_at: string | null;
}

export interface SplitSignature {
  id: string;
  agreement_id: string;
  contributor_id: string;
  wallet_address: string;
  signature_hash: string;
  signed_at: string;
}

export interface AgreementEvent {
  id: string;
  agreement_id: string;
  event_type: string;
  performed_by: string;
  details: string;
  created_at: string;
}

export interface ContributorInput {
  wallet_address: string;
  display_name: string;
  role: string;
  percentage: number;
}
