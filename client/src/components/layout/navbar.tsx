import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">R</span>
            Roomies
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/listings">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/listings' ? 'text-primary' : 'text-muted-foreground'}`}>
              Find a Place
            </a>
          </Link>
          <Link href="/roommates">
            <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Find Roommates
            </a>
          </Link>
          <Link href="/how-it-works">
            <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              How it Works
            </a>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden md:flex border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
            List a Room
          </Button>
          <Button className="rounded-full px-6">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
