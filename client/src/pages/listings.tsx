import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ListingCard } from "@/components/listing-card";
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
import { getListings, getFavouriteListingIds, addFavouriteListing, removeFavouriteListing, type Listing } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Search, SlidersHorizontal, Map } from "lucide-react";
import { useSearch } from "wouter";
import { useMemo, useState } from "react";

export default function Listings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const propertyTypeFromUrl = params.get("propertyType") || undefined;
  const cityFromUrl = params.get("city") || undefined;

  const [propertyType, setPropertyType] = useState<string | undefined>(
    propertyTypeFromUrl
  );
  const [city, setCity] = useState(cityFromUrl || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 2000]);
  const [sort, setSort] = useState("newest");

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", propertyType, city || undefined],
    queryFn: () => getListings({ propertyType, city: city || undefined }),
  });

  const { data: favIdsData } = useQuery({
    queryKey: ["me", "favourites", "listings", "ids"],
    queryFn: getFavouriteListingIds,
    enabled: !!user,
  });
  const favouriteListingIds = useMemo(() => new Set(favIdsData?.ids ?? []), [favIdsData?.ids]);

  const addFavMutation = useMutation({
    mutationFn: addFavouriteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings"] });
    },
  });
  const removeFavMutation = useMutation({
    mutationFn: removeFavouriteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings"] });
    },
  });

  function handleFavouriteToggle(listingId: string, isFav: boolean) {
    if (isFav) removeFavMutation.mutate(listingId);
    else addFavMutation.mutate(listingId);
  }

  const listings: Listing[] = data?.listings ?? [];
  const filtered = useMemo(() =>    listings
      .filter((l) => l.rent >= priceRange[0] && l.rent <= priceRange[1])
      .sort((a, b) => {
        if (sort === "price-low") return a.rent - b.rent;
        if (sort === "price-high") return b.rent - a.rent;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [listings, priceRange, sort]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>

              <div className="space-y-4 mb-6">
                <label className="text-sm font-medium">Price Range</label>
                <Slider
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  max={5000}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium">Property Type</label>
                <div className="space-y-2">
                  {["Apartment", "Townhome", "House"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={propertyType === type}
                        onCheckedChange={(checked) =>
                          setPropertyType(checked ? type : undefined)
                        }
                      />
                      <label
                        htmlFor={type}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setPropertyType(undefined);
                setCity("");
                setPriceRange([500, 2000]);
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city..."
                  className="pl-9 w-full md:max-w-md"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4 text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              results
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-xl bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive">Failed to load listings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isFavourite={user ? favouriteListingIds.has(listing.id) : undefined}
                    onFavouriteToggle={
                      user
                        ? () => handleFavouriteToggle(listing.id, favouriteListingIds.has(listing.id))
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {filtered.length > 0 && filtered.length >= 12 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg" className="w-full md:w-auto">
                  Load More Listings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
