"use client";

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/helpers/classname-helper";

export type TactileButtonVariant =
  | "primary"
  | "emerald"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type TactileButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface TactileButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "ref"> {
  variant?: TactileButtonVariant;
  size?: TactileButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  glow?: boolean;
}

const sizeClasses: Record<TactileButtonSize, { button: string; iconSize: string }> = {
  xs: {
    button: "h-7 px-2.5 text-[11px] gap-1.5 rounded-lg font-medium",
    iconSize: "w-3 h-3",
  },
  sm: {
    button: "h-9 px-3.5 text-xs gap-2 rounded-[10px] font-semibold tracking-wide",
    iconSize: "w-3.5 h-3.5",
  },
  md: {
    button: "h-11 px-5 text-sm gap-2.5 rounded-xl font-bold tracking-tight",
    iconSize: "w-4 h-4",
  },
  lg: {
    button: "h-13 px-6 text-base gap-3 rounded-2xl font-black tracking-tight",
    iconSize: "w-5 h-5",
  },
  icon: {
    button: "h-10 w-10 p-0 rounded-xl justify-center",
    iconSize: "w-4 h-4",
  },
};

const variantClasses: Record<TactileButtonVariant, {
  container: string;
  cap: string;
  glowEffect: string;
}> = {
  primary: {
    container: "bg-[#090d16] shadow-[0_4px_12px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.8)] border border-white/10",
    cap: "bg-gradient-to-b from-[#1c2234] to-[#121624] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.5)] border-t border-white/15",
    glowEffect: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
  },
  emerald: {
    container: "bg-[#042f21] shadow-[0_4px_14px_rgba(16,185,129,0.3),0_1px_2px_rgba(0,0,0,0.6)] border border-emerald-500/30",
    cap: "bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(4,47,33,0.5)] border-t border-emerald-300/40",
    glowEffect: "hover:shadow-[0_0_24px_rgba(16,185,129,0.45)]",
  },
  secondary: {
    container: "bg-[#0b0e17] shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-slate-800",
    cap: "bg-gradient-to-b from-[#1b202e] to-[#0f131f] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-2px_0_rgba(0,0,0,0.6)] border-t border-white/10",
    glowEffect: "hover:border-slate-700",
  },
  outline: {
    container: "bg-transparent border border-white/15 shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
    cap: "bg-gradient-to-b from-white/5 to-transparent text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.4)]",
    glowEffect: "hover:bg-white/10 hover:text-white",
  },
  danger: {
    container: "bg-[#450a0a] shadow-[0_4px_14px_rgba(239,68,68,0.3),0_1px_2px_rgba(0,0,0,0.6)] border border-rose-500/30",
    cap: "bg-gradient-to-b from-rose-500 to-rose-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(69,10,10,0.6)] border-t border-rose-300/40",
    glowEffect: "hover:shadow-[0_0_24px_rgba(239,68,68,0.45)]",
  },
  ghost: {
    container: "bg-transparent border-transparent shadow-none",
    cap: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
    glowEffect: "",
  },
};

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      glow = false,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeClasses[size];
    const variantConfig = variantClasses[variant];
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.015, y: -1 }}
        whileTap={isDisabled ? undefined : { scale: 0.975, y: 1.5 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        disabled={isDisabled}
        className={cn(
          "group relative isolate inline-flex select-none items-center justify-center overflow-hidden transition-all duration-150 active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13] disabled:pointer-events-none disabled:opacity-50",
          sizeConfig.button,
          variantConfig.container,
          variantConfig.cap,
          variantConfig.glowEffect,
          glow && "shadow-[0_0_25px_rgba(16,185,129,0.35)]",
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {/* Subtle top bevel tactile highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80"
        />

        {/* Content wrapper */}
        <span className="relative z-10 flex items-center justify-center gap-[inherit]">
          {isLoading ? (
            <svg
              className={cn("animate-spin text-current", sizeConfig.iconSize)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            leftIcon && <span className="shrink-0">{leftIcon}</span>
          )}

          {children}

          {!isLoading && rightIcon && (
            <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </span>
      </motion.button>
    );
  }
);

TactileButton.displayName = "TactileButton";

export function ArrowRightIcon({
  className,
  size = 14,
  ...props
}: {
  className?: string;
  size?: number;
  [key: string]: any;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function TactileButtonShowcase() {
  return (
    <div className="flex min-h-80 w-full flex-col items-center justify-center gap-6 rounded-2xl bg-[#090d16] border border-white/10 p-8 shadow-2xl">
      <div className="text-center space-y-1">
        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
          Tactile Physics Micro-Interactions
        </span>
        <h3 className="text-lg font-bold text-white">Interactive Tactile Buttons</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <TactileButton size="sm">
          <span>Continue</span>
          <ArrowRightIcon size={14} />
        </TactileButton>

        <TactileButton variant="emerald" size="sm">
          <span>Upgrade Now</span>
          <ArrowRightIcon size={14} />
        </TactileButton>

        <TactileButton variant="secondary" size="sm">
          <span>View Statement</span>
        </TactileButton>

        <TactileButton variant="outline" size="sm">
          <span>Cancel Plan</span>
        </TactileButton>

        <TactileButton variant="danger" size="sm">
          <span>Delete Account</span>
        </TactileButton>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span>Sizes:</span>
        <TactileButton size="xs" variant="primary">XS</TactileButton>
        <TactileButton size="sm" variant="primary">SM</TactileButton>
        <TactileButton size="md" variant="primary">MD</TactileButton>
        <TactileButton size="lg" variant="emerald">LG Launch</TactileButton>
      </div>
    </div>
  );
}
