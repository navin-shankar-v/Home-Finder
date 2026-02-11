import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { setAuthGetToken } from "@/lib/api";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Listings from "@/pages/listings";
import ListingDetail from "@/pages/listing-detail";
import Roommates from "@/pages/roommates";
import RoommateDetail from "@/pages/roommate-detail";
import AuthPage from "@/pages/auth";
import ListARoom from "@/pages/list-a-room";
import BeARoommater from "@/pages/be-a-roommater";
import Dashboard from "@/pages/dashboard";
import HowItWorks from "@/pages/how-it-works";
import AboutUs from "@/pages/about-us";

function ClerkApiBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthGetToken(() => getToken());
  }, [getToken]);
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings/:id" component={ListingDetail} />
      <Route path="/listings" component={Listings} />
      <Route path="/roommates/:id" component={RoommateDetail} />
      <Route path="/roommates" component={Roommates} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/list-a-room" component={ListARoom} />
      <Route path="/be-a-roommater" component={BeARoommater} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about" component={AboutUs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkApiBridge>
        <Toaster />
        <Router />
      </ClerkApiBridge>
    </QueryClientProvider>
  );
}

export default App;
