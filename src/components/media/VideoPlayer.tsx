import { EASE } from "@/components/motion/Reveal";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
} from "lucide-react";

/** How long the controls stay up after the pointer stops moving, while playing. */
const IDLE_MS = 2600;
/** Jump size for the skip buttons and the J/L keys. */
const SKIP = 10;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** m:ss. The source is 87 seconds, so hours never need a column. */
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  src: string;
  /** Used for the accessible name and the label shown before first play. */
  title: string;
  className?: string;
  /** Extra classes for the <video> itself — object-position, mostly. */
  videoClassName?: string;
  /**
   * Content laid over the video before first play and after the end — a hero
   * headline and its calls to action. It animates away on play and back when
   * the video finishes, and gets `started`/`ended` so its button can say
   * "play" or "watch again".
   */
  overlay?: (api: {
    play: () => void;
    started: boolean;
    ended: boolean;
  }) => ReactNode;
};

/**
 * A video player with its own controls.
 *
 * The native control bar is a different design language on every browser and
 * cannot be styled, so it is switched off and replaced. Everything here is
 * keyboard reachable and the progress bar is a real slider, because a custom
 * control that only works with a mouse is a downgrade, not a design.
 *
 * Progress is driven by requestAnimationFrame rather than `timeupdate`: that
 * event fires about four times a second, which is visibly steppy on a bar
 * this wide.
 */
export function VideoPlayer({
  src,
  title,
  className = "",
  videoClassName = "",
  overlay,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafId = useRef<number>();

  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [controlsUp, setControlsUp] = useState(true);

  // ── playback ───────────────────────────────────────────────────────────
  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Replaying after the end restarts rather than sitting on the last frame.
    if (v.ended) v.currentTime = 0;
    // `started` is set by the `play` event, never here: play() can be refused
    // — by autoplay policy, or a source that won't load — and marking it
    // started optimistically relabels the button "Resume watching" for a
    // video that has not shown a single frame.
    v.play().catch(() => undefined);
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  }, [play]);

  const seekBy = useCallback((delta: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = clamp(v.currentTime + delta, 0, v.duration);
    setTime(v.currentTime);
  }, []);

  const seekTo = useCallback((ratio: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = clamp(ratio, 0, 1) * v.duration;
    setTime(v.currentTime);
  }, []);

  // ── smooth progress while playing ──────────────────────────────────────
  useEffect(() => {
    if (!playing || scrubbing) return;
    const tick = () => {
      const v = videoRef.current;
      if (v) setTime(v.currentTime);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [playing, scrubbing]);

  // ── element events ─────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onMeta = () => setDuration(v.duration);
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
      setEnded(false);
    };
    const onPause = () => setPlaying(false);
    // Only the end brings the hero copy back. Restoring it on an ordinary
    // pause would slam a headline over the frame someone stopped to look at.
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      setControlsUp(true);
    };
    const onVolume = () => {
      setMuted(v.muted);
      setVolume(v.volume);
    };
    // Playing with nothing decoded yet is otherwise indistinguishable from a
    // broken embed: the frame just sits black. Say "loading" instead.
    const onWaiting = () => setStalled(true);
    const onFlowing = () => setStalled(false);
    const onProgress = () => {
      if (!v.buffered.length || !Number.isFinite(v.duration)) return;
      setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
    };
    // Covers the case where metadata is already in by the time we attach.
    if (v.readyState >= 1) onMeta();

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("progress", onProgress);
    v.addEventListener("timeupdate", onProgress);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("stalled", onWaiting);
    v.addEventListener("playing", onFlowing);
    v.addEventListener("canplay", onFlowing);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("timeupdate", onProgress);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("stalled", onWaiting);
      v.removeEventListener("playing", onFlowing);
      v.removeEventListener("canplay", onFlowing);
    };
  }, []);

  // ── fullscreen ─────────────────────────────────────────────────────────
  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void shellRef.current?.requestFullscreen?.();
  }, []);

  // ── auto-hide ──────────────────────────────────────────────────────────
  const wake = useCallback(() => {
    setControlsUp(true);
    clearTimeout(idleTimer.current);
    // Never hide the bar while it is being used, or while paused — a hidden
    // control bar on a paused video just looks like a broken image.
    if (!playing || scrubbing) return;
    idleTimer.current = setTimeout(() => setControlsUp(false), IDLE_MS);
  }, [playing, scrubbing]);

  useEffect(() => {
    wake();
    return () => clearTimeout(idleTimer.current);
  }, [wake]);

  // ── scrubbing ──────────────────────────────────────────────────────────
  const ratioFromEvent = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  const onTrackDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    seekTo(ratioFromEvent(e.clientX));
  };
  const onTrackMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    seekTo(ratioFromEvent(e.clientX));
  };
  const onTrackUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setScrubbing(false);
  };

  // ── keyboard ───────────────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    // Let the controls' own buttons handle their keys.
    if ((e.target as HTMLElement).closest("button")) return;
    const v = videoRef.current;
    if (!v) return;
    const keys: Record<string, () => void> = {
      " ": toggle,
      k: toggle,
      ArrowLeft: () => seekBy(-5),
      ArrowRight: () => seekBy(5),
      j: () => seekBy(-SKIP),
      l: () => seekBy(SKIP),
      m: () => {
        v.muted = !v.muted;
      },
      f: toggleFullscreen,
      Home: () => seekTo(0),
      End: () => seekTo(1),
    };
    const run = keys[e.key] ?? keys[e.key.toLowerCase()];
    if (!run) return;
    e.preventDefault();
    run();
    wake();
  };

  const progress = duration ? time / duration : 0;

  return (
    <div
      ref={shellRef}
      // No radius of its own — a framed panel and a full-bleed hero want
      // different corners, so the caller decides.
      className={`group/player relative overflow-hidden bg-black ${className}`}
      onPointerMove={wake}
      onPointerLeave={() => playing && setControlsUp(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${title} — video player`}
    >
      {/* `#t=0.1` makes the browser paint the first frame as a still, which
          saves shipping a separate poster image. `preload="metadata"` keeps
          the download to a few KB until someone actually presses play. */}
      <video
        ref={videoRef}
        src={`${src}#t=0.1`}
        title={title}
        preload="metadata"
        playsInline
        className={`block h-full w-full cursor-pointer bg-black object-cover ${videoClassName}`}
        onClick={toggle}
      />

      {/* Buffering — only while the curtain is down, since the two occupy the
          same middle of the frame and stack into noise otherwise. */}
      {playing && stalled && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <span
              aria-hidden="true"
              className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent motion-reduce:animate-none"
            />
            <span className="font-display text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              Loading
            </span>
          </div>
        </div>
      )}

      {/* The curtain: scrim plus whatever the page wants over the still. It
          clears on play and only comes back at the end; an ordinary pause
          keeps the frame clear and leaves the control bar to resume.
          `initial={false}` on AnimatePresence means it is simply there on
          first paint and only animates on the returns after that. */}
      <AnimatePresence initial={false}>
        {!playing && (!started || ended) ? (
          <motion.div
            key="curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Trails the copy's own lift so the scrim is the last thing to go,
            // rather than the text dissolving against a bare frame.
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            // Two scrims, not one. A single bottom-up fade darkens the whole
            // frame to make text readable; weighting it to the left instead
            // lets the copy sit on near-black while the subject stays lit.
            // Empty areas stay click-through, so tapping the frame still
            // starts the video; only the content inside takes the pointer.
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.45)_100%),linear-gradient(to_right,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_42%,rgba(0,0,0,0)_78%)]"
          >
            {overlay ? (
              <div className="pointer-events-auto absolute inset-0">
                {overlay({ play, started, ended })}
              </div>
            ) : (
              <button
                type="button"
                onClick={play}
                className="pointer-events-auto absolute inset-0 grid place-items-center"
                aria-label={`Play ${title}`}
              >
                <span className="relative grid h-20 w-20 place-items-center rounded-full bg-accent text-[hsl(240_10%_8%)] shadow-gold transition-transform duration-500 group-hover/player:scale-105 sm:h-24 sm:w-24">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-accent/40 motion-reduce:animate-none"
                  />
                  <Play className="relative ml-1 h-8 w-8 fill-current sm:h-9 sm:w-9" />
                </span>
                <span className="absolute inset-x-0 bottom-7 px-6 text-center font-display text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                  Watch — {formatTime(duration)}
                </span>
              </button>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Control bar — a floating glass pill inset from the edges. Run
          edge-to-edge along the bottom it reads as browser chrome bolted to
          the page rather than part of the design.
          Hidden entirely until first play: before that the big play button is
          the only affordance needed, and a control bar underneath it just
          crowds the poster frame with things that do nothing yet. */}
      <div
        className={`absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-black/45 px-3 pb-2 pt-1.5 backdrop-blur-xl transition-all duration-300 sm:inset-x-5 sm:bottom-5 sm:px-4 sm:pb-2.5 ${
          // Off while the curtain is up, so the two never stack.
          started && !ended && controlsUp
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          onPointerDown={onTrackDown}
          onPointerMove={onTrackMove}
          onPointerUp={onTrackUp}
          onPointerCancel={onTrackUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") seekBy(-5);
            else if (e.key === "ArrowRight") seekBy(5);
            else if (e.key === "Home") seekTo(0);
            else if (e.key === "End") seekTo(1);
            else return;
            e.preventDefault();
          }}
          className="group/track relative flex h-5 cursor-pointer touch-none items-center focus-visible:outline-none"
        >
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-200 group-hover/track:h-1.5 group-focus-visible/track:h-1.5">
            <div
              className="absolute inset-y-0 left-0 bg-white/30"
              style={{ width: `${buffered * 100}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 gold-gradient"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent shadow-gold transition-transform duration-200 ${
              scrubbing
                ? "scale-125"
                : "scale-0 group-hover/track:scale-100 group-focus-visible/track:scale-100"
            }`}
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="mt-1.5 flex items-center gap-1 text-white">
          <CtlButton onClick={toggle} label={playing ? "Pause" : "Play"}>
            {playing ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </CtlButton>

          <CtlButton
            onClick={() => seekBy(-SKIP)}
            label={`Back ${SKIP} seconds`}
            className="hidden sm:grid"
          >
            <RotateCcw className="h-[18px] w-[18px]" />
          </CtlButton>
          <CtlButton
            onClick={() => seekBy(SKIP)}
            label={`Forward ${SKIP} seconds`}
            className="hidden sm:grid"
          >
            <RotateCw className="h-[18px] w-[18px]" />
          </CtlButton>

          {/* The volume slider expands out of the mute button on hover. */}
          <div className="group/vol flex items-center">
            <CtlButton
              onClick={() => {
                const v = videoRef.current;
                if (v) v.muted = !v.muted;
              }}
              label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </CtlButton>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(e) => {
                const v = videoRef.current;
                if (!v) return;
                v.volume = Number(e.target.value);
                v.muted = Number(e.target.value) === 0;
              }}
              className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 opacity-0 transition-all duration-300 group-hover/vol:ml-2 group-hover/vol:w-16 group-hover/vol:opacity-100 focus-visible:ml-2 focus-visible:w-16 focus-visible:opacity-100 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
            />
          </div>

          <span className="ml-2 select-none font-display text-xs tabular-nums text-white/75">
            {formatTime(time)} <span className="text-white/35">/</span>{" "}
            {formatTime(duration)}
          </span>

          <div className="ml-auto">
            <CtlButton
              onClick={toggleFullscreen}
              label={fullscreen ? "Exit full screen" : "Full screen"}
            >
              {fullscreen ? (
                <Minimize className="h-[18px] w-[18px]" />
              ) : (
                <Maximize className="h-[18px] w-[18px]" />
              )}
            </CtlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtlButton({
  onClick,
  label,
  children,
  className = "",
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-white/85 transition-colors duration-200 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {children}
    </button>
  );
}
