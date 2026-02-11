import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RoommateCard } from "@/components/roommate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoommates, getFavouriteRoommateIds, addFavouriteRoommate, removeFavouriteRoommate, type Roommate } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Search, Filter } from "lucide-react";
import { Link, useSearch, useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";

export default function Roommates() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const params = useMemo(
    () => new URLSearchParams(searchString.startsWith("?") ? searchString.slice(1) : searchString),
    [searchString]
  );
  const cityFromUrl = params.get("city") ?? "";
  const budgetMinFromUrl = params.get("budgetMin");
  const budgetMaxFromUrl = params.get("budgetMax");
  const ageMinFromUrl = params.get("ageMin");
  const ageMaxFromUrl = params.get("ageMax");
  const foodPreferenceFromUrl = params.get("foodPreference") ?? "";
  const smokerFromUrl = params.get("smoker") ?? "";
  const alcoholFromUrl = params.get("alcohol") ?? "";
  const genderFromUrl = params.get("gender") ?? "";
  const sortFromUrl = params.get("sort") || "newest";

  const [city, setCity] = useState(cityFromUrl);
  const [budgetRange, setBudgetRange] = useState<[number, number]>(() => {
    const min = budgetMinFromUrl ? parseInt(budgetMinFromUrl, 10) : 800;
    const max = budgetMaxFromUrl ? parseInt(budgetMaxFromUrl, 10) : 1500;
    if (!isNaN(min) && !isNaN(max) && min <= max) return [min, max];
    return [800, 1500];
  });
  const [ageRange, setAgeRange] = useState<[number, number]>(() => {
    const min = ageMinFromUrl ? parseInt(ageMinFromUrl, 10) : 22;
    const max = ageMaxFromUrl ? parseInt(ageMaxFromUrl, 10) : 35;
    if (!isNaN(min) && !isNaN(max) && min <= max) return [min, max];
    return [22, 35];
  });
  const [foodPreference, setFoodPreference] = useState(foodPreferenceFromUrl || "");
  const [smoker, setSmoker] = useState(smokerFromUrl || "");
  const [alcohol, setAlcohol] = useState(alcoholFromUrl || "");
  const [gender, setGender] = useState(genderFromUrl || "");
  const [sort, setSort] = useState(sortFromUrl);

  useEffect(() => {
    const next = new URLSearchParams();
    if (city) next.set("city", city);
    if (budgetRange[0] !== 800 || budgetRange[1] !== 1500) {
      next.set("budgetMin", String(budgetRange[0]));
      next.set("budgetMax", String(budgetRange[1]));
    }
    if (ageRange[0] !== 22 || ageRange[1] !== 35) {
      next.set("ageMin", String(ageRange[0]));
      next.set("ageMax", String(ageRange[1]));
    }
    if (foodPreference) next.set("foodPreference", foodPreference);
    if (smoker) next.set("smoker", smoker);
    if (alcohol) next.set("alcohol", alcohol);
    if (gender) next.set("gender", gender);
    if (sort !== "newest") next.set("sort", sort);
    const q = next.toString();
    setLocation(`/roommates${q ? `?${q}` : ""}`, { replace: true });
  }, [city, budgetRange, ageRange, foodPreference, smoker, alcohol, gender, sort, setLocation]);

  useEffect(() => {
    setCity(cityFromUrl);
    const bMin = budgetMinFromUrl ? parseInt(budgetMinFromUrl, 10) : 800;
    const bMax = budgetMaxFromUrl ? parseInt(budgetMaxFromUrl, 10) : 1500;
    if (!isNaN(bMin) && !isNaN(bMax) && bMin <= bMax) setBudgetRange([bMin, bMax]);
    const aMin = ageMinFromUrl ? parseInt(ageMinFromUrl, 10) : 22;
    const aMax = ageMaxFromUrl ? parseInt(ageMaxFromUrl, 10) : 35;
    if (!isNaN(aMin) && !isNaN(aMax) && aMin <= aMax) setAgeRange([aMin, aMax]);
    setFoodPreference(foodPreferenceFromUrl);
    setSmoker(smokerFromUrl);
    setAlcohol(alcoholFromUrl);
    setGender(genderFromUrl);
    if (sortFromUrl) setSort(sortFromUrl);
  }, [cityFromUrl, budgetMinFromUrl, budgetMaxFromUrl, ageMinFromUrl, ageMaxFromUrl, foodPreferenceFromUrl, smokerFromUrl, alcoholFromUrl, genderFromUrl, sortFromUrl]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "roommates",
      city || undefined,
      ageRange[0],
      ageRange[1],
      foodPreference || undefined,
      smoker || undefined,
      alcohol || undefined,
      gender || undefined,
    ],
    queryFn: () =>
      getRoommates({
        city: city || undefined,
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        foodPreference: foodPreference || undefined,
        smoker: smoker || undefined,
        alcohol: alcohol || undefined,
        gender: gender || undefined,
      }),
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
      roommates
        .filter(
          (r) => r.budgetMax >= budgetRange[0] && r.budgetMin <= budgetRange[1]
        )
        .sort((a, b) => {
          if (sort === "budget-low") return a.budgetMin - b.budgetMin;
          if (sort === "budget-high") return b.budgetMax - a.budgetMax;
          if (sort === "age-low") return a.age - b.age;
          if (sort === "age-high") return b.age - a.age;
          return 0;
        }),
    [roommates, budgetRange, sort]
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

                <div className="space-y-2">
                  <label className="text-sm font-medium block">Food preference</label>
                  <Select value={foodPreference || "any"} onValueChange={(v) => setFoodPreference(v === "any" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="No preference">No preference</SelectItem>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Omnivore">Omnivore</SelectItem>
                      <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Smoker</label>
                  <Select value={smoker || "any"} onValueChange={(v) => setSmoker(v === "any" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Alcohol</label>
                  <Select value={alcohol || "any"} onValueChange={(v) => setAlcohol(v === "any" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Gender</label>
                  <Select value={gender || "any"} onValueChange={(v) => setGender(v === "any" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => {
                setCity("");
                setBudgetRange([800, 1500]);
                setAgeRange([22, 35]);
                setFoodPreference("");
                setSmoker("");
                setAlcohol("");
                setGender("");
                setSort("newest");
              }}
            >
              Clear filters
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                roommate profiles
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="age-low">Age: Low to High</SelectItem>
                  <SelectItem value="age-high">Age: High to Low</SelectItem>
                </SelectContent>
              </Select>
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
                  <Link key={roommate.id} href={`/roommates/${roommate.id}`}>
                    <a className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                      <RoommateCard
                        roommate={roommate}
                        isFavourite={user ? favouriteRoommateIds.has(roommate.id) : undefined}
                        onFavouriteToggle={
                          user
                            ? (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFavouriteToggle(roommate.id, favouriteRoommateIds.has(roommate.id));
                              }
                            : undefined
                        }
                      />
                    </a>
                  </Link>
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
