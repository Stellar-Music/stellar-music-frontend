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

// =========================================================================
// LEVEL 3: REVENUE SETTLEMENT & EARNINGS TYPES
// =========================================================================

export type SettlementStatus =
  | 'PENDING'
  | 'CALCULATED'
  | 'READY'
  | 'SUBMITTING'
  | 'CONFIRMING'
  | 'SETTLED'
  | 'FAILED'
  | 'RECONCILIATION_REQUIRED';

export interface RevenuePool {
  id: string;
  asset: string;
  total_amount: number;
  allocated_amount: number;
  unallocated_amount: number;
  source_type: string;
  source_tx_hash: string | null;
  status: 'OPEN' | 'ALLOCATED' | 'SETTLED';
  created_at: string;
}

export interface Settlement {
  id: string;
  pool_id: string;
  track_id: string;
  agreement_id: string;
  agreement_version: number;
  agreement_hash: string;
  asset: string;
  gross_amount: number;
  status: SettlementStatus;
  tx_hash: string | null;
  failure_reason: string | null;
  settled_at: string | null;
  created_at: string;
}

export interface SettlementRecipient {
  id: string;
  settlement_id: string;
  wallet_address: string;
  contributor_id: string;
  role: string;
  percentage: number;
  share_basis_points: number;
  expected_amount: number;
  actual_amount: number;
  status: 'PENDING' | 'SETTLED' | 'FAILED';
  tx_hash: string | null;
}

export interface ContributorEarningsSummary {
  wallet_address: string;
  total_earned: number;
  pending_revenue: number;
  settled_revenue: number;
  tracks: Array<{
    track_id: string;
    track_title: string;
    role: string;
    percentage: number;
    pending: number;
    settled: number;
    latest_tx_hash: string | null;
  }>;
}

export interface ArtistRevenueSummary {
  artist_wallet: string;
  total_revenue: number;
  pending_settlement: number;
  settled_revenue: number;
  tracks: Array<{
    track_id: string;
    track_title: string;
    total_revenue: number;
    pending: number;
    settled: number;
    agreement_version: number;
    is_locked: boolean;
  }>;
}

export interface TrackRevenueData {
  track: Track;
  locked_agreement: SplitAgreement | null;
  contributors: SplitContributor[];
  total_settled_xlm: number;
  settlement_count: number;
  settlements: Settlement[];
}

