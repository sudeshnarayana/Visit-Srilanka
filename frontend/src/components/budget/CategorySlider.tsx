"use client";

import type { LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CategorySliderProps {
  icon: LucideIcon;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function CategorySlider({
  icon: Icon,
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: CategorySliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-foreground">
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </Label>
        <span className="font-display text-lg font-semibold text-primary">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}
