import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ListingCard } from "@/components/listing-card";
import { RoommateCard } from "@/components/roommate-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";
import { Redirect, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyListings,
  getMyRoommate,
  getFavouriteListings,
  getFavouriteRoommates,
  deleteListing,
  deleteRoommate,
  removeFavouriteListing,
  removeFavouriteRoommate,
  type Listing,
  type Roommate,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Heart, Home, User, HeartOff } from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myListingsData } = useQuery({
    queryKey: ["me", "listings"],
    queryFn: getMyListings,
    enabled: !!user,
  });
  const { data: myRoommateData } = useQuery({
    queryKey: ["me", "roommate"],
    queryFn: getMyRoommate,
    enabled: !!user,
  });
  const { data: favListingsData } = useQuery({
    queryKey: ["me", "favourites", "listings"],
    queryFn: getFavouriteListings,
    enabled: !!user,
  });
  const { data: favRoommatesData } = useQuery({
    queryKey: ["me", "favourites", "roommates"],
    queryFn: getFavouriteRoommates,
    enabled: !!user,
  });

  const deleteListingMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "listings"] });
      toast({ title: "Listing deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const deleteRoommateMutation = useMutation({
    mutationFn: deleteRoommate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "roommate"] });
      toast({ title: "Roommate profile deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const removeFavListingMutation = useMutation({
    mutationFn: removeFavouriteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "listings", "ids"] });
      toast({ title: "Removed from favourites" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const removeFavRoommateMutation = useMutation({
    mutationFn: removeFavouriteRoommate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates"] });
      queryClient.invalidateQueries({ queryKey: ["me", "favourites", "roommates", "ids"] });
      toast({ title: "Removed from favourites" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoaded && !user) {
    return <Redirect to="/auth" />;
  }

  const myListings = myListingsData?.listings ?? [];
  const myRoommate = myRoommateData?.roommate ?? null;
  const favListings = favListingsData?.listings ?? [];
  const favRoommates = favRoommatesData?.roommates ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Manage your room listings, roommate profile, and favourites.
        </p>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="listings" className="gap-2">
              <Home className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="roommate" className="gap-2">
              <User className="h-4 w-4" />
              My Roommate Profile
            </TabsTrigger>
            <TabsTrigger value="fav-listings" className="gap-2">
              <Heart className="h-4 w-4" />
              Favourite Listings
            </TabsTrigger>
            <TabsTrigger value="fav-roommates" className="gap-2">
              <Heart className="h-4 w-4" />
              Favourite Roommates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My room listings</h2>
              <Link href="/list-a-room">
                <Button size="sm">List a new room</Button>
              </Link>
            </div>
            {myListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <p className="text-muted-foreground mb-4">You haven&apos;t listed any rooms yet.</p>
                <Link href="/list-a-room">
                  <Button>List a room</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing: Listing) => (
                  <div key={listing.id} className="space-y-2">
                    <ListingCard listing={listing} />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Delete this listing?")) deleteListingMutation.mutate(listing.id);
                        }}
                        disabled={deleteListingMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roommate" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My roommate profile</h2>
              {!myRoommate && (
                <Link href="/be-a-roommater">
                  <Button size="sm">Be a Roommater</Button>
                </Link>
              )}
            </div>
            {!myRoommate ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have a roommate profile. Create one so others can find you.
                </p>
                <Link href="/be-a-roommater">
                  <Button>Create roommate profile</Button>
                </Link>
              </div>
            ) : (
              <div className="max-w-md space-y-4">
                <RoommateCard roommate={myRoommate} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm("Delete your roommate profile? You can create a new one later.")) {
                      deleteRoommateMutation.mutate(myRoommate.id);
                    }
                  }}
                  disabled={deleteRoommateMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete profile
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fav-listings" className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Favourite room listings</h2>
            {favListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <p className="text-muted-foreground mb-4">No favourite listings yet.</p>
                <Link href="/listings">
                  <Button>Browse listings</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favListings.map((listing: Listing) => (
                  <div key={listing.id} className="space-y-2">
                    <ListingCard listing={listing} />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => removeFavListingMutation.mutate(listing.id)}
                        disabled={removeFavListingMutation.isPending}
                      >
                        <HeartOff className="h-4 w-4 mr-1" />
                        Remove from favourites
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fav-roommates" className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Favourite roommate profiles</h2>
            {favRoommates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <p className="text-muted-foreground mb-4">No favourite roommates yet.</p>
                <Link href="/roommates">
                  <Button>Find roommates</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favRoommates.map((roommate: Roommate) => (
                  <div key={roommate.id} className="space-y-2">
                    <RoommateCard roommate={roommate} />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => removeFavRoommateMutation.mutate(roommate.id)}
                        disabled={removeFavRoommateMutation.isPending}
                      >
                        <HeartOff className="h-4 w-4 mr-1" />
                        Remove from favourites
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
