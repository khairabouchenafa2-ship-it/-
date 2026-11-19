/**
 * Web Audio API synthesized sound effects and Arabic Speech Synthesis
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.13 },
      { f: 783.99, d: 0.15, t: 0.26 },
      { f: 1046.5, d: 0.35, t: 0.42 },
    ];

    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0, now + note.t);
      gain.gain.linearRampToValueAtTime(0.25, now + note.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    });
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const sounds = new SoundEffects();

// Arabic Speech Synthesis with configurable speed & Arabic voice detection
let activeSpeechCleanup: (() => void) | null = null;
let currentSpeechRateMode: 'slow' | 'normal' = 'normal';

export const setSpeechRateMode = (mode: 'slow' | 'normal') => {
  currentSpeechRateMode = mode;
};

export const getSpeechRateMode = (): 'slow' | 'normal' => currentSpeechRateMode;

export const getArabicVoiceStatus = (): 'available' | 'missing' | 'unsupported' => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return 'unsupported';
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Voices may still be loading asynchronously in some browsers; treat cautiously as available until known
    return 'available';
  }
  const hasAr = voices.some((v) => v.lang.toLowerCase().startsWith('ar') || v.name.includes('Arabic'));
  return hasAr ? 'available' : 'missing';
};

export const speakArabic = (text: string, onEnd?: () => void): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return false;
  }

  if (activeSpeechCleanup) {
    activeSpeechCleanup();
    activeSpeechCleanup = null;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = currentSpeechRateMode === 'slow' ? 0.72 : 0.9;
  utterance.pitch = 1.08;

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(
    (v) => v.lang.toLowerCase().startsWith('ar') || v.name.includes('Arabic')
  );
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (activeSpeechCleanup === finish) {
      activeSpeechCleanup = null;
    }
    onEnd?.();
  };

  activeSpeechCleanup = finish;
  utterance.onend = finish;
  utterance.onerror = finish;

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if (activeSpeechCleanup) {
    activeSpeechCleanup();
    activeSpeechCleanup = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
