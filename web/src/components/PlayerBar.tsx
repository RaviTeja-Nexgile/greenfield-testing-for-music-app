import { useEffect, useRef } from 'react';
import {
  usePlayer,
  currentSong,
  togglePlay,
  next,
  previous,
  toggleShuffle,
  cycleRepeat,
  setVolume,
  seek,
  tick,
} from '../store/player';
import styles from './PlayerBar.module.css';

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(s / 60);
  const remainder = s % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export default function PlayerBar() {
  const player = usePlayer();
  const song = currentSong(player);
  const progressRef = useRef<HTMLInputElement>(null);

  // Advance playback position while playing.
  useEffect(() => {
    if (!player.isPlaying) return;
    const id = window.setInterval(() => tick(1), 1000);
    return () => window.clearInterval(id);
  }, [player.isPlaying]);

  if (!song) {
    return null;
  }

  const handleProgressChange = (value: number) => {
    seek(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  return (
    <div className={styles.playerBar}>
      <div className={styles.playerNow}>
        <div className={styles.playerCover} aria-hidden="true">
          {song.coverUrl ? (
            <img src={song.coverUrl} alt="" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V6l12-2v12" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </div>
        <div className={styles.playerMeta}>
          <div className={styles.playerTitle}>{song.title}</div>
          <div className={styles.playerSub}>{song.artist}</div>
        </div>
      </div>

      <div className={styles.playerControls}>
        <div className={styles.controlsRow}>
          <button
            type="button"
            className={`${styles.ctrlBtn}${player.shuffle ? ` ${styles.active}` : ''}`}
            aria-label="Shuffle"
            aria-pressed={player.shuffle}
            onClick={toggleShuffle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.ctrlBtn}
            aria-label="Previous"
            onClick={previous}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zM20 6l-10 6 10 6z" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.ctrlBtn} ${styles.play}`}
            aria-label={player.isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            {player.isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={styles.ctrlBtn}
            aria-label="Next"
            onClick={next}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.ctrlBtn}${player.repeat !== 'off' ? ` ${styles.active}` : ''}`}
            aria-label="Repeat"
            aria-pressed={player.repeat !== 'off'}
            onClick={cycleRepeat}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(player.position)}</span>
          <input
            ref={progressRef}
            type="range"
            className={styles.range}
            min={0}
            max={song.duration || 0}
            step={1}
            value={Math.min(player.position, song.duration)}
            aria-label="Seek"
            onChange={(e) => handleProgressChange(Number(e.target.value))}
          />
          <span className={styles.time}>{formatTime(song.duration)}</span>
        </div>
      </div>

      <div className={styles.playerRight}>
        <button type="button" className={styles.ctrlBtn} aria-label="Volume">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>
        <input
          type="range"
          className={styles.volumeRange}
          min={0}
          max={1}
          step={0.01}
          value={player.volume}
          aria-label="Volume"
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
