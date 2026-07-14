import { MapPin } from "lucide-react";

/**
 * Static placeholder — swap for an embedded Google Maps iframe or a
 * Mapbox/Leaflet component once an API key is provisioned. Kept dependency
 * -free intentionally so Phase 7 doesn't require a maps API key to build.
 */
export function MapSection() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_30%_30%,theme(colors.ocean.100),theme(colors.forest.50)_60%,theme(colors.sand.50))] sm:h-full sm:min-h-[24rem]">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="font-display font-semibold text-foreground">Colombo, Sri Lanka</p>
        <p className="max-w-[16rem] text-sm text-muted-foreground">
          Map integration coming soon — this placeholder marks our head office location.
        </p>
      </div>
    </div>
  );
}
