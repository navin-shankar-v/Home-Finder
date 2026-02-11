import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, Redirect, useSearch } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function validatePassword(password: string): { ok: boolean; message: string } {
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters" };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { ok: false, message: "Password must contain at least one letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Password must contain at least one number" };
  }
  return { ok: true, message: "" };
}

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = search.startsWith("?") ? search.slice(1) : search;
    const params = new URLSearchParams(query);
    const verified = params.get("verified");
    if (verified === "success") {
      toast({ title: "Email verified", description: "You can now sign in." });
      setLocation("/auth", { replace: true });
    } else if (verified === "invalid" || verified === "error") {
      toast({
        title: "Verification failed",
        description: "The link may be invalid or expired.",
        variant: "destructive",
      });
      setLocation("/auth", { replace: true });
    }
  }, [search]);

  if (user) {
    return <Redirect to="/" />;
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("login-password") as HTMLInputElement).value;
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "You are now signed in." });
      setLocation("/");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message || "Invalid email or password.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("register-name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("register-email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("register-password") as HTMLInputElement).value;
    if (!name || !email || !password) {
      toast({ title: "Error", description: "Please fill in name, email, and password.", variant: "destructive" });
      return;
    }
    const pv = validatePassword(password);
    if (!pv.ok) {
      toast({ title: "Invalid password", description: pv.message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast({
        title: "Account created!",
        description: "Check your email to verify your account. You are signed in.",
      });
      setLocation("/");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Could not create account.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Sign In or Register</h1>
            <p className="text-muted-foreground">Access your account to list rooms and connect with roommates.</p>
          </div>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="login-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="login-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    name="register-name"
                    type="text"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="register-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    name="register-password"
                    type="password"
                    placeholder="Min 8 characters, 1 letter, 1 number"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, one letter, and one number
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
