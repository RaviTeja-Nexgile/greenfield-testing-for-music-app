import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '../store/player';
import styles from './Player.module.css';

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(s / 60);
  const remainder = s % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export default function Player() {
  const player = usePlayer();
  const song = currentSong(player);
  const [error, setError] = useState(false);

  // Playback position is driven by the <audio> element in the player store
  // (real audio, criterion 4.9), so no simulated tick timer is needed here.

  // Empty state: nothing loaded in the queue.
  if (!song) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V6l12-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <h3>Nothing is playing</h3>
        <p>Pick a song from your library or search to start listening.</p>
        <Link className={styles.btn} to="/search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Find music
        </Link>
      </div>
    );
  }

  // Error state.
  if (error) {
    return (
      <div className={styles.error} role="alert">
        <div className={styles.errorIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3>This song won't play</h3>
        <p>The audio couldn't be loaded. It may have been removed, or your connection dropped. Try again.</p>
        <button className={styles.btn} type="button" onClick={() => setError(false)}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.nowPlaying}>
        <div className={styles.artwork} aria-hidden="true">
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

        <div className={styles.npInfo}>
          <div className={styles.npEyebrow}>Now playing</div>
          <h2 className={styles.npTitle}>{song.title}</h2>
          <p className={styles.npArtist}>
            <a href="#">{song.artist}</a>
          </p>

          <div className={styles.controls}>
            <div className={styles.progress}>
              <span className={styles.time}>{formatTime(player.position)}</span>
              <input
                type="range"
                className={styles.range}
                min={0}
                max={song.duration || 0}
                step={1}
                value={Math.min(player.position, song.duration)}
                aria-label="Seek"
                onChange={(e) => seek(Number(e.target.value))}
              />
              <span className={styles.time}>{formatTime(song.duration)}</span>
            </div>

            <div className={styles.controlsRow}>
              <button
                type="button"
                className={`${styles.ctrlBtn}${player.shuffle ? ` ${styles.active}` : ''}`}
                aria-label="Shuffle"
                aria-pressed={player.shuffle}
                onClick={toggleShuffle}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                </svg>
              </button>
              <button type="button" className={styles.ctrlBtn} aria-label="Previous" onClick={previous}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button type="button" className={styles.ctrlBtn} aria-label="Next" onClick={next}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </button>
            </div>

            <div className={styles.volume}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input
                type="range"
                className={styles.volumeRange}
                min={0}
                max={1}
                step={0.01}
                value={player.volume}
                aria-label="Volume"
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.queue}>
        <div className={styles.queueHead}>
          <h2>Up next</h2>
          <span>From your queue</span>
        </div>
        <div className={styles.rowList}>
          {player.queue.map((q, index) => {
            const isCurrent = index === player.currentIndex;
            return (
              <div key={q.id} className={`${styles.rowItem}${isCurrent ? ` ${styles.playing}` : ''}`}>
                <div className={styles.rowCover} aria-hidden="true">
                  {q.coverUrl ? (
                    <img src={q.coverUrl} alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V6l12-2v12" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  )}
                </div>
                <div className={styles.rowMeta}>
                  <div className={styles.rowTitle}>{q.title}</div>
                  <div className={styles.rowSub}>{q.artist}</div>
                </div>
                <span className={styles.rowDur}>{formatTime(q.duration)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
