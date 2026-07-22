"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface MapDestination {
  name: string;
  latitude: number;
  longitude: number;
}

interface DestinationsMapProps {
  destinations: MapDestination[];
  selectedNames: string[];
}

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const SRI_LANKA_BOUNDS: L.LatLngBoundsExpression = [
  [5.5, 79.3],
  [10.0, 82.0],
];

export function DestinationsMap({ destinations, selectedNames }: DestinationsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: 8,
      minZoom: 7,
      maxBounds: SRI_LANKA_BOUNDS,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const withCoords = destinations.filter(
      (d) => typeof d.latitude === "number" && typeof d.longitude === "number"
    );

    withCoords.forEach((dest) => {
      const isSelected = selectedNames.includes(dest.name);
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: ${isSelected ? "16px" : "10px"};
          height: ${isSelected ? "16px" : "10px"};
          border-radius: 50%;
          background: ${isSelected ? "#0A6E8C" : "#94a3b8"};
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [isSelected ? 16 : 10, isSelected ? 16 : 10],
        iconAnchor: [isSelected ? 8 : 5, isSelected ? 8 : 5],
      });

      const marker = L.marker([dest.latitude, dest.longitude], { icon })
        .addTo(map)
        .bindTooltip(dest.name, { direction: "top", offset: [0, -8] });

      markersRef.current.push(marker);
    });
  }, [destinations, selectedNames]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const points = selectedNames
      .map((name) => destinations.find((d) => d.name === name))
      .filter(
        (d): d is MapDestination =>
          !!d && typeof d.latitude === "number" && typeof d.longitude === "number"
      );

    if (points.length < 2) {
      setRouteInfo(null);
      return;
    }

    const coordsParam = points.map((p) => `${p.longitude},${p.latitude}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;

    let cancelled = false;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const route = data?.routes?.[0];
        const coords = route?.geometry?.coordinates;
        if (!Array.isArray(coords)) {
          setRouteInfo(null);
          return;
        }

        const latLngs: [number, number][] = coords.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        const line = L.polyline(latLngs, { color: "#0A6E8C", weight: 4, opacity: 0.8 }).addTo(map);
        routeLineRef.current = line;
        map.fitBounds(line.getBounds(), { padding: [40, 40] });

        if (typeof route.distance === "number" && typeof route.duration === "number") {
          setRouteInfo({
            distanceKm: Math.round(route.distance / 1000),
            durationMin: Math.round(route.duration / 60),
          });
        }
      })
      .catch(() => {
        setRouteInfo(null);
      });

    return () => {
      cancelled = true;
    };
  }, [destinations, selectedNames]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="h-[32rem] w-full rounded-xl border border-border" />
      {routeInfo && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-ocean-50 px-4 py-3 text-sm">
          <span className="font-display text-base font-semibold text-primary">
            {routeInfo.distanceKm} km
          </span>
          <span className="text-muted-foreground">route distance</span>
          <span className="text-primary/40">·</span>
          <span className="font-display text-base font-semibold text-primary">
            {routeInfo.durationMin >= 60
              ? `${Math.floor(routeInfo.durationMin / 60)}h ${routeInfo.durationMin % 60}m`
              : `${routeInfo.durationMin}m`}
          </span>
          <span className="text-muted-foreground">est. drive time</span>
        </div>
      )}
    </div>
  );
}