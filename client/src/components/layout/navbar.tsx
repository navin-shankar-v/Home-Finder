import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const isListings = location.startsWith("/listings");
  const navLink = (path: string, label: string, isActive?: boolean) => (
    <Link href={path}>
      <a
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </a>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">
              R
            </span>
            Roomies
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLink("/listings", "Find a Place", isListings)}
          {navLink("/listings?propertyType=Apartment", "Apartments", location.includes("propertyType=Apartment"))}
          {navLink("/listings?propertyType=Townhome", "Townhome", location.includes("propertyType=Townhome"))}
          {navLink("/listings?propertyType=House", "House", location.includes("propertyType=House"))}
          {navLink("/roommates", "Find Roommates", location === "/roommates")}
          {navLink("/how-it-works", "How it Works", location === "/how-it-works")}
          <SignedIn>
            <Link href="/list-a-room">
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                List a Room
              </a>
            </Link>
            <Link href="/be-a-roommater">
              <Button
                variant="default"
                size="sm"
                className="rounded-full gap-1.5 bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4" />
                Be a Roommater
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/list-a-room">
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                List a Room
              </a>
            </Link>
            <Link href="/be-a-roommater">
              <Button
                variant="default"
                size="sm"
                className="rounded-full gap-1.5 bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4" />
                Be a Roommater
              </Button>
            </Link>
          </SignedOut>
        </div>

        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="rounded-full px-5">
                Register
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
