/**
 * セルフコーチングログ — ToggleButton
 * スタンプ風の選択ボタン。Field Note デザインテーマ。
 */

import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150",
            "active:scale-95",
            value === opt.value
              ? "bg-[#C1785A] border-[#C1785A] text-white shadow-sm"
              : "bg-white border-[#D9D4CC] text-[#5A5550] hover:border-[#C1785A] hover:text-[#C1785A]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
