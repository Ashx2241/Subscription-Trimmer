"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { cn } from "@/helpers/classname-helper";
import { LogoTraceLoader } from "@/components/LogoTraceLoader";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(
  null,
);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");
export const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

export const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-91%)",
  "translateY(-91%)",
  "translateY(-81%)",
  "translateY(-81%)",
  "translateY(-70%)",
  "translateY(-70%)",
  "translateY(-58%)",
  "translateY(-58%)",
  "translateY(-45%)",
  "translateY(-45%)",
  "translateY(-32%)",
  "translateY(-32%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-10%)",
  "translateY(-10%)",
  "translateY(-3%)",
  "translateY(-3%)",
  "translateY(0%)",
];

export const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: "Processing your order",
  printing: "Printing your receipt",
  complete: "Order complete",
};

const machineClassName =
  "relative isolate w-full overflow-hidden rounded-[var(--printer-radius)] border border-neutral-800 bg-[#12141a] p-[var(--printer-inset)] pb-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.6)] [--printer-inner-radius:calc(var(--printer-radius)_-_var(--printer-inset))] [--printer-inset:0.75rem] [--printer-radius:1.5rem] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[url('/textures/plastic-noise.svg')] before:bg-[length:180px_180px] before:bg-repeat before:opacity-30 before:mix-blend-multiply before:content-['']";

export function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);

  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }

  return context;
}

export function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Receipt printer",
  animate = true,
  children,
  className,
  feedMotion = "stepped",
  stage,
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full max-w-sm flex-col items-center",
          className,
        )}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

export function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div className={cn(machineClassName, className)} {...props}>
      {children}
      {/* Paper output slot lip */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-[var(--printer-inset)] z-40 h-2 rounded-[0.25rem] border border-black/80 bg-[#05070a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

export function ReceiptPrinterHeader({
  children,
  className,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-11 items-start justify-between mb-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn(
        "relative z-10 isolate overflow-hidden rounded-[var(--printer-inner-radius)] border border-neutral-800/80 bg-[#0a0c12] p-4 text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_24px_4px_rgba(0,0,0,0.5)] after:content-['']",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-3.5", className)}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function StatusIndicator({
  animate,
  move,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === "complete";

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center rounded-full bg-emerald-500 p-0.5 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="complete"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CheckIcon className="stroke-[3.5] text-slate-950" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center text-neutral-400"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="working"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <SpinnerIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function ReceiptPrinterStatus({
  children,
  className,
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2 mt-4 pt-3 border-t border-white/5", className)}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            className="col-start-1 row-start-1 truncate font-medium text-xs text-neutral-300"
            exit={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(-4px)" : "translateY(0px)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(4px)" : "translateY(0px)",
            }}
            key={stage}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn(
        "relative z-10 min-h-80 bg-[#fdfdfc] text-neutral-900 bg-[url('/textures/receipt-paper.svg')] bg-cover px-6 pt-7 pb-10 font-mono shadow-[0_12px_36px_rgba(0,0,0,0.35)]",
        className,
      )}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}

export function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Output",
  );
  const isReceiptVisible = stage !== "processing";
  const shouldUseSteppedFeed =
    feedMotion === "stepped" && stage === "printing" && shouldMove;

  return (
    <div
      className={cn(
        "relative z-50 -mt-4 h-[33rem] w-[calc(88%+1.5rem)] max-w-full overflow-hidden px-4",
        className,
      )}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 -top-1 z-20 h-3 bg-black/60 blur-[4px]"
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        aria-hidden={stage !== "complete"}
        className="relative isolate before:pointer-events-none before:absolute before:inset-x-2 before:top-2 before:bottom-4 before:z-0 before:rounded-sm before:shadow-[0_10px_25px_rgba(0,0,0,0.3)] before:content-['']"
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.85 : 0,
            ease: shouldUseSteppedFeed ? "linear" : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};

/**
 * Visual elements used inside the receipt design from the screenshot
 */
export function SparkleLogoBadge({ className }: { className?: string }) {
  return (
    <div className={cn("grid size-12 place-items-center rounded-xl bg-neutral-900 shadow-md", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="size-7 text-white"
      >
        <path d="M16 2C16 9.73 9.73 16 2 16C9.73 16 16 22.27 16 30C16 22.27 22.27 16 30 16C22.27 16 16 9.73 16 2Z" />
      </svg>
    </div>
  );
}

export function ThermalBarcode({ orderNumber = "ORD 2048", className }: { orderNumber?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 pt-2", className)}>
      {/* SVG Barcode pattern */}
      <svg className="w-48 h-10 text-neutral-900" viewBox="0 0 160 40" fill="currentColor">
        <rect x="2" y="0" width="3" height="40" />
        <rect x="7" y="0" width="1.5" height="40" />
        <rect x="11" y="0" width="4" height="40" />
        <rect x="18" y="0" width="2" height="40" />
        <rect x="22" y="0" width="1.5" height="40" />
        <rect x="26" y="0" width="5" height="40" />
        <rect x="34" y="0" width="2" height="40" />
        <rect x="38" y="0" width="3.5" height="40" />
        <rect x="44" y="0" width="1.5" height="40" />
        <rect x="48" y="0" width="4" height="40" />
        <rect x="55" y="0" width="2" height="40" />
        <rect x="60" y="0" width="3" height="40" />
        <rect x="65" y="0" width="1" height="40" />
        <rect x="68" y="0" width="4" height="40" />
        <rect x="75" y="0" width="2" height="40" />
        <rect x="80" y="0" width="5" height="40" />
        <rect x="88" y="0" width="1.5" height="40" />
        <rect x="92" y="0" width="3" height="40" />
        <rect x="97" y="0" width="2" height="40" />
        <rect x="102" y="0" width="4.5" height="40" />
        <rect x="109" y="0" width="1.5" height="40" />
        <rect x="113" y="0" width="3" height="40" />
        <rect x="118" y="0" width="2" height="40" />
        <rect x="123" y="0" width="4" height="40" />
        <rect x="130" y="0" width="2" height="40" />
        <rect x="135" y="0" width="3" height="40" />
        <rect x="141" y="0" width="1.5" height="40" />
        <rect x="145" y="0" width="4.5" height="40" />
        <rect x="153" y="0" width="2" height="40" />
        <rect x="157" y="0" width="1.5" height="40" />
      </svg>
      <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
        {orderNumber}
      </span>
    </div>
  );
}

export interface TactileReceiptPrinterProps {
  stage?: ReceiptPrinterStage;
  feedMotion?: ReceiptFeedMotion;
  planName?: string;
  planDescription?: string;
  subtotal?: string;
  tax?: string;
  total?: string;
  orderNumber?: string;
  paidWith?: string;
  date?: string;
  onHomeClick?: () => void;
}

/**
 * Pre-composed complete widget directly matching the provided design
 */
export function TactileReceiptPrinter({
  stage = "complete",
  feedMotion = "stepped",
  planName = "PRO PLAN",
  planDescription = "Annual subscription",
  subtotal = "£192.00",
  tax = "£38.40",
  total = "£230.40",
  orderNumber = "ORD-2048",
  paidWith = "Visa •••• 4242",
  date = "11 AUG 2026 · 14:32",
  onHomeClick,
}: TactileReceiptPrinterProps) {
  return (
    <ReceiptPrinter.Root stage={stage} feedMotion={feedMotion} className="mx-auto select-none">
      {/* Top Black Machine */}
      <ReceiptPrinter.Machine>
        <ReceiptPrinter.Header>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-xl bg-neutral-800/80 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-700/80 transition-colors shadow-inner"
            aria-label="App icon"
          >
            <LogoTraceLoader
              size={18}
              loading={stage !== "complete"}
              isComplete={stage === "complete"}
              strokeWidth={2}
              className="text-white"
            />
          </button>

          <button
            type="button"
            onClick={onHomeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-white/10 text-neutral-200 hover:text-white hover:bg-neutral-700/80 transition-colors text-xs font-semibold shadow-inner"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </button>
        </ReceiptPrinter.Header>

        <ReceiptPrinter.Screen>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{planName}</h3>
              <p className="text-xs text-neutral-400 font-medium truncate max-w-[140px]">{planDescription}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-neutral-400 block leading-none">Total</span>
              <span className="text-xl font-extrabold text-white tracking-tight leading-snug">{total}</span>
            </div>
          </div>

          <ReceiptPrinter.Status />
        </ReceiptPrinter.Screen>
      </ReceiptPrinter.Machine>

      {/* Output Paper Feeding Out */}
      <ReceiptPrinter.Output>
        <ReceiptPrinter.Paper>
          <div className="space-y-4">
            {/* Centered Star Badge */}
            <div className="flex justify-center pb-1">
              <SparkleLogoBadge />
            </div>

            {/* Top Dashed Line */}
            <div className="border-t border-dashed border-neutral-400/80 w-full" />

            {/* Plan item */}
            <div>
              <div className="flex justify-between items-baseline font-bold text-sm tracking-tight text-neutral-900">
                <span>{planName.toUpperCase()}</span>
                <span>{subtotal}</span>
              </div>
              <div className="text-xs text-neutral-600 font-mono mt-0.5">
                {planDescription}
              </div>
            </div>

            {/* Middle Dashed Line */}
            <div className="border-t border-dashed border-neutral-400/80 w-full" />

            {/* Subtotal & Tax */}
            <div className="space-y-1 text-xs text-neutral-700 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{tax}</span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="flex justify-between items-baseline pt-2 border-t border-neutral-300 font-mono">
              <span className="font-extrabold text-xs tracking-wider text-neutral-900">TOTAL PAID</span>
              <span className="font-extrabold text-lg text-neutral-950 tracking-tight">{total}</span>
            </div>

            {/* Meta details */}
            <div className="pt-2 border-t border-dashed border-neutral-300 space-y-1.5 text-[11px] font-mono text-neutral-600">
              <div className="flex justify-between">
                <span>Order</span>
                <span className="font-semibold text-neutral-800">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid with</span>
                <span className="text-neutral-800">{paidWith}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="text-neutral-800">{date}</span>
              </div>
            </div>

            {/* Barcode */}
            <div className="pt-1">
              <ThermalBarcode orderNumber={orderNumber.replace("-", " ")} />
            </div>
          </div>
        </ReceiptPrinter.Paper>
      </ReceiptPrinter.Output>
    </ReceiptPrinter.Root>
  );
}
