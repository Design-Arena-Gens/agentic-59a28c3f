"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Frame = {
  duration: number;
  headline: string;
  subheadline: string;
  badge?: string;
  footer?: string;
};

const frames: Frame[] = [
  {
    duration: 10,
    headline: "Dubai Dreams Start at ₹7,499",
    subheadline:
      "Ciroc Travel unlocks your visa with speed, precision, and personal care.",
    badge: "Limited Time Offer",
    footer: "India's trusted partner for Gulf getaways",
  },
  {
    duration: 10,
    headline: "Fastest-Growing Visa Experts in India",
    subheadline:
      "Our specialists handle every detail while you plan the memories.",
    badge: "Award-Winning Service",
    footer: "24x7 concierge for travelers & corporates",
  },
  {
    duration: 10,
    headline: "Reliability You Can Feel",
    subheadline:
      "99% approval track record backed by transparent processes and daily updates.",
    badge: "Document Checklists",
    footer: "Dedicated case manager for every application",
  },
  {
    duration: 10,
    headline: "Your Journey, Our Priority",
    subheadline:
      "Express submissions, on-time alerts, and real humans guiding you at each step.",
    badge: "Express Filing",
    footer: "Upfront pricing. Zero hidden fees.",
  },
  {
    duration: 10,
    headline: "Let's Make Dubai Happen",
    subheadline:
      "Flights, stay, travel insurance, and VIP add-ons curated for you.",
    badge: "Full Travel Suite",
    footer: "Bundle perks worth ₹5,000 free this month",
  },
  {
    duration: 10,
    headline: "Call, Click, or Email Today",
    subheadline: "99694 99579 • ciroctravel.com • ciroctravels@yahoo.com",
    badge: "Book Now",
    footer: "Where trust and reliability come first.",
  },
];

const totalDuration = frames.reduce((acc, frame) => acc + frame.duration, 0);

const voiceScript = `
Experience Dubai like never before with Ciroc Travel, India's fastest growing leader in the visa industry.
For just seven thousand four hundred ninety nine rupees, unlock your Dubai visa with experts who place trust and reliability first.
Imagine stepping into iconic skylines, luxury shopping, desert adventures, and gourmet dining, all planned for you with zero stress.
Our dedicated visa specialists triple-check every document, fast-track approvals, and keep you updated at every milestone.
Need express processing? We've got you covered. Travelling with family or your corporate team? Enjoy concierge support, curated itineraries, and exclusive add-on perks worth five thousand rupees this month.
You're never alone with Ciroc Travel. Real humans are only a call or WhatsApp away, twenty four seven.
Ready to make Dubai happen? Visit ciroc travel dot com or call nine nine six nine four nine nine five seven nine.
Prefer email? Reach us at ciroc travels at yahoo dot com, and we'll craft a personalised Dubai plan in minutes.
Ciroc Travel. Trusted, reliable, and passionately dedicated to your next Dubai story.
`;

export default function Home() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBrowser = typeof window !== "undefined";
  const speechSupported = isBrowser && "speechSynthesis" in window;

  const stopPlayback = useCallback(
    (cancelSpeech: boolean) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startedAtRef.current = null;
      setIsPlaying(false);
      setElapsed(totalDuration);
      setFrameIndex(frames.length - 1);
      if (
        speechRef.current &&
        cancelSpeech &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
      speechRef.current = null;
    },
    []
  );

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    startedAtRef.current = performance.now();
    intervalRef.current = setInterval(() => {
      if (!startedAtRef.current) return;
      const now = performance.now();
      const seconds = Math.min(totalDuration, (now - startedAtRef.current) / 1000);
      setElapsed(seconds);
      let accumulated = 0;
      for (let i = 0; i < frames.length; i += 1) {
        accumulated += frames[i].duration;
        if (seconds <= accumulated) {
          setFrameIndex(i);
          break;
        }
      }
      if (seconds >= totalDuration) {
        stopPlayback(false);
      }
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, stopPlayback]);

  const resetAd = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startedAtRef.current = null;
    speechRef.current = null;
    setFrameIndex(0);
    setElapsed(0);
    setIsPlaying(false);
  };

  const startAd = () => {
    resetAd();
    setIsPlaying(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(voiceScript);
      const voices = synth.getVoices();
      const preferredVoice =
        voices.find((voice) => voice.name.toLowerCase().includes("en-in")) ??
        voices.find((voice) => voice.lang.toLowerCase().includes("en-in")) ??
        voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
        null;
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onend = () => {
        stopPlayback(false);
      };
      speechRef.current = utterance;
      synth.cancel();
      synth.speak(utterance);
    }
  };

  const activeFrame = frames[frameIndex];
  const progress = Math.min(100, (elapsed / totalDuration) * 100);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/40 blur-3xl animate-slow-pulse" />
        <div className="absolute top-10 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/30 blur-[120px] animate-slow-spin" />
        <div className="absolute bottom-[-8rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-600/30 blur-[140px] animate-slow-pulse animate-delay-6000" />
      </div>

      <main className="relative z-10 flex w-full max-w-5xl flex-col gap-12 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:p-16">
        <header className="flex flex-col items-start gap-4 text-left">
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            Ciroc Travel Presents
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Dubai Visa Ad Experience
          </h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            Tap play to launch a one-minute immersive advert with dynamic visuals
            and a guided voiceover crafted for the Dubai visa offer at ₹7,499.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-slate-900/80" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
                Live Ad Sequence
              </div>
              <div className="text-sm font-medium text-white/80">
                Duration • 01:00
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {activeFrame.badge ? (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  {activeFrame.badge}
                </span>
              ) : null}

              <h2 className="text-3xl font-bold text-white md:text-5xl">
                {activeFrame.headline}
              </h2>
              <p className="text-base text-white/80 md:text-lg">
                {activeFrame.subheadline}
              </p>
              {activeFrame.footer ? (
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">
                  {activeFrame.footer}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-semibold tabular-nums text-white/70">
                {elapsed < totalDuration ? `0${Math.floor(elapsed / 60)}:${(Math.floor(elapsed) % 60).toString().padStart(2, "0")}` : "01:00"}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Visa Fee ₹7,499* • T&C Apply</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Trusted by 20k+ travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                <span>Fast approvals • Real-time updates</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-white/80">
            <div className="font-semibold uppercase tracking-[0.3em] text-white/60">
              Ciroc Travel India
            </div>
            <div>Call: <a href="tel:+919969499579" className="text-cyan-200">99694 99579</a></div>
            <div>
              Email:{" "}
              <a href="mailto:ciroctravels@yahoo.com" className="text-cyan-200">
                ciroctravels@yahoo.com
              </a>
            </div>
            <div>
              Web:{" "}
              <a
                href="https://www.ciroctravel.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-200"
              >
                www.ciroctravel.com
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <button
              type="button"
              onClick={startAd}
              className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 px-6 py-3 font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/50"
            >
              Play 1-Minute Ad
              <span className="rounded-full bg-white/40 px-2 py-0.5 text-xs font-medium text-slate-900">
                With Voiceover
              </span>
            </button>
            <button
              type="button"
              onClick={resetAd}
              className="rounded-full border border-white/20 px-6 py-3 font-medium uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Reset Experience
            </button>
            {isBrowser && !speechSupported ? (
              <span className="text-xs uppercase tracking-[0.2em] text-red-200/80">
                Voiceover unavailable on this device. Visuals still playable.
              </span>
            ) : null}
          </div>
        </footer>
      </main>
    </div>
  );
}
