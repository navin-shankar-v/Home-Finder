import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createListing } from "@/lib/api";

const PROPERTY_TYPES = ["Apartment", "Townhome", "House"];
const AMENITY_OPTIONS = [
  "WiFi",
  "Parking",
  "Laundry",
  "Gym",
  "AC",
  "Furnished",
  "Pet Friendly",
  "Dishwasher",
  "Balcony",
  "Pool",
  "Security",
  "Storage",
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800";

export default function ListARoom() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string>("");

  if (!authLoading && !user) {
    return <Redirect to="/auth" />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value;

    const title = get("title");
    const city = get("city");
    const address = get("address");
    const rent = get("rent");
    const deposit = get("deposit");
    const moveInDate = get("moveInDate");
    const description = get("description");
    const image = get("image") || DEFAULT_IMAGE;
    const houseRules = get("houseRules");
    const contactPreferences = get("contactPreferences");

    if (!title || !city || !address || !rent || !moveInDate || !description || !propertyType) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createListing({
        title,
        city,
        address,
        rent: Number(rent),
        deposit: deposit ? Number(deposit) : undefined,
        moveInDate,
        amenities,
        propertyType,
        image,
        description,
        houseRules: houseRules || undefined,
        contactPreferences: contactPreferences || undefined,
      });
      toast({
        title: "Listing created",
        description: "Your room has been listed successfully.",
      });
      form.reset();
      setAmenities([]);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create listing.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function toggleAmenity(amenity: string) {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-display font-bold mb-2">List a Room</h1>
        <p className="text-muted-foreground mb-8">
          Fill in the details below to list your room. All fields marked with * are required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Sunny room in shared apartment"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" placeholder="Street address" required />
            </div>
            <div className="space-y-4">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" placeholder="e.g. New York, NY" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="rent">Rent (USD/month) *</Label>
              <Input
                id="rent"
                name="rent"
                type="number"
                min={1}
                placeholder="1200"
                required
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="deposit">Deposit (USD)</Label>
              <Input id="deposit" name="deposit" type="number" min={0} placeholder="500" />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="moveInDate">Availability / Move-in Date *</Label>
            <Input id="moveInDate" name="moveInDate" type="date" required />
          </div>

          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-4">
              {AMENITY_OPTIONS.map((a) => (
                <div key={a} className="flex items-center space-x-2">
                  <Checkbox
                    id={a}
                    checked={amenities.includes(a)}
                    onCheckedChange={() => toggleAmenity(a)}
                  />
                  <label htmlFor={a} className="text-sm font-medium leading-none cursor-pointer">
                    {a}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the room, neighborhood, and what you're looking for..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="image">Main Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Paste a link to a photo of the room. Leave blank to use a default image.
            </p>
          </div>

          <div className="space-y-4">
            <Label htmlFor="houseRules">House Rules</Label>
            <Textarea
              id="houseRules"
              name="houseRules"
              placeholder="e.g. No smoking, quiet hours after 10 PM"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="contactPreferences">Contact Preferences</Label>
            <Input
              id="contactPreferences"
              name="contactPreferences"
              placeholder="e.g. Text or email preferred"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Listing"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
