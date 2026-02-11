import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Users, Home, ArrowRight, Shield, MessageCircle, FileCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              How Roomies Works
            </h1>
            <p className="text-xl text-muted-foreground">
              Find your next home or roommate in three simple steps. We make the process safe, transparent, and convenient.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-display font-bold mb-3">1. Search Listings</h2>
                <p className="text-muted-foreground">
                  Browse available rooms by city, property type (Apartment, Townhome, or House), and filters like rent and amenities. Use our search to find places that match your budget and move-in date.
                </p>
                <Link href="/listings">
                  <Button variant="outline" size="sm" className="mt-4">
                    Browse Listings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6 text-secondary">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-display font-bold mb-3">2. Connect with Roommates</h2>
                <p className="text-muted-foreground">
                  View roommate profiles with lifestyle preferences, budget range, and move-in dates. When you find a good match, use the platform to connect and message. We help you find people who fit your lifestyle.
                </p>
                <Link href="/roommates">
                  <Button variant="outline" size="sm" className="mt-4">
                    Find Roommates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <Home className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-display font-bold mb-3">3. List Your Own Room</h2>
                <p className="text-muted-foreground">
                  Have a room to rent? Create an account, then use “List a Room” or “Be a Roommater” to publish your listing. Add details, photos, house rules, and contact preferences. Interested renters can reach out directly.
                </p>
                <Link href="/list-a-room">
                  <Button variant="outline" size="sm" className="mt-4">
                    List a Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold mb-8">Why Use Roomies?</h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              <div className="flex gap-4">
                <Shield className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Safe & Verified</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account and list or search with confidence. We focus on clear listings and transparent communication.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Easy Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact preferences and house rules are listed up front so you know what to expect before reaching out.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <FileCheck className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Complete Listings</h3>
                  <p className="text-sm text-muted-foreground">
                    Every listing includes rent, move-in date, amenities, and description so you can compare options quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
