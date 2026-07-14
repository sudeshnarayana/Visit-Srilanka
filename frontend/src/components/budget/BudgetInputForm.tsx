"use client";

import { Users, CalendarDays, Hotel, Car, UtensilsCrossed, Ticket } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CategorySlider } from "./CategorySlider";

import type {
  AccommodationType,
  ActivityType,
  BudgetInputs,
  FoodType,
  TransportType,
} from "@/types/budget";

const ACCOMMODATION_TYPES: AccommodationType[] = ["Budget hotel", "Standard hotel", "Luxury hotel"];
const TRANSPORT_TYPES: TransportType[] = ["Public Transport", "Rental Car", "Private Driver", "Taxi"];
const FOOD_TYPES: FoodType[] = ["Budget meals", "Normal meals", "Luxury dining"];
const ACTIVITY_TYPES: ActivityType[] = ["Entrance fees", "Tours", "Experiences"];

interface ChipGroupProps<T extends string> {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
}

function ChipGroup<T extends string>({ options, selected, onSelect }: ChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-ocean-300"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface BudgetInputFormProps {
  inputs: BudgetInputs;
  onTravelersChange: (value: number) => void;
  onDaysChange: (value: number) => void;
  onAccommodationChange: (value: AccommodationType) => void;
  onTransportChange: (value: TransportType) => void;
  onFoodChange: (value: FoodType) => void;
  onActivityToggle: (value: ActivityType) => void;
}

export function BudgetInputForm({
  inputs,
  onTravelersChange,
  onDaysChange,
  onAccommodationChange,
  onTransportChange,
  onFoodChange,
  onActivityToggle,
}: BudgetInputFormProps) {
  return (
    <div className="flex flex-col gap-8">
      <CategorySlider
        icon={Users}
        label="Number of Travelers"
        value={inputs.travelers}
        min={1}
        max={12}
        onChange={onTravelersChange}
      />

      <CategorySlider
        icon={CalendarDays}
        label="Number of Days"
        value={inputs.days}
        min={1}
        max={30}
        unit=" days"
        onChange={onDaysChange}
      />

      <div className="flex flex-col gap-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Hotel className="h-4 w-4 text-primary" />
          Accommodation
        </Label>
        <ChipGroup
          options={ACCOMMODATION_TYPES}
          selected={inputs.accommodation}
          onSelect={onAccommodationChange}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Car className="h-4 w-4 text-primary" />
          Transport
        </Label>
        <ChipGroup options={TRANSPORT_TYPES} selected={inputs.transport} onSelect={onTransportChange} />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="flex items-center gap-2 text-foreground">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          Food
        </Label>
        <ChipGroup options={FOOD_TYPES} selected={inputs.food} onSelect={onFoodChange} />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Ticket className="h-4 w-4 text-primary" />
          Activities
        </Label>
        <div className="flex flex-col gap-2">
          {ACTIVITY_TYPES.map((activity) => (
            <label
              key={activity}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:border-ocean-300"
            >
              <Checkbox
                checked={inputs.activities.includes(activity)}
                onCheckedChange={() => onActivityToggle(activity)}
              />
              <span className="text-sm">{activity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
