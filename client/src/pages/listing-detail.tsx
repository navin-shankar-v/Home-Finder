import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListing, getFavouriteListingIds, addFavouriteListing, removeFavouriteListing, type Listing } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Heart, Calendar, DollarSign } from "lucide-react";
import { useMemo } from "react";

function parseAmenities(amenities: string | undefined): string[] {
  if (!amenities) return [];
  try {
    const parsed = JSON.parse(amenities);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ListingDetail({ params }: { params: { id?: string } }) {
  const id = params?.id;
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id!),
    enabled: !!id,
  });

  const { data: favIdsData } = useQuery({
    queryKey: ["me", "favourites", "listings", "ids"],
    queryFn: getFavouriteListingIds,
    enabled: !!user,
  });
  const isFavourite = useMemo(
    () => (id && favIdsData?.ids ? favIdsData.ids.includes(id) : false),
    [id, favIdsData?.ids]
  );

  const toggleFavMutation = useMutation({
    mutationFn: async () => {
      if (isFavourite) await removeFavouriteListing(id!);
      else await addFavouriteListing(id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings"] });
    },
  });

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Invalid listing.</p>
          <Link href="/listings"><Button variant="link">Back to listings</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
            <div className="aspect-[16/9] bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-24 bg-muted/50 rounded animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Listing not found.</p>
          <Link href="/listings"><Button>Back to listings</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const amenities = parseAmenities(listing.amenities);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/listings">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to listings
            </Button>
          </Link>

          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-muted">
              <img
                src={listing.image}
                alt={listing.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-white/90 backdrop-blur-sm text-foreground">
                  {listing.propertyType}
                </Badge>
              </div>
              {user && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => toggleFavMutation.mutate()}
                  disabled={toggleFavMutation.isPending}
                  className={`absolute top-4 right-4 rounded-full w-10 h-10 backdrop-blur-sm ${
                    isFavourite ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white text-muted-foreground"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavourite ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {listing.title}
                </h1>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-2xl text-primary">${listing.rent}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  {listing.city}
                  {listing.address && ` · ${listing.address}`}
                </span>
                {listing.moveInDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Move-in: {new Date(listing.moveInDate).toLocaleDateString()}
                  </span>
                )}
                {listing.deposit != null && listing.deposit > 0 && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Deposit: ${listing.deposit}
                  </span>
                )}
              </div>

              {amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <Badge key={a} variant="secondary">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
              </div>

              {listing.houseRules && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">House rules</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{listing.houseRules}</p>
                </div>
              )}

              {listing.contactPreferences && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold mb-2">Contact</h3>
                  <p className="text-muted-foreground">{listing.contactPreferences}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
