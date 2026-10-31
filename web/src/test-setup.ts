import '@testing-library/jest-dom';

// jsdom does not implement HTMLMediaElement playback. The player store drives a
// real <audio> element, so stub the media methods to avoid "Not implemented"
// errors and make the store testable in jsdom.
if (typeof HTMLMediaElement !== 'undefined') {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  HTMLMediaElement.prototype.pause = () => {};
  HTMLMediaElement.prototype.load = () => {};
}
