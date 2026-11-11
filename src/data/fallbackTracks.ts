import { Track, Artist } from '../types';

export const FALLBACK_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    wallet_address: 'GASTRALDRIFT7777777777777777777777777777777777777777',
    display_name: 'Astral Drift',
    bio: 'Pioneering interstellar synthwave and cosmic soundscapes on the Stellar ledger.',
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'artist-2',
    wallet_address: 'GDFW3FFFKOM5UUZI3DA4NEELV5VMENLYMYMLCKL73RO4IKI27CKRISDA',
    display_name: 'Nova Pulse',
    bio: 'Deep ambient electronic melodies crafted for late-night focused exploration.',
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'artist-3',
    wallet_address: 'GBNNXJVSF7CCVGLXX7ZMTT6UKQG6SVBTVCPJOHBQ75X3VQBROG6DRJ3A',
    display_name: 'King Taiwo',
    bio: 'Afrobeats and melodic grooves merging African rhythms with decentralized Web3 music.',
    created_at: '2026-10-01T00:00:00Z',
  },
];

export const FALLBACK_TRACKS: Track[] = [
  {
    id: 'track-1',
    artist_id: 'artist-1',
    artist_name: 'Astral Drift',
    artist_wallet: 'GASTRALDRIFT7777777777777777777777777777777777777777',
    title: 'Cosmic Voyage',
    description:
      'An expansive voyage across the digital cosmos featuring vintage synthesizers and analog warmth.',
    audio_reference:
      'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cosmic-glow-110684.mp3',
    artwork_reference:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    price: 2.0,
    status: 'PUBLISHED',
    genre: 'Synthwave',
    duration_seconds: 214,
    created_at: '2026-10-01T00:00:00Z',
    has_split: true,
    split_status: 'LOCKED',
  },
  {
    id: 'track-2',
    artist_id: 'artist-2',
    artist_name: 'Nova Pulse',
    artist_wallet: 'GDFW3FFFKOM5UUZI3DA4NEELV5VMENLYMYMLCKL73RO4IKI27CKRISDA',
    title: 'Midnight Nebula',
    description:
      'Gentle atmospheric pads and warm sub-bass designed to elevate meditative deep work.',
    audio_reference:
      'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3',
    artwork_reference:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    price: 5.0,
    status: 'PUBLISHED',
    genre: 'Ambient',
    duration_seconds: 182,
    created_at: '2026-10-01T00:00:00Z',
    has_split: true,
    split_status: 'LOCKED',
  },
  {
    id: 'track-3',
    artist_id: 'artist-3',
    artist_name: 'King Taiwo',
    artist_wallet: 'GBNNXJVSF7CCVGLXX7ZMTT6UKQG6SVBTVCPJOHBQ75X3VQBROG6DRJ3A',
    title: 'Lagos Horizon',
    description:
      'Infectious rhythmic basslines and uplifting brass celebrating Lagos street vitality.',
    audio_reference:
      'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844783307.mp3?filename=summer-tropical-beat-112194.mp3',
    artwork_reference:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    price: 3.5,
    status: 'PUBLISHED',
    genre: 'Afrobeats',
    duration_seconds: 195,
    created_at: '2026-10-01T00:00:00Z',
    has_split: true,
    split_status: 'LOCKED',
  },
  {
    id: 'track-4',
    artist_id: 'artist-1',
    artist_name: 'Astral Drift',
    artist_wallet: 'GASTRALDRIFT7777777777777777777777777777777777777777',
    title: 'Solar Eclipse (Preview)',
    description: 'Free preview track welcoming listeners to the Stellar Music platform.',
    audio_reference:
      'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-12099.mp3',
    artwork_reference:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80',
    price: 0.0,
    status: 'PUBLISHED',
    genre: 'Electronic',
    duration_seconds: 160,
    created_at: '2026-10-01T00:00:00Z',
    has_split: false,
  },
];
