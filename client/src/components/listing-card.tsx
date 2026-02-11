import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MapPin, Users, BedDouble, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingProps {
  listing: {
    id: number;
    title: string;
    price: number;
    location: string;
    type: string;
    image: string;
    beds: number;
    baths: number;
    roommates: number;
    isNew?: boolean;
    tags: string[];
  };
}

export function ListingCard({ listing }: ListingProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute top-3 right-3 rounded-full w-8 h-8 bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <Heart className="w-4 h-4" />
        </Button>
        {listing.isNew && (
          <Badge className="absolute top-3 left-3 bg-primary text-white border-none shadow-sm">
            New
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground">
            {listing.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="font-bold text-lg text-primary">
            ${listing.price}<span className="text-muted-foreground text-sm font-normal">/mo</span>
          </p>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-primary/70" />
          {listing.location}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{listing.beds} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{listing.baths} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{listing.roommates} Roommates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
