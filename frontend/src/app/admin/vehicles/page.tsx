"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vehicle {
  _id: string;
  id: string;
  name: string;
  type: "Car" | "Van" | "SUV" | "Minibus";
  seats: number;
  dailyRateUsd: number;
  description: string;
  images: string[];
}

const TYPES = ["Car", "Van", "SUV", "Minibus"] as const;

const EMPTY_FORM = {
  id: "",
  name: "",
  type: "Car" as Vehicle["type"],
  seats: "",
  dailyRateUsd: "",
  description: "",
  images: [] as string[],
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadVehicles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vehicles");
      if (!res.ok) throw new Error("Failed to load vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(v: Vehicle) {
    setForm({
      id: v.id,
      name: v.name,
      type: v.type,
      seats: String(v.seats),
      dailyRateUsd: String(v.dailyRateUsd),
      description: v.description,
      images: v.images ?? [],
    });
    setEditingId(v._id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleImagesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remainingSlots = 5 - form.images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (file.size > 2 * 1024 * 1024) {
        setError(`${file.name} is larger than 2MB, skipped`);
        continue;
      }
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, images: [...f.images, base64] }));
    }
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      type: form.type,
      seats: Number(form.seats),
      dailyRateUsd: Number(form.dailyRateUsd),
      description: form.description.trim(),
      images: form.images,
    };

    try {
      if (editingId) {
        const res = await fetch("/api/admin/vehicles", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error("Failed to update vehicle");
      } else {
        const res = await fetch("/api/admin/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to create vehicle");
        }
      }
      closeForm();
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(_id: string) {
    const previous = vehicles;
    setVehicles((current) => current.filter((v) => v._id !== _id));

    try {
      const res = await fetch(`/api/admin/vehicles?id=${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete vehicle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setVehicles(previous);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Vehicles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage vehicles available in the Trip Planner. Driver included, free.
          </p>
        </div>
        <Button onClick={openAddForm} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {formOpen && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="id">ID (slug)</Label>
                <Input
                  id="id"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="sedan-car"
                  disabled={!!editingId}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Standard Sedan"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Vehicle["type"] }))}
                  className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  min={1}
                  value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                  placeholder="4"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="dailyRateUsd">Daily Rate (USD)</Label>
                <Input
                  id="dailyRateUsd"
                  type="number"
                  min={0}
                  value={form.dailyRateUsd}
                  onChange={(e) => setForm((f) => ({ ...f, dailyRateUsd: e.target.value }))}
                  placeholder="35"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Comfortable air-conditioned car..."
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="images">Photos (up to 5)</Label>
                <input
                  id="images"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={(e) => handleImagesSelected(e.target.files)}
                  disabled={form.images.length >= 5}
                  className="text-sm text-muted-foreground"
                />
                {form.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Preview ${i + 1}`} className="h-20 w-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Vehicle"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {loading && <p className="text-sm text-muted-foreground">Loading vehicles...</p>}

        {!loading && vehicles.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No vehicles yet. Add one to get started.
          </p>
        )}

        {vehicles.map((v) => (
          <Card key={v._id}>
            <CardContent className="flex items-center gap-4 p-5">
              {v.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.images[0]} alt={v.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-lg bg-muted" />
              )}
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{v.name}</h3>
                    <Badge variant="secondary">{v.type}</Badge>
                    <Badge variant="outline">{v.seats} seats</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">${v.dailyRateUsd}/day · Driver included</p>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(v)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(v._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}