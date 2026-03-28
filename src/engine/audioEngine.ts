import type { AudioSettings } from '../types';

interface TriggerOptions extends AudioSettings {
  intensity?: number;
}

class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lastTriggerAt = 0;

  private ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return null;
      this.context = new AudioContextClass();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.context.destination);
    }

    return this.context;
  }

  resume = async () => {
    const context = this.ensureContext();
    if (context && context.state === 'suspended') {
      await context.resume();
    }
  };

  triggerFlap = async ({
    muted,
    volume,
    density,
    intensity = 1,
  }: TriggerOptions) => {
    if (muted || volume <= 0 || density <= 0) return;
    const context = this.ensureContext();
    if (!context || !this.masterGain) return;

    const now = context.currentTime;
    const gapMs = density >= 0.9 ? 8 : density >= 0.6 ? 20 : 38;
    if (performance.now() - this.lastTriggerAt < gapMs) return;
    this.lastTriggerAt = performance.now();

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.05, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }

    const source = context.createBufferSource();
    source.buffer = noiseBuffer;

    const bandpass = context.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1600 + Math.random() * 600;
    bandpass.Q.value = 0.45;

    const clickGain = context.createGain();
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(
      Math.max(0.008, volume * 0.08 * intensity * (0.75 + Math.random() * 0.5)),
      now + 0.003,
    );
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    const tone = context.createOscillator();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(200 + Math.random() * 70, now);
    tone.frequency.exponentialRampToValueAtTime(80 + Math.random() * 30, now + 0.05);

    const toneGain = context.createGain();
    toneGain.gain.setValueAtTime(0.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(
      Math.max(0.006, volume * 0.03 * intensity),
      now + 0.002,
    );
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    source.connect(bandpass);
    bandpass.connect(clickGain);
    clickGain.connect(this.masterGain);

    tone.connect(toneGain);
    toneGain.connect(this.masterGain);

    source.start(now);
    source.stop(now + 0.055);
    tone.start(now);
    tone.stop(now + 0.055);
  };
}

export const audioEngine = new AudioEngine();
