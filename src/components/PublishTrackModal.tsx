import React, { useState } from 'react';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { X, Music, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface PublishTrackModalProps {
  onClose: () => void;
  onTrackPublished: () => void;
}

export const PublishTrackModal: React.FC<PublishTrackModalProps> = ({ onClose, onTrackPublished }) => {
  const { address } = useWallet();
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Synthwave');
  const [price, setPrice] = useState('2.0');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtworkFile(file);
      setArtworkPreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !artistName || !audioFile) {
      setError('Title, artist name, and audio file are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Ensure artist exists or register
      const artistWallet = address || 'GBU7M3L62RTR6YXZZ2WOD6W7G3D7JGBWUXR7G7C3T3G2Z7C66Q4';
      const artist = await api.createArtist({
        wallet_address: artistWallet,
        display_name: artistName,
        bio: `Independent artist on Stellar Music`,
      });

      // 2. Upload media files
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (artworkFile) {
        formData.append('artwork', artworkFile);
      }

      const media = await api.uploadMedia(formData);

      // 3. Create track
      await api.createTrack({
        artist_id: artist.id,
        title,
        description,
        audio_reference: media.audio_reference,
        artwork_reference: media.artwork_reference,
        price: parseFloat(price) || 0,
        status,
        genre,
        duration_seconds: 180,
      });

      onTrackPublished();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
        }}
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
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
          Publish Track to Stellar
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Set your track price in Testnet XLM and configure access rights.
        </p>

        {error && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Track Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Celestial Orbit"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Artist Display Name *
            </label>
            <input
              type="text"
              required
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g. King Taiwo"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Track Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell listeners about this track..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#121526',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                <option value="Synthwave">Synthwave</option>
                <option value="Ambient">Ambient</option>
                <option value="Afrobeats">Afrobeats</option>
                <option value="Electronic">Electronic</option>
                <option value="Lo-Fi">Lo-Fi</option>
                <option value="Hip Hop">Hip Hop</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Music Pass Price (XLM)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2.0"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Audio File (.mp3, .wav) *
            </label>
            <div style={{
              border: '2px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              position: 'relative',
            }}>
              <input
                type="file"
                accept="audio/*"
                required
                onChange={handleAudioChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              <Music size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {audioFile ? audioFile.name : 'Click to select or drop audio file'}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Cover Artwork (Optional)
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {artworkPreview ? (
                  <img src={artworkPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={22} color="var(--text-muted)" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}
              />
            </div>
          </div>

          {/* Draft vs Published toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Publication Status
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStatus('PUBLISHED')}
                className={`btn btn-sm ${status === 'PUBLISHED' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                PUBLISHED
              </button>
              <button
                type="button"
                onClick={() => setStatus('DRAFT')}
                className={`btn btn-sm ${status === 'DRAFT' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                DRAFT
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isSubmitting ? 'Uploading & Registering...' : 'Publish Track'}
          </button>
        </form>
      </div>
    </div>
  );
};
