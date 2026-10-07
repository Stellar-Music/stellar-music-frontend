import React, { useRef, useState } from 'react';
import { PlayCircle, Download, ExternalLink, Sparkles, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';

interface WalkthroughTabProps {
  onBackToCatalog: () => void;
}

interface Chapter {
  time: number;
  label: string;
  title: string;
  desc: string;
}

const CHAPTERS: Chapter[] = [
  { time: 0, label: '0:00', title: 'Platform Overview', desc: 'Stellar & Soroban non-custodial music architecture.' },
  { time: 8.4, label: '0:08', title: 'Audio Range Streaming', desc: 'HTTP 206 Partial Content range audio playback.' },
  { time: 18.5, label: '0:18', title: 'Music Pass Purchase', desc: 'Non-custodial 2.5 XLM wallet pass approval.' },
  { time: 29.4, label: '0:29', title: 'Revenue Split Studio', desc: 'Strict 10,000 basis points cryptographic locks.' },
  { time: 41.4, label: '0:41', title: 'Contributor Earnings', desc: 'Real-time royalties and Stellar Expert receipts.' },
  { time: 50.2, label: '0:50', title: 'Settlement Engine', desc: 'Automated multi-party distribution with zero stroop loss.' },
  { time: 63.4, label: '01:03', title: 'Track Revenue Auditor', desc: 'Transparent on-chain accounting and public ledger verification.' },
];

export const WalkthroughTab: React.FC<WalkthroughTabProps> = ({ onBackToCatalog }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [copied, setCopied] = useState(false);

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (cur >= CHAPTERS[i].time) {
        setActiveChapter(i);
        break;
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#walkthrough`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '16px 24px 60px' }}>
      {/* Top Banner Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <button
          onClick={onBackToCatalog}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Music Catalog</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <CheckCircle2 size={15} color="var(--accent-emerald)" /> : <Sparkles size={15} color="var(--accent-cyan)" />}
            <span>{copied ? 'Link Copied!' : 'Share Tab Link'}</span>
          </button>

          <a
            href="/videos/stellar-music-walkthrough.mp4"
            download
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          >
            <Download size={15} />
            <span>Download 1080p MP4</span>
          </a>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span className="badge badge-testnet" style={{ padding: '4px 12px' }}>
            <Sparkles size={13} />
            <span>Complete Video Walkthrough</span>
          </span>
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '10px',
        }}>
          Live System Walkthrough & <span className="text-gradient">Automated Settlement</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '760px', margin: '0 auto' }}>
          Watch an end-to-end interactive capture of Stellar Music: streaming preview, non-custodial music pass purchase, 10,000 BPS split agreement locking, and zero-loss automated multi-recipient settlement.
        </p>
      </div>

      {/* Grid: Video Player + Chapter Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '28px',
        alignItems: 'start',
        marginBottom: '48px',
      }}>
        {/* Video Player Card */}
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#0a0d18',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          boxShadow: 'var(--shadow-neon)',
        }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
            <video
              ref={videoRef}
              controls
              playsInline
              poster="/videos/poster.png"
              onTimeUpdate={handleTimeUpdate}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
            >
              <source src="/videos/stellar-music-walkthrough.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div style={{
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(14, 18, 34, 0.95)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>🎬 <strong>1080p Full HD</strong></span>
              <span>⏱️ <strong>01:14 Runtime</strong></span>
              <span>🎙️ <strong>Neural Voiceover</strong></span>
              <span>⛓️ <strong>Stellar Testnet</strong></span>
            </div>

            <a
              href="/walkthrough.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
            >
              <span>Open Standalone Player</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Interactive Chapters Sidebar */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(14, 18, 34, 0.85)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <PlayCircle size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interactive Chapters</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Click any section below to jump directly to that timestamp in the video.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHAPTERS.map((chap, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={chap.label}
                  onClick={() => seekTo(chap.time)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--accent-cyan)' : 'rgba(0, 0, 0, 0.4)',
                    color: isActive ? '#070913' : 'var(--accent-cyan)',
                    flexShrink: 0,
                  }}>
                    {chap.label}
                  </span>
                  <div>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      marginBottom: '2px',
                    }}>
                      {chap.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {chap.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Narration Script & Platform Verification Highlights */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(14, 18, 34, 0.75)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Shield size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>🎙️ Step-by-Step Narration & Verification Breakdown</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Real-time synchronization between Azure Neural voice narration and Stellar Soroban ledger actions.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px',
        }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              01 • Architecture
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "Welcome to Stellar Music, the decentralized music streaming and programmable revenue settlement platform built on the Stellar network."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              02 • Audio Streaming
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "Fans discover curated independent tracks with instant preview streaming and cryptographic artist verification."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              03 • Music Pass
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "With a single click, listeners purchase non-custodial streaming passes for two point five XLM directly into the track's revenue pool."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              04 • 10,000 BPS Consensus
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "In the Revenue Split Studio, artists and collaborators define precise percentage splits, locked strictly at ten thousand basis points."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              05 • Contributor Earnings
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "Collaborators monitor real-time royalty earnings, claim history, and direct Stellar ledger transactions from their unified dashboard."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              06 • Automated Settlement
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "The automated settlement engine calculates payouts with stroop-level integer precision, guaranteeing zero rounding dust loss."
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              07 • Public Audit
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "Every settlement is publicly auditable on the Stellar blockchain, bringing complete trust and instant liquidity to creators."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
