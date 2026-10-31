import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetPlayer,
  playQueue,
  playSong,
  togglePlay,
  setPlaying,
  next,
  previous,
  toggleShuffle,
  cycleRepeat,
  setRepeat,
  setVolume,
  seek,
  tick,
  currentSong,
  getPlayerState,
} from './player';
import type { Song } from './player';

const songs: Song[] = [
  { id: '1', title: 'First', artist: 'A', duration: 100 },
  { id: '2', title: 'Second', artist: 'B', duration: 100 },
  { id: '3', title: 'Third', artist: 'C', duration: 100 },
];

beforeEach(() => {
  resetPlayer();
});

describe('player store', () => {
  describe('play and pause (4.2)', () => {
    it('starts playing when a queue is loaded', () => {
      playQueue(songs);
      expect(getPlayerState().isPlaying).toBe(true);
      expect(currentSong(getPlayerState())?.id).toBe('1');
    });

    it('pauses and resumes with togglePlay', () => {
      playQueue(songs);
      togglePlay();
      expect(getPlayerState().isPlaying).toBe(false);
      togglePlay();
      expect(getPlayerState().isPlaying).toBe(true);
    });

    it('setPlaying controls playback explicitly', () => {
      playQueue(songs);
      setPlaying(false);
      expect(getPlayerState().isPlaying).toBe(false);
      setPlaying(true);
      expect(getPlayerState().isPlaying).toBe(true);
    });
  });

  describe('next and previous (4.3)', () => {
    it('advances to the next song', () => {
      playQueue(songs);
      next();
      expect(currentSong(getPlayerState())?.id).toBe('2');
    });

    it('goes back to the previous song', () => {
      playQueue(songs, 1);
      previous();
      expect(currentSong(getPlayerState())?.id).toBe('1');
    });

    it('stops at the end of the queue when repeat is off', () => {
      playQueue(songs, 2);
      next();
      expect(getPlayerState().isPlaying).toBe(false);
      expect(getPlayerState().position).toBe(0);
    });
  });

  describe('shuffle (4.4)', () => {
    it('toggles shuffle on and off', () => {
      playQueue(songs);
      expect(getPlayerState().shuffle).toBe(false);
      toggleShuffle();
      expect(getPlayerState().shuffle).toBe(true);
      toggleShuffle();
      expect(getPlayerState().shuffle).toBe(false);
    });

    it('moves to a different song when shuffle is on', () => {
      playQueue(songs);
      toggleShuffle();
      next();
      expect(currentSong(getPlayerState())?.id).not.toBe('1');
    });
  });

  describe('repeat (4.5)', () => {
    it('cycles repeat mode off -> all -> one -> off', () => {
      playQueue(songs);
      expect(getPlayerState().repeat).toBe('off');
      cycleRepeat();
      expect(getPlayerState().repeat).toBe('all');
      cycleRepeat();
      expect(getPlayerState().repeat).toBe('one');
      cycleRepeat();
      expect(getPlayerState().repeat).toBe('off');
    });

    it('wraps to the start when repeat is all', () => {
      playQueue(songs, 2);
      setRepeat('all');
      next();
      expect(currentSong(getPlayerState())?.id).toBe('1');
    });

    it('repeats the current song when repeat is one', () => {
      playQueue(songs, 1);
      setRepeat('one');
      next();
      expect(currentSong(getPlayerState())?.id).toBe('2');
      expect(getPlayerState().position).toBe(0);
    });
  });

  describe('volume (4.6)', () => {
    it('changes the volume', () => {
      playQueue(songs);
      setVolume(0.3);
      expect(getPlayerState().volume).toBe(0.3);
    });

    it('clamps volume to 0..1', () => {
      playQueue(songs);
      setVolume(2);
      expect(getPlayerState().volume).toBe(1);
      setVolume(-1);
      expect(getPlayerState().volume).toBe(0);
    });
  });

  describe('seek (4.7)', () => {
    it('seeks to a position in the song', () => {
      playQueue(songs);
      seek(42);
      expect(getPlayerState().position).toBe(42);
    });

    it('clamps seek to the song duration', () => {
      playQueue(songs);
      seek(9999);
      expect(getPlayerState().position).toBe(100);
      seek(-5);
      expect(getPlayerState().position).toBe(0);
    });
  });

  describe('tick', () => {
    it('advances position while playing', () => {
      playQueue(songs);
      tick(5);
      expect(getPlayerState().position).toBe(5);
    });

    it('does not advance while paused', () => {
      playQueue(songs);
      setPlaying(false);
      tick(5);
      expect(getPlayerState().position).toBe(0);
    });

    it('advances to the next song when the current one ends', () => {
      playQueue(songs);
      tick(100);
      expect(currentSong(getPlayerState())?.id).toBe('2');
    });
  });

  describe('playSong', () => {
    it('replaces the queue with a single song', () => {
      playSong(songs[1]);
      const state = getPlayerState();
      expect(state.queue).toHaveLength(1);
      expect(currentSong(state)?.id).toBe('2');
      expect(state.isPlaying).toBe(true);
    });
  });
});
