import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Shield, Heart, Home as HomeIcon } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getListings } from "@/lib/api";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: () => getListings({}),
  });
  const featuredListings = (data?.listings ?? []).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
          <img 
            src="/hero-living-room.png" 
            alt="Living room" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
              #1 Trusted Roommate Finder
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
              Find your <br/>
              <span className="text-primary">perfect place</span> <br/>
              to call home.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg">
              Connect with compatible roommates and find trusted shared living spaces in your favorite neighborhoods.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-xl border border-border/50 max-w-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Where do you want to live?" 
                  className="pl-10 h-12 border-transparent bg-transparent focus-visible:ring-0 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8 rounded-xl font-semibold text-base shadow-lg shadow-primary/20">
                Search Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-display font-bold text-primary mb-1">50k+</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-primary mb-1">100k+</p>
              <p className="text-sm text-muted-foreground">Happy Roommates</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-primary mb-1">120+</p>
              <p className="text-sm text-muted-foreground">Cities Covered</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-primary mb-1">4.9/5</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Fresh on the Market</h2>
              <p className="text-muted-foreground">The latest listings you shouldn't miss</p>
            </div>
            <Link href="/listings">
              <Button variant="ghost" className="group">
                View All Listings
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Features/Value Prop */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why Choose Roomies?</h2>
            <p className="text-muted-foreground">We make the process of finding shared housing safe, simple, and transparent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
              <p className="text-muted-foreground">Every user is verified to ensure safety and trust within our community.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Perfect Matches</h3>
              <p className="text-muted-foreground">Our matching algorithm helps you find roommates with compatible lifestyles.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6 text-primary">
                <HomeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-muted-foreground">Secure your room instantly with our safe and easy booking system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to find your new home?</h2>
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of happy roommates finding their perfect match every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/listings">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold rounded-xl">
                    Start Searching
                  </Button>
                </Link>
                <Link href="/list-a-room">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-xl bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
                    Post a Room
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
