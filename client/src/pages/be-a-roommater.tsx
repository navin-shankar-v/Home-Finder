import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createRoommateProfile } from "@/lib/api";

const LIFESTYLE_OPTIONS = [
  "Early Bird",
  "Night Owl",
  "Non-Smoker",
  "Pet Friendly",
  "Yoga",
  "Gamer",
  "Studious",
  "Quiet",
  "Social",
  "Foodie",
  "Traveler",
  "Outdoorsy",
  "Music Lover",
  "Clean",
  "Minimalist",
  "Fitness",
  "Reader",
  "Cooking",
  "Gardening",
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400";

export default function BeARoommater() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [lifestyle, setLifestyle] = useState<string[]>([]);

  if (!authLoading && !user) {
    return <Redirect to="/auth" />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value;

    const name = get("name");
    const age = get("age");
    const occupation = get("occupation");
    const city = get("city");
    const budgetMin = get("budgetMin");
    const budgetMax = get("budgetMax");
    const moveInDate = get("moveInDate");
    const bio = get("bio");
    const profileImage = get("profileImage");

    if (
      !name ||
      !age ||
      !occupation ||
      !city ||
      !budgetMin ||
      !budgetMax ||
      !moveInDate ||
      !bio
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (min > max) {
      toast({
        title: "Invalid budget",
        description: "Min budget cannot be greater than max.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createRoommateProfile({
        name,
        age: Number(age),
        occupation,
        city,
        budgetMin: min,
        budgetMax: max,
        moveInDate,
        lifestylePreferences: lifestyle,
        bio,
        profileImage: profileImage || DEFAULT_IMAGE,
      });
      toast({
        title: "Profile created",
        description: "You're now listed as a potential roommate!",
      });
      form.reset();
      setLifestyle([]);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create profile.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function toggleLifestyle(item: string) {
    setLifestyle((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
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
        <h1 className="text-3xl font-display font-bold mb-2">
          Be a Roommater
        </h1>
        <p className="text-muted-foreground mb-8">
          List yourself as a potential roommate so others can find and connect
          with you. Fill in your details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your display name"
                required
                defaultValue={user?.name}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={18}
                max={99}
                placeholder="25"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="occupation">Occupation *</Label>
            <Input
              id="occupation"
              name="occupation"
              placeholder="e.g. Software Engineer, Student"
              required
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              placeholder="e.g. New York, NY"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="budgetMin">Budget min (USD/month) *</Label>
              <Input
                id="budgetMin"
                name="budgetMin"
                type="number"
                min={0}
                placeholder="800"
                required
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="budgetMax">Budget max (USD/month) *</Label>
              <Input
                id="budgetMax"
                name="budgetMax"
                type="number"
                min={0}
                placeholder="1200"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="moveInDate">Move-in date *</Label>
            <Input id="moveInDate" name="moveInDate" type="date" required />
          </div>

          <div className="space-y-4">
            <Label>Lifestyle & preferences</Label>
            <div className="flex flex-wrap gap-3">
              {LIFESTYLE_OPTIONS.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`life-${item}`}
                    checked={lifestyle.includes(item)}
                    onChange={() => toggleLifestyle(item)}
                    className="rounded border-input"
                  />
                  <label
                    htmlFor={`life-${item}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="bio">Short bio *</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell others about yourself, what you're looking for, and your living habits..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="profileImage">Profile image URL</Label>
            <Input
              id="profileImage"
              name="profileImage"
              type="url"
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Optional. Leave blank to use a default image.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating profile..." : "Create roommate profile"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
