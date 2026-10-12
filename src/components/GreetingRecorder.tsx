"use client";

import { Camera, CircleCheck, RotateCcw, Send, Square, Upload } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useId, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";
import { UploadError, uploadVideo } from "@/lib/cloudinary";
import { fieldClass, secondaryButtonClass } from "@/lib/ui";
import { buttonClass } from "./ButtonLink";

type Step = "start" | "camera" | "recording" | "review" | "sending" | "sent";

type Clip = { blob: Blob; url: string; fileName: string };

// Safari records MP4; Chrome and Firefox may only offer WebM. The compile step accepts both.
const RECORDING_TYPES = [
  "video/mp4;codecs=avc1,mp4a",
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm",
];
// About 20 MB a minute, well under Cloudinary's 100 MB limit.
const VIDEO_BITS_PER_SECOND = 2_500_000;

/** Lets a guest record (or pick) a short video greeting and sends it to Cloudinary. */
export function GreetingRecorder() {
  const { greetings } = wedding;
  const isClient = useIsClient();
  const canRecord = isClient && supportsRecording();

  const [step, setStep] = useState<Step>("start");
  const [clip, setClip] = useState<Clip | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  // Release the camera if the guest leaves mid-recording.
  useEffect(
    () => () => {
      stopTimer(timerRef);
      stopStream(streamRef);
    },
    [],
  );

  // Each preview URL holds the video in memory until it is revoked.
  useEffect(() => {
    if (!clip) return;
    return () => URL.revokeObjectURL(clip.url);
  }, [clip]);

  // Leaving the page would cancel the upload, so ask first.
  useEffect(() => {
    if (step !== "sending") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [step]);

  async function openCamera() {
    setError(null);
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStep("camera");
    } catch (cameraError) {
      setError(
        cameraError instanceof DOMException && cameraError.name === "NotAllowedError"
          ? "Camera access was blocked. Allow it in your browser settings, or choose a video instead."
          : "We couldn't open your camera. Please choose a video instead.",
      );
    }
  }

  function closeCamera() {
    stopStream(streamRef);
    setStep("start");
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;

    const mimeType = RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
        audioBitsPerSecond: 128_000,
      });
    } catch {
      closeCamera();
      setError("This browser can't record video. Please choose a video instead.");
      return;
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      stopTimer(timerRef);
      stopStream(streamRef);
      const type = recorder.mimeType || mimeType || "video/webm";
      const blob = new Blob(chunks, { type });
      const extension = type.includes("mp4") ? "mp4" : "webm";
      setClip({ blob, url: URL.createObjectURL(blob), fileName: `greeting.${extension}` });
      setStep("review");
    };

    recorderRef.current = recorder;
    recorder.start(1000);
    setSeconds(0);
    setStep("recording");

    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setSeconds(Math.floor(elapsed));
      if (elapsed >= greetings.maxSeconds) stopRecording();
    }, 250);
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }

  async function pickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clear the input so choosing the same file again still counts as a change.
    event.target.value = "";
    if (!file) return;
    setError(null);

    if (file.size > greetings.maxFileMB * 1024 * 1024) {
      setError(
        `This video is ${Math.round(file.size / (1024 * 1024))} MB, and the limit is ${greetings.maxFileMB} MB. Record your greeting here instead, or film it in 1080p rather than 4K.`,
      );
      return;
    }

    // Some phones' videos can't be read here; those are trimmed when the video is put together.
    const duration = await readDuration(file);
    if (Number.isFinite(duration) && duration > greetings.maxSeconds + 1) {
      setError(
        `This video is ${formatTime(duration)} long. Please choose one up to ${formatTime(greetings.maxSeconds)}, or record one here.`,
      );
      return;
    }

    setClip({ blob: file, url: URL.createObjectURL(file), fileName: file.name || "greeting.mp4" });
    setStep("review");
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clip) return;

    setError(null);
    setProgress(0);
    setStep("sending");
    try {
      await uploadVideo({
        ...greetings.cloudinary,
        file: clip.blob,
        fileName: clip.fileName,
        context: { name: name.trim(), message: message.trim() },
        onProgress: setProgress,
      });
      setClip(null);
      setStep("sent");
    } catch (uploadError) {
      setError(
        uploadError instanceof UploadError
          ? uploadError.message
          : "The video could not be sent. Please try again.",
      );
      setStep("review");
    }
  }

  function startOver() {
    setClip(null);
    setError(null);
    setStep("start");
  }

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="video/*"
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      onChange={pickFile}
    />
  );

  return (
    <div className="mx-auto max-w-xl rounded-photo border border-gold/50 bg-paper p-6 text-center shadow-card sm:p-8">
      {step === "start" ? (
        <>
          <div className="flex flex-col items-center gap-4">
            {canRecord ? (
              <button type="button" onClick={openCamera} className={buttonClass()}>
                <Camera className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Record a greeting
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={canRecord ? secondaryButtonClass : buttonClass()}
            >
              <Upload className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Choose a video
            </button>
            {fileInput}
          </div>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-rosewood">
            Up to {formatTime(greetings.maxSeconds)} long. Find a quiet spot with good light.
            {isClient && !canRecord
              ? " To record right on this page, open it in Safari or Chrome."
              : null}
          </p>
        </>
      ) : null}

      {step === "camera" || step === "recording" ? (
        <>
          <div className="relative">
            <video
              ref={(node) => {
                if (node && node.srcObject !== streamRef.current) {
                  node.srcObject = streamRef.current;
                }
              }}
              autoPlay
              muted
              playsInline
              className="max-h-[60svh] w-full -scale-x-100 rounded-[6px] bg-ink object-contain"
            />
            {step === "recording" ? (
              <p className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1 text-sm text-paper lining-nums">
                <span
                  className="size-2.5 animate-pulse-soft rounded-full bg-ruby"
                  aria-hidden="true"
                />
                {formatTime(seconds)} / {formatTime(greetings.maxSeconds)}
              </p>
            ) : null}
          </div>
          <div className="mt-6 flex flex-col items-center gap-4">
            {step === "camera" ? (
              <>
                <button type="button" onClick={startRecording} className={buttonClass()}>
                  <span className="size-3 rounded-full bg-gold-light" aria-hidden="true" />
                  Start recording
                </button>
                <button type="button" onClick={closeCamera} className={secondaryButtonClass}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={stopRecording} className={buttonClass()}>
                <Square className="size-3.5 fill-current" strokeWidth={0} aria-hidden="true" />
                Stop
              </button>
            )}
          </div>
        </>
      ) : null}

      {(step === "review" || step === "sending") && clip ? (
        <form onSubmit={send} className="text-left">
          <video
            src={clip.url}
            controls
            playsInline
            className="max-h-[60svh] w-full rounded-[6px] bg-ink object-contain"
          />
          <fieldset disabled={step === "sending"} className="mt-6 space-y-5">
            <label className="block" htmlFor={`${baseId}-name`}>
              <span className="text-label tracking-label text-rosewood uppercase">Your name</span>
              <input
                id={`${baseId}-name`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                autoComplete="name"
                placeholder="e.g. Tita Linda and family"
                className={fieldClass}
              />
            </label>
            <label className="block" htmlFor={`${baseId}-message`}>
              <span className="text-label tracking-label text-rosewood uppercase">
                A note for the couple (optional)
              </span>
              <textarea
                id={`${baseId}-message`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={300}
                rows={3}
                className={cn(fieldClass, "resize-y")}
              />
            </label>
          </fieldset>

          {step === "sending" ? (
            <div className="mt-6" aria-live="polite">
              <div
                role="progressbar"
                aria-label="Sending your greeting"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="h-2 overflow-hidden rounded-full bg-champagne"
              >
                <div
                  className="h-full bg-crimson transition-[width] duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-3 text-center text-[0.95rem] text-rosewood">
                Sending… {Math.round(progress * 100)}%. Please keep this page open.
              </p>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4">
              <button type="submit" className={buttonClass()}>
                <Send className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Send greeting
              </button>
              <button type="button" onClick={startOver} className={secondaryButtonClass}>
                <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Start over
              </button>
            </div>
          )}
        </form>
      ) : null}

      {step === "sent" ? (
        <div aria-live="polite">
          <CircleCheck
            className="mx-auto size-10 text-gold"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <p className="mt-4 font-serif text-[1.4rem] leading-snug text-crimson italic">
            {greetings.thankYou}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/" className={buttonClass()}>
              Back to the invitation
            </Link>
            <button type="button" onClick={startOver} className={secondaryButtonClass}>
              Send another greeting
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 text-[0.95rem] leading-relaxed text-ruby">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function supportsRecording() {
  return Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== "undefined";
}

function stopStream(streamRef: { current: MediaStream | null }) {
  streamRef.current?.getTracks().forEach((track) => track.stop());
  streamRef.current = null;
}

function stopTimer(timerRef: { current: number | null }) {
  if (timerRef.current !== null) window.clearInterval(timerRef.current);
  timerRef.current = null;
}

/** Resolves NaN when the browser can't read the video (e.g. HEVC on some Android phones). */
function readDuration(file: Blob) {
  return new Promise<number>((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    let timeout = 0;
    const finish = (duration: number) => {
      window.clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    timeout = window.setTimeout(() => finish(NaN), 5000);
    video.preload = "metadata";
    video.muted = true;
    video.onloadedmetadata = () => finish(video.duration);
    video.onerror = () => finish(NaN);
    video.src = url;
  });
}

function formatTime(totalSeconds: number) {
  const whole = Math.round(totalSeconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
