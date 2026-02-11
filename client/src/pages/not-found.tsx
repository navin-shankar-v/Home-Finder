import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-primary/5 p-8 rounded-full mb-8">
          <Search className="w-16 h-16 text-primary" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page not found</h2>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="flex gap-4">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/listings">
            <Button size="lg" variant="outline" className="gap-2">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
