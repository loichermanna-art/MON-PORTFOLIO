/**
 * Synthétiseur acoustique Web Audio minimaliste (« Glide Panel Sound ») :
 * Génère un souffle d'air filtré soyeux + une harmonique cristalline pentatonique
 * propre à chaque panneau (01..06), ainsi qu'un micro-clic tactile discret.
 * Zéro fichier MP3 externe requis.
 */

const PANEL_FREQUENCIES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25] as const;

class GlideSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private ensureContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playGlide(panelIndex: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = PANEL_FREQUENCIES[panelIndex % PANEL_FREQUENCIES.length];

    // 1. Harmonique chaude (fondamentale + quinte douce)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.16);

    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.72);
    osc2.stop(now + 0.72);

    // 2. Léger souffle d'air filtré ("panel glide whoosh")
    const bufferSize = Math.floor(ctx.sampleRate * 0.28);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(360, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.18);
    filter.Q.value = 1.8;

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.0001, now);
    whooshGain.gain.linearRampToValueAtTime(0.028, now + 0.05);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.27);

    whiteNoise.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whiteNoise.start(now);
  }

  public playTick(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.045);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }
}

export const glideSound = new GlideSoundEngine();
