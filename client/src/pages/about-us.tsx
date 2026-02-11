import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Target, Eye, Heart, Shield, Users, Home } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About Roomies
            </h1>
            <p className="text-xl text-muted-foreground">
              We’re building a trusted place for people to find roommates and rooms—safe, reliable, and convenient.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Roomies exists to make shared living simple and stress-free. We connect people looking for a place to live with those who have a room to offer, and we help roommates find each other based on lifestyle, budget, and preferences. Our mission is to reduce the friction and risk often associated with finding housing and roommates, so you can focus on what matters: feeling at home.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 mt-12">
              <Eye className="w-8 h-8 text-primary" />
              Our Vision
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We envision a world where finding a room or a roommate is as straightforward as browsing a trusted, well-organized platform. Everyone deserves access to clear information, respectful communication, and a process that prioritizes safety and compatibility. Roomies aims to be the go-to platform for roommate matching and room rentals—known for reliability, transparency, and a community that values good living situations.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 mt-12">
              <Heart className="w-8 h-8 text-primary" />
              Our Purpose
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We built Roomies to solve real problems: scattered listings, unclear expectations, and the difficulty of finding compatible roommates. Our purpose is to provide a single, dependable place where you can search listings, connect with roommates, and list your own room—with amenities, house rules, and contact preferences in one place. We focus on safe, reliable, and convenient roommate matching and room rentals so that your next move is a step toward a better home.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-10 text-center">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Safe</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize clear listings, verified accounts, and transparent communication so you can make informed decisions.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Home className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Listings include rent, dates, amenities, and rules. What you see is what you get—no hidden surprises.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Convenient</h3>
                <p className="text-sm text-muted-foreground">
                  Search by city and type, filter by budget and lifestyle, and list your room in one place—all designed to save you time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5 border-t border-primary/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ready to find your next home or roommate?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/listings">
                <Button size="lg">Browse Listings</Button>
              </Link>
              <Link href="/roommates">
                <Button size="lg" variant="outline">Find Roommates</Button>
              </Link>
              <Link href="/list-a-room">
                <Button size="lg" variant="secondary">List a Room</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
