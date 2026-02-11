import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RoommateCard } from "@/components/roommate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoommates, getFavouriteRoommateIds, addFavouriteRoommate, removeFavouriteRoommate, type Roommate } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function Roommates() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [city, setCity] = useState("");
  const [budgetRange, setBudgetRange] = useState<[number, number]>([800, 1500]);
  const [ageRange, setAgeRange] = useState<[number, number]>([22, 35]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["roommates", city || undefined],
    queryFn: () => getRoommates({ city: city || undefined }),
  });

  const { data: favIdsData } = useQuery({
    queryKey: ["me", "favourites", "roommates", "ids"],
    queryFn: getFavouriteRoommateIds,
    enabled: !!user,
  });
  const favouriteRoommateIds = useMemo(() => new Set(favIdsData?.ids ?? []), [favIdsData?.ids]);

  const addFavMutation = useMutation({
    mutationFn: addFavouriteRoommate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates"] });
    },
  });
  const removeFavMutation = useMutation({
    mutationFn: removeFavouriteRoommate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates"] });
    },
  });

  function handleFavouriteToggle(roommateId: string, isFav: boolean) {
    if (isFav) removeFavMutation.mutate(roommateId);
    else addFavMutation.mutate(roommateId);
  }

  const roommates: Roommate[] = data?.roommates ?? [];
  const filtered = useMemo(
    () =>
      roommates.filter(
        (r) =>
          r.budgetMax >= budgetRange[0] &&
          r.budgetMin <= budgetRange[1] &&
          r.age >= ageRange[0] &&
          r.age <= ageRange[1]
      ),
    [roommates, budgetRange, ageRange]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Find Your Perfect Roommate
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with people who share your lifestyle, interests, and living
            habits.
          </p>

          <div className="max-w-xl mx-auto bg-white p-2 rounded-xl shadow-lg border border-border flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city..."
                className="pl-9 border-none shadow-none focus-visible:ring-0"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-display font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Preferences
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Budget (Monthly)
                  </label>
                  <Slider
                    value={budgetRange}
                    onValueChange={(v) => setBudgetRange(v as [number, number])}
                    max={3000}
                    step={100}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${budgetRange[0]}</span>
                    <span>${budgetRange[1]}+</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Age Range</label>
                  <Slider
                    value={ageRange}
                    onValueChange={(v) => setAgeRange(v as [number, number])}
                    max={50}
                    min={18}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ageRange[0]}</span>
                    <span>{ageRange[1]}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              roommate profiles
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-xl bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive">Failed to load roommates.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((roommate) => (
                  <RoommateCard
                    key={roommate.id}
                    roommate={roommate}
                    isFavourite={user ? favouriteRoommateIds.has(roommate.id) : undefined}
                    onFavouriteToggle={
                      user
                        ? () => handleFavouriteToggle(roommate.id, favouriteRoommateIds.has(roommate.id))
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
