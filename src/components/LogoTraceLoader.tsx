"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/helpers/classname-helper";

export type LogoTraceLoaderProps = {
  loading?: boolean;
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  fillFadeSeconds?: number;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
};

type LoaderPhase = "loop" | "closingOutline" | "fadingFill" | "done";

const LOGO_VIEW_BOX = "0 0 32 32";

const TRACE_PATH =
  "M16 2C16 9.73 9.73 16 2 16C9.73 16 16 22.27 16 30C16 22.27 22.27 16 30 16C22.27 16 16 9.73 16 2Z";

const FILL_PATHS = [
  "M16 2C16 9.73 9.73 16 2 16C9.73 16 16 22.27 16 30C16 22.27 22.27 16 30 16C22.27 16 16 9.73 16 2Z",
] as const;

export function LogoTraceLoader({
  loading = true,
  isComplete = false,
  size = 32,
  strokeWidth = 2,
  loopDurationSeconds = 1.4,
  fillFadeSeconds = 0.35,
  className,
  ariaLabel = "Loading...",
  onDone,
}: LogoTraceLoaderProps) {
  const [phase, setPhase] = useState<LoaderPhase>("loop");
  const onDoneCalledRef = useRef(false);

  const isDoneLoading = isComplete || !loading;

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) {
        setPhase("done");
        if (!onDoneCalledRef.current) {
          onDoneCalledRef.current = true;
          onDone?.();
        }
        return;
      }
    }

    if (!isDoneLoading) {
      setPhase("loop");
      onDoneCalledRef.current = false;
      return;
    }

    // When loading finishes, begin transition sequence
    if (phase === "loop") {
      setPhase("closingOutline");

      // After stroke closure duration, transition to fading fill
      const outlineTimeout = setTimeout(() => {
        setPhase("fadingFill");
      }, 350);

      return () => clearTimeout(outlineTimeout);
    }

    if (phase === "fadingFill") {
      // Transition from fading fill to done
      const fillTimeout = setTimeout(() => {
        setPhase("done");
        if (!onDoneCalledRef.current) {
          onDoneCalledRef.current = true;
          onDone?.();
        }
      }, fillFadeSeconds * 1000);

      return () => clearTimeout(fillTimeout);
    }

    if (phase === "done" && !onDoneCalledRef.current) {
      onDoneCalledRef.current = true;
      onDone?.();
    }
  }, [isDoneLoading, phase, fillFadeSeconds, onDone]);

  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      viewBox={LOGO_VIEW_BOX}
      width={size}
      height={size}
      className={cn("inline-block select-none overflow-visible", className)}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      {/* Background ghost track */}
      <g opacity="0.18">
        <path
          d={TRACE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={Math.max(1, strokeWidth / 2)}
          strokeLinejoin="round"
        />
      </g>

      {/* Looping stroke segment during active loading */}
      {phase === "loop" && (
        <path
          d={TRACE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="0.16 0.84"
          style={{
            animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite`,
          }}
        />
      )}

      {/* Closing outline animation */}
      {phase === "closingOutline" && (
        <path
          d={TRACE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: "1 0",
            transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      )}

      {/* Fading fill & final resolved mark */}
      {(phase === "fadingFill" || phase === "done") && (
        <g
          style={{
            opacity: phase === "done" ? 1 : undefined,
            animation:
              phase === "fadingFill"
                ? `logo-trace-fill-fade ${fillFadeSeconds}s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                : undefined,
          }}
        >
          {FILL_PATHS.map((path, idx) => (
            <path key={idx} d={path} fill="currentColor" />
          ))}
        </g>
      )}
    </svg>
  );
}

export default LogoTraceLoader;
