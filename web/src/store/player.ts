import { useSyncExternalStore } from 'react';

/**
 * A song as the player understands it. The full catalog model lives on the
 * server; the player only needs enough to render the bar and drive playback.
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  /** Duration in seconds. */
  duration: number;
  /** Optional cover image URL. */
  coverUrl?: string;
  /** Optional audio stream URL (the song's actual audio file). */
  audioUrl?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  /** The ordered queue of songs. */
  queue: Song[];
  /** Index of the current song in the queue, or null when nothing is loaded. */
  currentIndex: number | null;
  /** Whether playback is active (playing) or paused. */
  isPlaying: boolean;
  /** Current position in seconds. */
  position: number;
  /** Playback volume, 0..1. */
  volume: number;
  /** Whether shuffle is on. */
  shuffle: boolean;
  /** Repeat mode. */
  repeat: RepeatMode;
}

const initialState: PlayerState = {
  queue: [],
  currentIndex: null,
  isPlaying: false,
  position: 0,
  volume: 0.7,
  shuffle: false,
  repeat: 'off',
};

let state: PlayerState = initialState;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Keep the browser's Media Session in sync with the player so playback
 * continues (and shows lock-screen / OS controls) when the listener switches
 * to another app or locks the screen (criterion 4.8).
 */
function syncMediaSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }
  const song = currentSong(state);
  if (!song) {
    return;
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: '',
    artwork: song.coverUrl ? [{ src: song.coverUrl }] : [],
  });
  navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';
  navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
  navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
  navigator.mediaSession.setActionHandler('previoustrack', previous);
  navigator.mediaSession.setActionHandler('nexttrack', next);
}

// --- Real audio element -----------------------------------------------------

/**
 * The single <audio> element the player drives. It is created lazily so the
 * store works in non-browser environments (tests, SSR) where `Audio` is
 * unavailable. Playback state (position, ended) is sourced from this element's
 * events rather than a simulated tick, so the song's actual audio file plays
 * through the device's audio output (criterion 4.9).
 */
let audioElement: HTMLAudioElement | null = null;
/** The audio URL currently loaded into the element, to avoid redundant loads. */
let loadedAudioUrl: string | null = null;

function getAudioElement(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') {
    return null;
  }
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'auto';
    audioElement.addEventListener('timeupdate', () => {
      if (audioElement && !Number.isNaN(audioElement.currentTime)) {
        state = { ...state, position: audioElement.currentTime };
        emit();
      }
    });
    audioElement.addEventListener('ended', () => {
      // The song finished: advance to the next one.
      next();
    });
    audioElement.addEventListener('error', () => {
      // A load failure leaves the element paused; keep the store consistent.
      if (state.isPlaying) {
        state = { ...state, isPlaying: false };
        emit();
      }
    });
  }
  return audioElement;
}

/**
 * Reconcile the <audio> element with the current store state: load the current
 * song's audio file, apply volume, and play or pause. Called after every state
 * change that affects playback.
 */
function syncAudio(): void {
  const el = getAudioElement();
  if (!el) {
    return;
  }
  const song = currentSong(state);

  if (!song) {
    if (loadedAudioUrl !== null) {
      el.pause();
      el.removeAttribute('src');
      el.load();
      loadedAudioUrl = null;
    }
    return;
  }

  const url = song.audioUrl ?? '';
  if (loadedAudioUrl !== url) {
    el.src = url;
    loadedAudioUrl = url;
  }

  el.volume = state.volume;

  if (state.isPlaying) {
    // Ignore the "not implemented" rejection jsdom throws for play().
    const p = el.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        /* no-op in environments without real audio output */
      });
    }
  } else {
    el.pause();
  }
}

function setState(next: PlayerState) {
  state = next;
  syncMediaSession();
  syncAudio();
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PlayerState {
  return state;
}

/** The current song, or null when the queue is empty. */
export function currentSong(state: PlayerState): Song | null {
  if (state.currentIndex === null) return null;
  return state.queue[state.currentIndex] ?? null;
}

/** Load a queue and start playing from the given index (defaults to 0). */
export function playQueue(songs: Song[], startIndex = 0): void {
  if (songs.length === 0) return;
  const index = Math.max(0, Math.min(startIndex, songs.length - 1));
  setState({
    ...state,
    queue: songs,
    currentIndex: index,
    isPlaying: true,
    position: 0,
  });
}

/** Play a single song, replacing the queue. */
export function playSong(song: Song): void {
  playQueue([song], 0);
}

/** Toggle between playing and paused. */
export function togglePlay(): void {
  if (state.currentIndex === null) return;
  setState({ ...state, isPlaying: !state.isPlaying });
}

/** Start or pause playback explicitly. */
export function setPlaying(playing: boolean): void {
  if (state.currentIndex === null) return;
  setState({ ...state, isPlaying: playing });
}

/** Advance to the next song, honouring repeat and shuffle. */
export function next(): void {
  const { queue, currentIndex, repeat, shuffle } = state;
  if (queue.length === 0 || currentIndex === null) return;

  if (repeat === 'one') {
    setState({ ...state, position: 0 });
    return;
  }

  if (shuffle && queue.length > 1) {
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    setState({ ...state, currentIndex: nextIndex, position: 0, isPlaying: true });
    return;
  }

  if (currentIndex < queue.length - 1) {
    setState({ ...state, currentIndex: currentIndex + 1, position: 0, isPlaying: true });
    return;
  }

  // At the end of the queue.
  if (repeat === 'all') {
    setState({ ...state, currentIndex: 0, position: 0, isPlaying: true });
  } else {
    setState({ ...state, isPlaying: false, position: 0 });
  }
}

/** Go back to the previous song, honouring shuffle. */
export function previous(): void {
  const { queue, currentIndex, shuffle } = state;
  if (queue.length === 0 || currentIndex === null) return;

  if (shuffle && queue.length > 1) {
    let prevIndex = currentIndex;
    while (prevIndex === currentIndex) {
      prevIndex = Math.floor(Math.random() * queue.length);
    }
    setState({ ...state, currentIndex: prevIndex, position: 0, isPlaying: true });
    return;
  }

  if (currentIndex > 0) {
    setState({ ...state, currentIndex: currentIndex - 1, position: 0, isPlaying: true });
  } else {
    setState({ ...state, position: 0 });
  }
}

/** Toggle shuffle on and off. */
export function toggleShuffle(): void {
  setState({ ...state, shuffle: !state.shuffle });
}

/** Cycle repeat mode: off -> all -> one -> off. */
export function cycleRepeat(): void {
  const order: RepeatMode[] = ['off', 'all', 'one'];
  const nextMode = order[(order.indexOf(state.repeat) + 1) % order.length];
  setState({ ...state, repeat: nextMode });
}

/** Set repeat mode directly. */
export function setRepeat(mode: RepeatMode): void {
  setState({ ...state, repeat: mode });
}

/** Set the playback volume, clamped to 0..1. */
export function setVolume(volume: number): void {
  const clamped = Math.max(0, Math.min(1, volume));
  setState({ ...state, volume: clamped });
}

/** Seek to a position in seconds, clamped to the song's duration. */
export function seek(position: number): void {
  const song = currentSong(state);
  const max = song ? song.duration : 0;
  const clamped = Math.max(0, Math.min(position, max));
  setState({ ...state, position: clamped });
  const el = getAudioElement();
  if (el && !Number.isNaN(el.duration) && el.duration > 0) {
    el.currentTime = clamped;
  }
}

/**
 * Advance the position by a number of seconds. Kept for callers that still
 * drive playback manually; real playback advances position from the <audio>
 * element's `timeupdate` events instead.
 */
export function tick(deltaSeconds: number): void {
  const song = currentSong(state);
  if (!song || !state.isPlaying) return;
  const nextPosition = state.position + deltaSeconds;
  if (nextPosition >= song.duration) {
    setState({ ...state, position: song.duration });
    next();
  } else {
    setState({ ...state, position: nextPosition });
  }
}

/** Reset the store to its initial state (used by tests). */
export function resetPlayer(): void {
  loadedAudioUrl = null;
  if (audioElement) {
    audioElement.pause();
    audioElement.removeAttribute('src');
    audioElement.load();
  }
  setState(initialState);
}

/** React hook that subscribes a component to the player store. */
export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Read the current player state directly (for non-React callers and tests). */
export function getPlayerState(): PlayerState {
  return state;
}
