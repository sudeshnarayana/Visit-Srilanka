"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useItinerary } from "@/hooks/useItinerary";
import { TRIP_PLANNER_STEPS, type TripPlannerStep } from "@/types/itinerary";

import { DestinationSelector } from "./DestinationSelector";
import { DurationSelector } from "./DurationSelector";
import { TravelStyleSelector } from "./TravelStyleSelector";
import { VehicleSelector } from "./VehicleSelector";
import { BudgetSelector } from "./BudgetSelector";
import { ItineraryResult } from "./ItineraryResult";

const STEP_LABELS: Record<TripPlannerStep, string> = {
  destinations: "Choose Destinations",
  duration: "Trip Duration",
  style: "Travel Style",
  vehicle: "Vehicle & Guide",
  budget: "Budget Preference",
  result: "Your Itinerary",
};

const STEP_DESCRIPTIONS: Record<TripPlannerStep, string> = {
  destinations: "Pick one or more places you'd like to visit.",
  duration: "How long is your Sri Lanka trip?",
  style: "What kind of experience are you after?",
  vehicle: "Choose a vehicle — a driver is included, free of charge.",
  budget: "Choose a comfort level to guide cost estimates.",
  result: "Here's a day-by-day plan based on your choices.",
};

export function TripPlannerWizard() {
  const [stepIndex, setStepIndex] = useState(0);

  const {
    selections,
    itinerary,
    toggleDestination,
    setDuration,
    setTravelStyle,
    setVehicle,
    toggleGuide,
    setBudget,
    generate,
    reset,
  } = useItinerary();

  const currentStep = TRIP_PLANNER_STEPS[stepIndex];
  const isResultStep = currentStep === "result";
  const progress = ((stepIndex + 1) / TRIP_PLANNER_STEPS.length) * 100;

  const canAdvance =
    (currentStep === "destinations" &&
      selections.destinations.length > 0) ||
    (currentStep === "duration" &&
      selections.durationBucket !== null) ||
    (currentStep === "style" &&
      selections.travelStyle !== null) ||
    (currentStep === "vehicle" &&
      selections.vehicleId !== null) ||
    (currentStep === "budget" &&
      selections.budget !== null);

  function goNext() {
    if (currentStep === "budget") {
      generate();
      setStepIndex(stepIndex + 1);
      return;
    }

    if (stepIndex < TRIP_PLANNER_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }

  function handleReset() {
    reset();
    setStepIndex(0);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">      {!isResultStep && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {stepIndex + 1} of {TRIP_PLANNER_STEPS.length - 1}
            </span>
            <span className="font-medium text-primary">
              {STEP_LABELS[currentStep]}
            </span>
          </div>

          <Progress value={progress} />
        </div>
      )}

      <div className="flex flex-col gap-2 text-center">
        {!isResultStep && (
          <>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              {STEP_LABELS[currentStep]}
            </h1>

            <p className="text-muted-foreground">
              {STEP_DESCRIPTIONS[currentStep]}
            </p>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep === "destinations" && (
            <DestinationSelector
              selected={selections.destinations}
              onToggle={toggleDestination}
            />
          )}

          {currentStep === "duration" && (
            <DurationSelector
              selected={selections.durationBucket}
              onSelect={setDuration}
            />
          )}

          {currentStep === "style" && (
            <TravelStyleSelector
              selected={selections.travelStyle}
              onSelect={setTravelStyle}
            />
          )}

          {currentStep === "vehicle" && (
            <VehicleSelector
              selected={selections.vehicleId}
              onSelect={setVehicle}
              hasGuide={selections.hasGuide}
              onToggleGuide={toggleGuide}
            />
          )}

          {currentStep === "budget" && (
            <BudgetSelector
              selected={selections.budget}
              onSelect={setBudget}
            />
          )}

          {currentStep === "result" && itinerary && (
            <ItineraryResult
              itinerary={itinerary}
              onReset={handleReset}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {!isResultStep && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={goNext}
            disabled={!canAdvance}
            className="gap-2"
          >
            {currentStep === "budget" ? (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Itinerary
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}