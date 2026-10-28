import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Play, PieChart, Coins } from 'lucide-react';

export interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: 'catalog' | 'walkthrough') => void;
}

interface TourStep {
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  actionLabel: string;
}

export const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: TourStep[] = [
    {
      title: 'Decentralized Music Passes',
      badge: 'Level 1: Audio Micropayments',
      icon: <Play size={24} color="var(--accent-cyan)" />,
      description:
        'Listeners stream music directly through non-custodial Stellar micropayments. Purchasing a Music Pass grants cryptographic on-chain access to high-fidelity audio.',
      details: [
        'Direct peer-to-peer or smart-contract pool payments in native XLM.',
        'Cryptographic replay prevention verified against Stellar Horizon ledgers.',
        'Zero platform lock-in: listening rights are verifiable on-chain.',
      ],
      actionLabel: 'Next: Revenue Splits Studio',
    },
    {
      title: 'Verifiable Revenue Splits Studio',
      badge: 'Level 2: Cryptographic Agreements',
      icon: <PieChart size={24} color="#7928ca" />,
      description:
        'Artists and collaborators (producers, songwriters, vocalists) co-sign immutable revenue allocation agreements governed by strict 10,000 basis point validation.',
      details: [
        'Multi-party signature consensus: agreements remain DRAFT until all co-creators sign.',
        'SHA-256 agreement hashes anchored on Stellar Testnet.',
        'Full immutable audit log of split terms and version changes.',
      ],
      actionLabel: 'Next: Automated Settlement',
    },
    {
      title: 'Soroban Automated Settlement Engine',
      badge: 'Level 3: Zero-Leakage Payouts',
      icon: <Coins size={24} color="var(--accent-emerald)" />,
      description:
        'When listeners purchase passes, revenue pools are settled automatically to collaborators according to their signed agreement basis points without manual reconciliation.',
      details: [
        'Zero-leakage stroop arithmetic eliminates rounding errors.',
        'Atomic multi-recipient payouts directly into collaborator wallets.',
        'Real-time Server-Sent Events (SSE) notify recipients instantly upon execution.',
      ],
      actionLabel: 'Start Exploring Catalog',
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      if (onSelectTab) onSelectTab('catalog');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close evaluator tour"
        >
          <X size={20} />
        </button>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor:
                  idx === currentStep
                    ? 'var(--accent-cyan)'
                    : idx < currentStep
                    ? 'var(--accent-emerald)'
                    : 'rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {step.icon}
          </div>

          <div>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(0, 242, 254, 0.12)',
                color: 'var(--accent-cyan)',
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-block',
                marginBottom: '6px',
                fontWeight: 700,
              }}
            >
              {step.badge}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>{step.title}</h2>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          {step.description}
        </p>

        {/* Key Points */}
        <div
          style={{
            backgroundColor: '#121526',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '26px',
          }}
        >
          {step.details.map((point, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{point}</span>
            </div>
          ))}
        </div>

        {/* Navigation Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-secondary btn-sm"
            style={{
              opacity: currentStep === 0 ? 0.4 : 1,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Step {currentStep + 1} of {steps.length}
          </span>

          <button
            onClick={handleNext}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{step.actionLabel}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
