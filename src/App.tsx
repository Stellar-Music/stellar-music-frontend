import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrackCard } from './components/TrackCard';
import { MusicPassModal } from './components/MusicPassModal';
import { PublishTrackModal } from './components/PublishTrackModal';
import { WalletModal } from './components/WalletModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { RevenueSplitModal } from './components/RevenueSplitModal';
import { SplitAgreementModal } from './components/SplitAgreementModal';
import { ContributorDashboardModal } from './components/ContributorDashboardModal';
import { ContributorEarningsModal } from './components/ContributorEarningsModal';
import { ArtistRevenueModal } from './components/ArtistRevenueModal';
import { TrackRevenueModal } from './components/TrackRevenueModal';
import { useWallet } from './context/WalletContext';
import { usePlayer } from './context/PlayerContext';
import { api } from './services/api';
import { Track, Artist } from './types';
import { Sparkles, Search, Shield, Music2, PieChart, CheckCircle2, ExternalLink, PlayCircle } from 'lucide-react';

export const App: React.FC = () => {
  const { address } = useWallet();
  const { unlockedTrackIds } = usePlayer();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userPassTrackIds, setUserPassTrackIds] = useState<Set<string>>(new Set());

  // Modal states
  const [purchaseTrack, setPurchaseTrack] = useState<Track | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [splitModalTrack, setSplitModalTrack] = useState<Track | null>(null);
  const [agreementModalTrack, setAgreementModalTrack] = useState<Track | null>(null);
  const [isSplitsDashboardOpen, setIsSplitsDashboardOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isArtistRevenueOpen, setIsArtistRevenueOpen] = useState(false);
  const [revenueTrackId, setRevenueTrackId] = useState<string | null>(null);
  const [settlementToast, setSettlementToast] = useState<{ message: string; txHash?: string } | null>(null);

  const fetchTracks = async () => {
    try {
      const genre = selectedGenre === 'All' ? undefined : selectedGenre;
      const data = await api.getTracks({ genre, search: searchQuery || undefined });
      setTracks(data);
    } catch {
      // Ignore initial load error
    }
  };

  const fetchArtists = async () => {
    try {
      const data = await api.getArtists();
      setArtists(data);
    } catch {
      // Ignore initial load error
    }
  };

  const fetchUserPasses = async () => {
    if (!address) {
      setUserPassTrackIds(new Set());
      return;
    }
    try {
      const res = await fetch(`/api/passes?wallet=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.data) {
        const ids = new Set<string>(data.data.map((p: any) => p.track_id));
        setUserPassTrackIds(ids);
      }
    } catch {
      // Ignore pass lookup error
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchArtists();
  }, [selectedGenre, searchQuery]);

  useEffect(() => {
    fetchUserPasses();
  }, [address]);

  // Realtime SSE listener for on-chain settlement notifications
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/realtime/events');
      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'SETTLEMENT_EXECUTED' || payload.type === 'SETTLEMENT_RECONCILED') {
            setSettlementToast({
              message: `Settlement Executed: ${payload.data.gross_amount} XLM distributed on Stellar!`,
              txHash: payload.data.tx_hash,
            });
            setTimeout(() => setSettlementToast(null), 8000);
          }
        } catch {
          // ignore parsing error
        }
      };
    } catch {
      // ignore
    }
    return () => {
      es?.close();
    };
  }, []);

  const genres = ['All', 'Synthwave', 'Ambient', 'Afrobeats', 'Electronic', 'Lo-Fi'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '110px' }}>
      <Navbar
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenSplits={() => setIsSplitsDashboardOpen(true)}
        onOpenEarnings={() => setIsEarningsOpen(true)}
        onOpenArtistRevenue={() => setIsArtistRevenueOpen(true)}
      />

      {/* Realtime Settlement Toast */}
      {settlementToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 100,
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#070913',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{settlementToast.message}</span>
          {settlementToast.txHash && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${settlementToast.txHash}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: '#070913',
                textDecoration: 'underline',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <span>Explorer</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      <main style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '60px 48px',
          marginBottom: '48px',
          background: 'linear-gradient(135deg, rgba(14, 18, 34, 0.9) 0%, rgba(20, 28, 54, 0.8) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          boxShadow: 'var(--shadow-neon)',
        }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="badge badge-testnet">
                <Sparkles size={13} />
                <span>Automated Multi-Recipient Revenue Settlement</span>
              </span>
            </div>

            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '16px',
            }}>
              Decentralized Music Streaming & <span className="text-gradient">Automated Settlement</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}>
              Multi-party cryptographic revenue sharing agreements. Define contributor splits, collect Stellar wallet approvals, and lock immutable financial terms before automated settlement.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <button
                onClick={() => setIsSplitsDashboardOpen(true)}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.95rem', gap: '8px' }}
              >
                <PieChart size={18} />
                <span>Revenue Splits & Agreements</span>
              </button>

              <button
                onClick={() => setIsPublishOpen(true)}
                className="btn btn-secondary"
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                Publish as Artist
              </button>

              <a
                href="/walkthrough.html"
                className="btn btn-secondary"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: 'var(--accent-cyan)',
                  textDecoration: 'none',
                }}
              >
                <PlayCircle size={18} />
                <span>Watch Video Tour</span>
              </a>
            </div>
          </div>
        </section>

        {/* Search & Genre Filters */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
          }}>
            {/* Genre Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`btn btn-sm ${selectedGenre === g ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px' }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '320px',
            }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search tracks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </section>

        {/* Tracks Discovery Grid */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Featured Tracks</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {tracks.length} track{tracks.length === 1 ? '' : 's'} available
            </span>
          </div>

          {tracks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Music2 size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No tracks found matching your criteria.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}>
              {tracks.map((track) => {
                const hasPass = userPassTrackIds.has(track.id) || unlockedTrackIds.has(track.id);
                return (
                  <TrackCard
                    key={track.id}
                    track={track}
                    hasPass={hasPass}
                    onOpenPurchaseModal={(t) => setPurchaseTrack(t)}
                    onOpenSplitAgreement={(t) => setAgreementModalTrack(t)}
                    onOpenTrackRevenue={(id) => setRevenueTrackId(id)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Available Artists Showcase */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
            Available Artists
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="glass-panel"
                style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--gradient-stellar)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#070913',
                    fontSize: '1.1rem',
                  }}>
                    {artist.display_name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{artist.display_name}</h3>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {artist.wallet_address.substring(0, 8)}...{artist.wallet_address.substring(artist.wallet_address.length - 6)}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {artist.bio || 'Independent music creator on Stellar.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Level 1 Architecture Principles Callout */}
        <section style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(14, 18, 34, 0.5)',
          border: '1px solid var(--border-subtle)',
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--accent-cyan)" />
            <span>Architecture & Security Foundation</span>
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Stellar Music is built on strict non-custodial principles:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                Smart Contracts Enforce Financial Rules
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Funds flow peer-to-peer or into transparent smart contract pools. The backend has no authority to move user funds.
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                Independent On-Chain Verification
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Every pass purchase is validated against Stellar Horizon ledger transactions with cryptographic replay prevention.
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '4px' }}>
                Streaming Accounting
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Playback duration is recorded through authenticated heartbeats to establish the foundation for Level 2 & 3 settlement.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar />

      {/* Modals */}
      {purchaseTrack && (
        <MusicPassModal
          track={purchaseTrack}
          onClose={() => setPurchaseTrack(null)}
          onOpenWallet={() => {
            setPurchaseTrack(null);
            setIsWalletOpen(true);
          }}
        />
      )}

      {isPublishOpen && (
        <PublishTrackModal
          onClose={() => setIsPublishOpen(false)}
          onTrackPublished={() => {
            fetchTracks();
            fetchArtists();
          }}
        />
      )}

      {isWalletOpen && (
        <WalletModal onClose={() => setIsWalletOpen(false)} />
      )}

      {splitModalTrack && (
        <RevenueSplitModal
          track={splitModalTrack}
          onClose={() => setSplitModalTrack(null)}
          onSplitCreated={() => {
            fetchTracks();
          }}
        />
      )}

      {agreementModalTrack && (
        <SplitAgreementModal
          track={agreementModalTrack}
          onClose={() => setAgreementModalTrack(null)}
          onAgreementUpdated={() => {
            fetchTracks();
          }}
        />
      )}

      {isSplitsDashboardOpen && (
        <ContributorDashboardModal
          tracks={tracks}
          onClose={() => setIsSplitsDashboardOpen(false)}
          onSelectTrackForAgreement={(t) => setAgreementModalTrack(t)}
          onSelectTrackForCreateSplit={(t) => setSplitModalTrack(t)}
        />
      )}

      {isEarningsOpen && (
        <ContributorEarningsModal
          onClose={() => setIsEarningsOpen(false)}
          onOpenTrackRevenue={(id) => setRevenueTrackId(id)}
        />
      )}

      {isArtistRevenueOpen && (
        <ArtistRevenueModal
          tracks={tracks}
          onClose={() => setIsArtistRevenueOpen(false)}
          onOpenTrackRevenue={(id) => setRevenueTrackId(id)}
          onOpenCreateSplit={(t) => setSplitModalTrack(t)}
        />
      )}

      {revenueTrackId && (
        <TrackRevenueModal
          trackId={revenueTrackId}
          onClose={() => setRevenueTrackId(null)}
        />
      )}
    </div>
  );
};
