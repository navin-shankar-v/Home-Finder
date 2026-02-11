import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Heart } from "lucide-react";

export interface RoommateCardData {
  id: string;
  name: string;
  age: number;
  occupation: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate?: string;
  lifestylePreferences?: string;
  bio: string;
  profileImage: string;
}

function parseLifestyle(prefs: string | undefined): string[] {
  if (!prefs) return [];
  try {
    const parsed = JSON.parse(prefs);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function RoommateCard({
  roommate,
  isFavourite,
  onFavouriteToggle,
}: {
  roommate: RoommateCardData;
  isFavourite?: boolean;
  onFavouriteToggle?: (e: React.MouseEvent) => void;
}) {
  const tags = parseLifestyle(roommate.lifestylePreferences);
  const budgetLabel =
    roommate.budgetMin === roommate.budgetMax
      ? `$${roommate.budgetMin}`
      : `$${roommate.budgetMin}-$${roommate.budgetMax}`;

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer h-full flex flex-col bg-card relative">
      {onFavouriteToggle && (
        <Button
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavouriteToggle(e);
          }}
          className={`absolute top-3 right-3 z-10 rounded-full w-8 h-8 backdrop-blur-sm shadow-sm ${
            isFavourite
              ? "bg-red-500/90 hover:bg-red-500 text-white"
              : "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
        </Button>
      )}
      <div className="p-6 pb-2 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={roommate.profileImage}
              alt={roommate.name}
              className="object-cover"
            />
            <AvatarFallback>
              {roommate.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <h3 className="font-display font-bold text-lg text-foreground">
          {roommate.name}, {roommate.age}
        </h3>

        <div className="flex items-center text-muted-foreground text-sm mt-1 mb-3">
          <Briefcase className="w-3 h-3 mr-1" />
          {roommate.occupation}
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-4 bg-muted/50 px-3 py-1 rounded-full">
          <MapPin className="w-3 h-3 mr-1 text-primary" />
          {roommate.city}
        </div>

        {roommate.moveInDate && (
          <p className="text-xs text-muted-foreground mb-2">
            Move-in: {new Date(roommate.moveInDate).toLocaleDateString()}
          </p>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed px-2">
          &quot;{roommate.bio}&quot;
        </p>
      </div>

      <div className="mt-auto px-6 pb-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-1 rounded-md bg-secondary/10 text-secondary-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <CardFooter className="p-4 pt-0 mt-auto border-t border-border/50 bg-muted/20">
        <div className="w-full flex justify-between items-center py-2">
          <div className="text-sm font-semibold text-primary">
            {budgetLabel}
            <span className="text-muted-foreground font-normal">/mo</span>
          </div>
          <Button
            size="sm"
            className="rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
