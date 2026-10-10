"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PlayOptions = {
  /** Fade the volume in over this many milliseconds. */
  fadeInMs?: number;
};

type AudioControls = {
  isPlaying: boolean;
  /** False when the file is missing or can't be played; the music toggle hides itself. */
  isAvailable: boolean;
  /** True after the guest switches the music off, so opening the envelope won't restart it. */
  isMutedByGuest: boolean;
  /** Browsers only allow audible playback that starts inside a click or tap handler. */
  play: (options?: PlayOptions) => void;
  pause: () => void;
  toggle: () => void;
};

const MusicContext = createContext<AudioControls | null>(null);

type AudioProviderProps = {
  src: string;
  volume: number;
  children: ReactNode;
};

export function AudioProvider({ src, volume, children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef<number | null>(null);
  const pendingFade = useRef<(() => void) | null>(null);
  const resumeWhenVisible = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(src !== "");
  const [isMutedByGuest, setIsMutedByGuest] = useState(false);

  const stopFade = useCallback(() => {
    if (fadeFrame.current !== null) {
      cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    }
    if (pendingFade.current) {
      audioRef.current?.removeEventListener("playing", pendingFade.current);
      pendingFade.current = null;
    }
  }, []);

  const play = useCallback(
    ({ fadeInMs = 0 }: PlayOptions = {}) => {
      const audio = audioRef.current;
      if (!audio) return;

      stopFade();
      setIsMutedByGuest(false);
      audio.volume = fadeInMs > 0 ? 0 : volume;
      audio.play().catch(() => setIsPlaying(false));

      if (fadeInMs > 0) {
        // Ramp up once sound actually starts; on a slow connection the song is still buffering.
        const startFade = () => {
          pendingFade.current = null;
          const start = performance.now();
          const step = (now: number) => {
            // A frame's timestamp can be slightly earlier than `start`.
            const progress = Math.min(1, Math.max(0, (now - start) / fadeInMs));
            audio.volume = volume * progress;
            fadeFrame.current = progress < 1 ? requestAnimationFrame(step) : null;
          };
          fadeFrame.current = requestAnimationFrame(step);
        };
        pendingFade.current = startFade;
        audio.addEventListener("playing", startFade, { once: true });
      }
    },
    [stopFade, volume],
  );

  const pause = useCallback(() => {
    stopFade();
    setIsMutedByGuest(true);
    audioRef.current?.pause();
  }, [stopFade]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) pause();
    else play();
  }, [pause, play]);

  // Pause while the tab is hidden and pick the song back up when the guest returns.
  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        resumeWhenVisible.current = !audio.paused;
        audio.pause();
      } else if (resumeWhenVisible.current) {
        resumeWhenVisible.current = false;
        audio.play().catch(() => setIsPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopFade();
    };
  }, [stopFade]);

  const controls = useMemo<AudioControls>(
    () => ({ isPlaying, isAvailable, isMutedByGuest, play, pause, toggle }),
    [isPlaying, isAvailable, isMutedByGuest, play, pause, toggle],
  );

  return (
    <MusicContext value={controls}>
      {children}
      <audio
        ref={audioRef}
        src={src || undefined}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsAvailable(false);
          setIsPlaying(false);
        }}
      />
    </MusicContext>
  );
}

export function useAudio() {
  const controls = useContext(MusicContext);
  if (!controls) throw new Error("useAudio must be used inside <AudioProvider>.");
  return controls;
}
