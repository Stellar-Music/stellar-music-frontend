import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkBanner } from './components/NetworkBanner';
import { SettlementToast, SettlementToastData } from './components/SettlementToast';
import { GenreFilter } from './components/GenreFilter';
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
import { WalkthroughTab } from './components/WalkthroughTab';
import { Track, Artist } from './types';
import { Sparkles, Search, Shield, Music2, CheckCircle2, ExternalLink, PlayCircle, ArrowUpDown } from 'lucide-react';

export const App: React.FC = () => {
  const { address } = useWallet();
  const { unlockedTrackIds } = usePlayer();

  const [activeTab, setActiveTab] = useState<'catalog' | 'walkthrough'>('catalog');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'title'>('newest');
  const [userPassTrackIds, setUserPassTrackIds] = useState<Set<string>>(new Set());

  // Search debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Listen to URL hash for deep linking (e.g. #walkthrough)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#walkthrough' || hash === '#tour' || hash === '#video') {
        setActiveTab('walkthrough');
      } else if (hash === '#catalog' || hash === '') {
        setActiveTab('catalog');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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
  const [settlementToast, setSettlementToast] = useState<SettlementToastData | null>(null);

  const fetchTracks = async () => {
    try {
      const genre = selectedGenre === 'All' ? undefined : selectedGenre;
      const data = await api.getTracks({ genre, search: debouncedSearch || undefined });
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
  }, [selectedGenre, debouncedSearch]);

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

  const sortedTracks = [...tracks].sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (b.created_at || '').localeCompare(a.created_at || '');
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '110px' }}>
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.location.hash = tab === 'walkthrough' ? '#walkthrough' : '';
        }}
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenSplits={() => setIsSplitsDashboardOpen(true)}
        onOpenEarnings={() => setIsEarningsOpen(true)}
        onOpenArtistRevenue={() => setIsArtistRevenueOpen(true)}
      />

      {/* Stellar Network Environment Alert Banner */}
      <NetworkBanner />

      {/* Realtime Settlement Toast */}
      <SettlementToast toast={settlementToast} onDismiss={() => setSettlementToast(null)} />

      {activeTab === 'walkthrough' ? (
        <WalkthroughTab
          onBackToCatalog={() => {
            setActiveTab('catalog');
            window.location.hash = '';
          }}
        />
      ) : (
        <main style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '32px 24px' }}>
          {/* Hero Section */}
          <section
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              padding: '60px 48px',
              marginBottom: '48px',
              background: 'linear-gradient(135deg, rgba(14, 18, 34, 0.9) 0%, rgba(20, 28, 54, 0.8) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              boxShadow: 'var(--shadow-neon)',
            }}
          >
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-testnet">
                  <Sparkles size={13} />
                  <span>Automated Multi-Recipient Revenue Settlement</span>
                </span>
              </div>

              <h1
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: '18px',
                  letterSpacing: '-0.02em',
                }}
              >
                Decentralized Music Streaming Powered by{' '}
                <span
                  style={{
                    background: 'var(--gradient-stellar)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Soroban
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '28px',
                }}
              >
                Buy lifetime streaming passes directly on Stellar, listen instantly, and verify transparent multi-party royalty splits with zero intermediaries.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <button
                  onClick={() => setIsPublishOpen(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Publish Music</span>
                </button>

                <button
                  onClick={() => setIsSplitsDashboardOpen(true)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Manage Splits</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('walkthrough');
                    window.location.hash = '#walkthrough';
                  }}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  <PlayCircle size={18} />
                  <span>Watch Walkthrough Tab</span>
                </button>
              </div>
            </div>
          </section>

          {/* Featured Video Walkthrough Showcase */}
          <section
            id="walkthrough-video-section"
            style={{
              marginBottom: '48px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#0a0d18',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              boxShadow: 'var(--shadow-neon)',
            }}
          >
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                background: 'linear-gradient(135deg, rgba(14, 18, 34, 0.95) 0%, rgba(20, 28, 54, 0.95) 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-testnet" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    🎥 Live Product Video
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1080p Full HD • 01:14 Runtime</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  Platform Walkthrough & Automated Settlement
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href="/videos/stellar-music-walkthrough.mp4"
                  download
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Download MP4</span>
                </a>
                <a
                  href="/walkthrough.html"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Fullscreen Player</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
              <video
                controls
                playsInline
                poster="/videos/poster.png"
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              >
                <source src="/videos/stellar-music-walkthrough.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>

          {/* Search, Genre Filters & Sorting */}
          <section style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              {/* Dynamic Genre Filter Pills */}
              <GenreFilter
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />

              {/* Search & Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search
                    size={17}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search tracks or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 38px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowUpDown size={15} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#121526',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="newest">Newest Releases</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Tracks Discovery Grid */}
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Featured Tracks</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {sortedTracks.length} track{sortedTracks.length === 1 ? '' : 's'} available
              </span>
            </div>

            {sortedTracks.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '56px 24px',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Music2 size={46} color="var(--accent-cyan)" style={{ margin: '0 auto 14px', opacity: 0.7 }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>No tracks match your query</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px' }}>
                  No tracks found for genre <strong>{selectedGenre}</strong>
                  {debouncedSearch ? ` matching "${debouncedSearch}"` : ''}. Try broadening your search or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedGenre('All');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ margin: '0 auto' }}
                >
                  Clear Search & Reset Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '24px',
                }}
              >
                {sortedTracks.map((track) => {
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

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  className="glass-panel"
                  style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <div
                      style={{
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
                      }}
                    >
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
          <section
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(14, 18, 34, 0.5)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
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
                  Playback duration is recorded through authenticated heartbeats to establish the foundation for automated multi-party settlement.
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

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
          onPassPurchased={(trackId) => {
            setUserPassTrackIds((prev) => new Set([...prev, trackId]));
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
