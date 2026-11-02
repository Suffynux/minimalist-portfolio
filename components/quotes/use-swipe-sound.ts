"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const preferenceKey = "suffynux:quote-swipe-sound";

/** A short filtered-noise breath. No audio downloads or background loop. */
export function useSwipeSound() {
  const context = useRef<AudioContext | null>(null);
  const noise = useRef<AudioBuffer | null>(null);
  const stopVoice = useRef<(() => void) | null>(null);
  const enabledRef = useRef(true);
  const mounted = useRef(false);
  const resuming = useRef<Promise<void> | null>(null);
  const lastPlayed = useRef(-Infinity);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);

  const unlock = useCallback(async () => {
    if (!enabledRef.current || !mounted.current || !window.AudioContext)
      return false;
    try {
      if (!context.current || context.current.state === "closed") {
        const audio = new AudioContext();
        context.current = audio;
        noise.current = null;
        lastPlayed.current = -Infinity;
        audio.onstatechange = () => {
          if (mounted.current && context.current === audio)
            setReady(audio.state === "running" && enabledRef.current);
        };
      }
      const audio = context.current;
      if (audio.state !== "running") {
        // Autoplay may remain pending until a gesture. Retry inside that gesture,
        // without accumulating resume requests from wheel/scroll events.
        if (!resuming.current || navigator.userActivation?.isActive) {
          const attempt = audio.resume();
          resuming.current = attempt;
          void attempt.then(
            () => {
              if (resuming.current === attempt) resuming.current = null;
            },
            () => {
              if (resuming.current === attempt) resuming.current = null;
            },
          );
        }
        await resuming.current;
      }
      if (
        !mounted.current ||
        context.current !== audio ||
        !enabledRef.current
      ) {
        if (audio.state === "running") void audio.suspend().catch(() => {});
        return false;
      }
      setReady(audio.state === "running");
      return audio.state === "running";
    } catch {
      if (mounted.current) setReady(false);
      return false;
    }
  }, []);

  const play = useCallback((direction: number) => {
    const audio = context.current;
    if (
      !enabledRef.current ||
      !audio ||
      audio.state !== "running" ||
      document.hidden
    )
      return;
    const now = audio.currentTime;
    if (now - lastPlayed.current < 0.18) return;
    lastPlayed.current = now;
    stopVoice.current?.();

    // Reuse one short noise buffer; shape a fresh voice for each card crossing.
    if (!noise.current) {
      const buffer = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * 0.34),
        audio.sampleRate,
      );
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++)
        samples[i] = Math.random() * 2 - 1;
      noise.current = buffer;
    }
    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    const pan = audio.createStereoPanner();
    source.buffer = noise.current;
    filter.type = "bandpass";
    filter.Q.value = 0.65;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(650, now + 0.31);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.075);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    gain.gain.linearRampToValueAtTime(0, now + 0.32);
    pan.pan.setValueAtTime(direction > 0 ? 0.25 : -0.25, now);
    pan.pan.linearRampToValueAtTime(direction > 0 ? -0.35 : 0.35, now + 0.3);
    source
      .connect(filter)
      .connect(gain)
      .connect(pan)
      .connect(audio.destination);
    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      gain.gain.cancelAndHoldAtTime(audio.currentTime);
      gain.gain.linearRampToValueAtTime(0, audio.currentTime + 0.025);
      source.stop(audio.currentTime + 0.03);
    };
    stopVoice.current = stop;
    source.onended = () => {
      stopped = true;
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      pan.disconnect();
      if (stopVoice.current === stop) stopVoice.current = null;
    };
    source.start(now);
    source.stop(now + 0.33);
  }, []);

  const toggle = useCallback(async () => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      localStorage.setItem(preferenceKey, next ? "on" : "off");
    } catch {}
    if (next) {
      if (await unlock()) play(1);
    } else {
      stopVoice.current?.();
      setReady(false);
      void context.current?.suspend().catch(() => {});
    }
  }, [play, unlock]);

  useEffect(() => {
    mounted.current = true;
    setAvailable(typeof window.AudioContext === "function");
    try {
      enabledRef.current = localStorage.getItem(preferenceKey) !== "off";
    } catch {
      enabledRef.current = true;
    }
    setEnabled(enabledRef.current);
    const activate = (event: Event) => {
      // Let the explicit control own its click to avoid enable/mute races.
      if ((event.target as Element)?.closest?.("[data-quote-sound-toggle]"))
        return;
      if (resuming.current && !navigator.userActivation?.isActive) return;
      if (enabledRef.current) void unlock();
    };
    const visibility = () => {
      if (document.hidden) {
        stopVoice.current?.();
        void context.current?.suspend().catch(() => {});
      } else if (enabledRef.current) {
        void unlock();
      }
    };
    document.addEventListener("pointerdown", activate, { passive: true });
    document.addEventListener("pointerup", activate, { passive: true });
    document.addEventListener("touchend", activate, { passive: true });
    document.addEventListener("click", activate);
    document.addEventListener("wheel", activate, { passive: true });
    document.addEventListener("keydown", activate);
    document.addEventListener("visibilitychange", visibility);
    // Start automatically wherever browser policy allows it. Otherwise the first
    // normal page interaction unlocks audio, with no separate enable step.
    if (enabledRef.current) void unlock();
    return () => {
      mounted.current = false;
      document.removeEventListener("pointerdown", activate);
      document.removeEventListener("pointerup", activate);
      document.removeEventListener("touchend", activate);
      document.removeEventListener("click", activate);
      document.removeEventListener("wheel", activate);
      document.removeEventListener("keydown", activate);
      document.removeEventListener("visibilitychange", visibility);
      stopVoice.current?.();
      const audio = context.current;
      context.current = null;
      resuming.current = null;
      noise.current = null;
      if (audio) {
        audio.onstatechange = null;
        void audio.close().catch(() => {});
      }
    };
  }, [unlock]);

  return { enabled, ready, available, toggle, play };
}
