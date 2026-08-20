"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/helpers/classname-helper";

const MAGNET_DISTANCE = 180;
const MAX_MAGNET_OFFSET = 10;
const MAGNET_SPRING = { damping: 24, mass: 0.65, stiffness: 280 };

export type MagneticDropZoneProps = {
  accept?: string;
  className?: string;
  maxSize?: number;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  titleText?: string;
  subtitleText?: string;
  icon?: ReactNode;
};

export function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

// Built-in crisp SVG Icons
function FileIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-6", className)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function FilePdfIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-6", className)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 12v6M10 15h3a1.5 1.5 0 0 0 0-3h-3z" />
    </svg>
  );
}

function ImageSquareIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-6", className)}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function FileSpreadsheetIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-6", className)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8M8 17h8M12 9v12" />
    </svg>
  );
}

function UploadIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckCircleIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={cn("size-4", className)}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XIconSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={cn("size-3.5", className)}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function getFileIconComponent(file: File) {
  if (file.type.startsWith("image/")) {
    return ImageSquareIconSvg;
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return FilePdfIconSvg;
  }

  if (
    file.name.toLowerCase().endsWith(".csv") ||
    file.name.toLowerCase().endsWith(".xlsx") ||
    file.name.toLowerCase().endsWith(".xls") ||
    file.type.includes("sheet") ||
    file.type.includes("csv")
  ) {
    return FileSpreadsheetIconSvg;
  }

  return FileIconSvg;
}

function isFileDrag(dataTransfer: DataTransfer | null) {
  return dataTransfer
    ? Array.from(dataTransfer.types).includes("Files")
    : false;
}

function acceptsFile(file: File, accept: string) {
  if (!accept.trim()) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) => {
      if (rule.startsWith(".")) {
        return fileName.endsWith(rule);
      }

      if (rule.endsWith("/*")) {
        return fileType.startsWith(rule.slice(0, -1));
      }

      return fileType === rule;
    });
}

export function MagneticDropZone({
  accept = "image/*,.pdf,.zip",
  className,
  maxSize = 20 * 1024 * 1024,
  multiple = false,
  onFilesChange,
  titleText,
  subtitleText,
  icon,
}: MagneticDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isNear, setIsNear] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const magnetScale = useMotionValue(1);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const springX = useSpring(magnetX, MAGNET_SPRING);
  const springY = useSpring(magnetY, MAGNET_SPRING);
  const springScale = useSpring(magnetScale, MAGNET_SPRING);
  const springGlowX = useSpring(glowX, MAGNET_SPRING);
  const springGlowY = useSpring(glowY, MAGNET_SPRING);

  const transform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0) scale(${springScale})`;
  const glowTransform = useMotionTemplate`translate3d(${springGlowX}px, ${springGlowY}px, 0)`;

  const resetMagnet = useCallback(() => {
    magnetX.set(0);
    magnetY.set(0);
    magnetScale.set(1);
    glowX.set(0);
    glowY.set(0);
    setIsNear(false);
    setIsOver(false);
  }, [glowX, glowY, magnetScale, magnetX, magnetY]);

  useEffect(() => {
    function handleWindowDragOver(event: globalThis.DragEvent) {
      if (!isFileDrag(event.dataTransfer)) {
        return;
      }

      const zone = zoneRef.current;

      if (!zone) {
        return;
      }

      const rect = zone.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceFromEdgeX = Math.max(
        Math.abs(event.clientX - centerX) - rect.width / 2,
        0
      );
      const distanceFromEdgeY = Math.max(
        Math.abs(event.clientY - centerY) - rect.height / 2,
        0
      );
      const distance = Math.hypot(distanceFromEdgeX, distanceFromEdgeY);
      const pointerIsOver =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      const proximity = Math.max(0, 1 - distance / MAGNET_DISTANCE);

      if (proximity === 0) {
        resetMagnet();
        return;
      }

      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const pointerDistance = Math.max(Math.hypot(deltaX, deltaY), 1);
      const offset = pointerIsOver ? 0 : proximity * MAX_MAGNET_OFFSET;

      magnetX.set(shouldReduceMotion ? 0 : (deltaX / pointerDistance) * offset);
      magnetY.set(shouldReduceMotion ? 0 : (deltaY / pointerDistance) * offset);
      magnetScale.set(shouldReduceMotion ? 1 : pointerIsOver ? 1.025 : 1.01);
      glowX.set(shouldReduceMotion ? 0 : deltaX);
      glowY.set(shouldReduceMotion ? 0 : deltaY);
      setIsNear(true);
      setIsOver(pointerIsOver);
    }

    function handleDragEnd() {
      resetMagnet();
    }

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragend", handleDragEnd);
    window.addEventListener("drop", handleDragEnd);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragend", handleDragEnd);
      window.removeEventListener("drop", handleDragEnd);
    };
  }, [
    glowX,
    glowY,
    magnetScale,
    magnetX,
    magnetY,
    resetMagnet,
    shouldReduceMotion,
  ]);

  const acceptFiles = useCallback(
    (incomingFiles: File[]) => {
      const nextFiles = multiple ? incomingFiles : incomingFiles.slice(0, 1);
      const unsupportedFile = nextFiles.find(
        (file) => !acceptsFile(file, accept)
      );
      const oversizedFile = nextFiles.find((file) => file.size > maxSize);

      if (unsupportedFile) {
        setFiles([]);
        setError(`${unsupportedFile.name} is not a supported file type.`);
        onFilesChange?.([]);
        return;
      }

      if (oversizedFile) {
        setFiles([]);
        setError(
          `${oversizedFile.name} is larger than ${formatBytes(maxSize)}.`
        );
        onFilesChange?.([]);
        return;
      }

      if (nextFiles.length === 0) {
        return;
      }

      setFiles(nextFiles);
      setError(null);
      onFilesChange?.(nextFiles);
    },
    [accept, maxSize, multiple, onFilesChange]
  );

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    acceptFiles(Array.from(event.dataTransfer.files));
    resetMagnet();
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!isFileDrag(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function clearFiles() {
    setFiles([]);
    setError(null);
    onFilesChange?.([]);
  }

  const firstFile = files[0];
  const FileTypeIcon = firstFile ? getFileIconComponent(firstFile) : FileIconSvg;
  const title = isOver
    ? "Let go to add it"
    : isNear
      ? "Bring it closer"
      : titleText || "Drop a file here";

  return (
    <motion.div
      className={cn(
        "relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border px-6 py-8 text-center outline-none transition-[border-color,background-color,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] shadow-xl",
        isOver
          ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
          : isNear
            ? "border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            : "border-slate-800 bg-[#0b0f19]/80 hover:border-slate-700",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={zoneRef}
      style={{
        transform: shouldReduceMotion ? undefined : transform,
      }}
    >
      <input
        accept={accept}
        className="hidden"
        multiple={multiple}
        onChange={handleInputChange}
        ref={inputRef}
        type="file"
      />

      {/* Dynamic Magnetic Glow */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 -mt-20 -ml-20 size-40 rounded-full bg-cyan-500/20 blur-3xl transition-opacity duration-200",
          isNear ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: glowTransform }}
      />

      {firstFile ? (
        <div className="relative flex w-full flex-col items-center z-10">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-md">
            <FileTypeIcon className="size-7" />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-emerald-400">
            <CheckCircleIconSvg className="size-4" />
            <p className="font-semibold text-white text-sm">
              {files.length === 1
                ? "Ready for AI Analysis"
                : `${files.length} files ready`}
            </p>
          </div>
          <p className="mt-1 max-w-full truncate text-slate-300 text-sm font-medium">
            {firstFile.name}
            {files.length > 1 ? ` +${files.length - 1}` : ""}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-slate-400 uppercase">
            {formatBytes(firstFile.size)}
          </p>

          <div className="mt-5 flex items-center gap-2">
            <button
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 font-medium text-slate-200 text-xs transition-all active:scale-[0.97] shadow-sm"
              onClick={openFilePicker}
              type="button"
            >
              <UploadIconSvg className="size-3.5" />
              Replace
            </button>
            <button
              aria-label={`Remove ${firstFile.name}`}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-rose-300 px-3 font-medium text-slate-300 text-xs transition-all active:scale-[0.97]"
              onClick={clearFiles}
              type="button"
            >
              <XIconSvg className="size-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          className="relative flex cursor-pointer flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 z-10 w-full"
          onClick={openFilePicker}
          type="button"
        >
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 shadow-md transition-all duration-200",
              isOver && "border-cyan-400 bg-cyan-950/60 text-cyan-300 scale-110",
              isNear && !isOver && "border-cyan-500/50 bg-cyan-950/30 text-cyan-400"
            )}
          >
            {icon ? (
              icon
            ) : (
              <UploadIconSvg className="size-6 text-cyan-400" />
            )}
          </div>
          <p className="mt-4 font-bold text-white text-base tracking-tight">{title}</p>
          <p className="mt-1 text-slate-400 text-xs leading-5 font-mono">
            {subtitleText || `or click to browse · up to ${formatBytes(maxSize)}`}
          </p>
        </button>
      )}

      {error ? (
        <p
          aria-live="polite"
          className="relative mt-4 max-w-sm text-rose-400 text-xs leading-5 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl"
        >
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}
