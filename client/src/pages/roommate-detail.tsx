import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoommate, getFavouriteRoommateIds, addFavouriteRoommate, removeFavouriteRoommate, type Roommate } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Heart, Calendar, Briefcase, DollarSign } from "lucide-react";
import { useMemo } from "react";

import { parseLifestyle } from "@/components/roommate-card";

export default function RoommateDetail({ params }: { params: { id?: string } }) {
  const id = params?.id;
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: roommate, isLoading, error } = useQuery({
    queryKey: ["roommate", id],
    queryFn: () => getRoommate(id!),
    enabled: !!id,
  });

  const { data: favIdsData } = useQuery({
    queryKey: ["me", "favourites", "roommates", "ids"],
    queryFn: getFavouriteRoommateIds,
    enabled: !!user,
  });
  const isFavourite = useMemo(
    () => (id && favIdsData?.ids ? favIdsData.ids.includes(id) : false),
    [id, favIdsData?.ids]
  );

  const toggleFavMutation = useMutation({
    mutationFn: async () => {
      if (isFavourite) await removeFavouriteRoommate(id!);
      else await addFavouriteRoommate(id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates", "ids"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates"] });
    },
  });

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Invalid profile.</p>
          <Link href="/roommates"><Button variant="link">Back to roommates</Button></Link>
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
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
            <div className="flex justify-center"><div className="w-32 h-32 rounded-full bg-muted/50 animate-pulse" /></div>
            <div className="h-24 bg-muted/50 rounded animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !roommate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Profile not found.</p>
          <Link href="/roommates"><Button>Back to roommates</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const lifestyle = parseLifestyle(roommate.lifestylePreferences);
  const { tags: lifestyleTags } = lifestyle;
  const budgetLabel =
    roommate.budgetMin === roommate.budgetMax
      ? `$${roommate.budgetMin}/mo`
      : `$${roommate.budgetMin}–$${roommate.budgetMax}/mo`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/roommates">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to roommates
            </Button>
          </Link>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-8 flex flex-col items-center text-center relative">
              {user && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => toggleFavMutation.mutate()}
                  disabled={toggleFavMutation.isPending}
                  className={`absolute top-4 right-4 rounded-full w-10 h-10 ${
                    isFavourite ? "bg-red-500 hover:bg-red-600 text-white" : "bg-background/80"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavourite ? "fill-current" : ""}`} />
                </Button>
              )}
              <Avatar className="w-28 h-28 border-4 border-background shadow-lg mb-4">
                <AvatarImage src={roommate.profileImage} alt={roommate.name} className="object-cover" />
                <AvatarFallback className="text-xl">{roommate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {roommate.name}, {roommate.age}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                <Briefcase className="h-4 w-4" />
                {roommate.occupation}
              </p>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                {roommate.city}
              </p>
              <p className="font-semibold text-primary mt-2">{budgetLabel}</p>
              {roommate.moveInDate && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Move-in: {new Date(roommate.moveInDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold mb-2">About</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {roommate.bio}
              </p>

              {(lifestyleTags.length > 0 ||
                lifestyle.foodPreference ||
                lifestyle.smoker ||
                lifestyle.alcohol ||
                lifestyle.gender ||
                lifestyle.overnightGuests ||
                lifestyle.partyHabits ||
                lifestyle.sleepSchedule ||
                lifestyle.workSchedule) && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Lifestyle & preferences</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {lifestyle.foodPreference && (
                      <p><span className="font-medium text-foreground">Food:</span> {lifestyle.foodPreference}</p>
                    )}
                    {lifestyle.smoker && (
                      <p><span className="font-medium text-foreground">Smoker:</span> {lifestyle.smoker}</p>
                    )}
                    {lifestyle.alcohol && (
                      <p><span className="font-medium text-foreground">Alcohol:</span> {lifestyle.alcohol === "Yes" ? "Drinker" : "Non-drinker"}</p>
                    )}
                    {lifestyle.gender && (
                      <p><span className="font-medium text-foreground">Gender:</span> {lifestyle.gender}</p>
                    )}
                    {lifestyle.overnightGuests && (
                      <p><span className="font-medium text-foreground">Overnight guests:</span> {lifestyle.overnightGuests}</p>
                    )}
                    {lifestyle.partyHabits && (
                      <p><span className="font-medium text-foreground">Party habits:</span> {lifestyle.partyHabits}</p>
                    )}
                    {lifestyle.sleepSchedule && (
                      <p><span className="font-medium text-foreground">Get up / go to bed:</span> {lifestyle.sleepSchedule}</p>
                    )}
                    {lifestyle.workSchedule && (
                      <p><span className="font-medium text-foreground">Work schedule:</span> {lifestyle.workSchedule}</p>
                    )}
                  </div>
                  {lifestyleTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {lifestyleTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <Button size="lg" className="w-full rounded-full">
                  Connect with {roommate.name.split(" ")[0]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
