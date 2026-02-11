import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, PlusCircle } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

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
          <Link href={user ? "/list-a-room" : "/auth"}>
            <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              List a Room
            </a>
          </Link>
          <Link href={user ? "/be-a-roommater" : "/auth"}>
            <Button
              variant="default"
              size="sm"
              className="rounded-full gap-1.5 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" />
              Be a Roommater
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 text-sm font-medium truncate">
                  {user.name}
                </div>
                <div className="px-2 py-1 text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <a className="cursor-pointer block outline-none">Dashboard</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="rounded-full px-5">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
