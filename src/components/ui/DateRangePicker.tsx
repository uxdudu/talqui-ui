import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { Icons } from "../icons";
import "react-day-picker/style.css";

export type DateRange = { from: Date; to: Date };

function formatRangeLabel(range: DateRange): string {
  return `${range.from.getDate()} ${range.from.toLocaleDateString("pt-BR", {
    month: "short",
  })} – ${range.to.getDate()} ${range.to.toLocaleDateString("pt-BR", {
    month: "short",
  })}`;
}

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getDefaultDateRange(): DateRange {
  const now = new Date();
  const start = startOfWeek(now);
  const end = endOfWeek(now);
  return { from: start, to: end };
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className = "" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from) return;
    const to = range.to ?? range.from;
    onChange({ from: range.from, to });
    if (range.to != null) setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex min-h-[26px] cursor-pointer items-center gap-2 rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-3 py-1 pr-8 text-xs font-medium text-(--talqui-text-strong) transition-colors hover:border-(--talqui-border-strong) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
      >
        {formatRangeLabel(value)}
        <Icons.Calendar
          size={14}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-(--talqui-text-medium)"
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-3 shadow-lg"
          style={{ minWidth: "280px" }}
        >
          <DayPicker
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={handleSelect}
            locale={ptBR}
            numberOfMonths={1}
            defaultMonth={value.from}
          />
        </div>
      )}
    </div>
  );
}
