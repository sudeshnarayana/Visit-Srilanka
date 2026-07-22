"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Destination {
  _id: string;
  id: string;
  name: string;
  region: string;
  category: "Heritage" | "Wildlife" | "Beach" | "Mountains";
  description: string;
  activities: string[];
  imageUrl?: string;
}

const CATEGORIES = ["Heritage", "Wildlife", "Beach", "Mountains"] as const;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Unable to read file"));
      }
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("File read error"));
    };
    reader.readAsDataURL(file);
  });
}

const EMPTY_FORM = {
  id: "",
  name: "",
  region: "",
  category: "Heritage" as Destination["category"],
  description: "",
  activities: "",
  imageUrl: "" as string,
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // _id when editing
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadDestinations() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/destinations");
      if (!res.ok) throw new Error("Failed to load destinations");
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(dest: Destination) {
    setForm({
      id: dest.id,
      name: dest.name,
      region: dest.region,
      category: dest.category,
      description: dest.description,
      activities: dest.activities.join(", "),
       imageUrl: dest.imageUrl ?? "",
    });
    setEditingId(dest._id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      region: form.region.trim(),
      category: form.category,
      description: form.description.trim(),
      activities: form.activities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
        imageUrl: form.imageUrl || null,
    };

    try {
      if (editingId) {
        const res = await fetch("/api/admin/destinations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error("Failed to update destination");
      } else {
        const res = await fetch("/api/admin/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to create destination");
        }
      }
      closeForm();
      await loadDestinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(_id: string) {
    const previous = destinations;
    setDestinations((current) => current.filter((d) => d._id !== _id));

    try {
      const res = await fetch(`/api/admin/destinations?id=${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete destination");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDestinations(previous);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Destinations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the places shown in the Trip Planner.
          </p>
        </div>
        <Button onClick={openAddForm} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Destination
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
                {editingId ? "Edit Destination" : "Add Destination"}
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
                  placeholder="sigiriya"
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
                  placeholder="Sigiriya"
                  required
                />
              </div>

              

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  placeholder="Central Province"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
  <Label htmlFor="image">Photo</Label>
  <input
    id="image"
    type="file"
    accept="image/png, image/jpeg"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be smaller than 2MB");
        return;
      }
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, imageUrl: base64 }));
    }}
    className="text-sm text-muted-foreground"
  />
  {form.imageUrl && (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={form.imageUrl}
      alt="Preview"
      className="mt-2 h-32 w-full rounded-lg object-cover"
    />
  )}
</div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as Destination["category"] }))
                  }
                  className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Ancient rock fortress rising above the central plains."
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="activities">Activities (comma-separated)</Label>
                <Input
                  id="activities"
                  value={form.activities}
                  onChange={(e) => setForm((f) => ({ ...f, activities: e.target.value }))}
                  placeholder="Visit Lion Rock, Village tour, Sigiriya Museum"
                />
              </div>

              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Destination"}
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
        {loading && <p className="text-sm text-muted-foreground">Loading destinations...</p>}

        {!loading && destinations.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No destinations yet. Add one to get started.
          </p>
        )}

        {destinations.map((dest) => (
          <Card key={dest._id}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold">{dest.name}</h3>
                  <Badge variant="secondary">{dest.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{dest.region}</p>
                <p className="text-sm text-muted-foreground">{dest.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEditForm(dest)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(dest._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    
  );
}