import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ListingCardData {
  id: string;
  title: string;
  rent: number;
  city: string;
  address?: string;
  propertyType: string;
  image: string;
  moveInDate?: string;
  amenities?: string;
  tags?: string[];
}

function parseAmenities(amenities: string | undefined): string[] {
  if (!amenities) return [];
  try {
    const parsed = JSON.parse(amenities);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ListingCard({
  listing,
  isFavourite,
  onFavouriteToggle,
}: {
  listing: ListingCardData;
  isFavourite?: boolean;
  onFavouriteToggle?: (e: React.MouseEvent) => void;
}) {
  const tags = listing.tags ?? parseAmenities(listing.amenities);

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {onFavouriteToggle && (
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavouriteToggle(e);
            }}
            className={`absolute top-3 right-3 rounded-full w-8 h-8 backdrop-blur-sm shadow-sm transition-all ${
              isFavourite
                ? "bg-red-500/90 hover:bg-red-500 text-white opacity-100"
                : "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
          </Button>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground"
          >
            {listing.propertyType}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="font-bold text-lg text-primary shrink-0 ml-2">
            ${listing.rent}
            <span className="text-muted-foreground text-sm font-normal">/mo</span>
          </p>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-primary/70 shrink-0" />
          <span className="line-clamp-1">{listing.city}</span>
        </div>

        {listing.moveInDate && (
          <p className="text-xs text-muted-foreground mb-2">
            Move-in: {new Date(listing.moveInDate).toLocaleDateString()}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
