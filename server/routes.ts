/// <reference path="./session.d.ts" />
import type { Express, Request, Response } from "express";
import type { Server } from "http";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { sendVerificationEmail } from "./email";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

function validatePassword(password: string): { ok: boolean; message?: string } {
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters" };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { ok: false, message: "Password must contain at least one letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Password must contain at least one number" };
  }
  return { ok: true };
}

export async function registerRoutes(
  _httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth: Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({
          message: "Name, email, and password are required",
        });
        return;
      }
      const pv = validatePassword(password);
      if (!pv.ok) {
        res.status(400).json({ message: pv.message });
        return;
      }
      const verificationToken = randomBytes(32).toString("hex");
      const user = await storage.createUser({
        name,
        email,
        password,
        emailVerified: "false",
        verificationToken,
      });
      await sendVerificationEmail(email, verificationToken);
      req.session!.userId = user.id;
      res.status(201).json({
        user: { id: user.id, name: user.name, email: user.email },
        message: "Check your email to verify your account.",
      });
    } catch (e: any) {
      if (e.message === "EMAIL_IN_USE") {
        res.status(409).json({ message: "Email already registered" });
        return;
      }
      throw e;
    }
  });

  // Auth: Verify email (GET so user can click link in email)
  app.get("/api/auth/verify-email", async (req: Request, res: Response) => {
    const token = req.query.token as string | undefined;
    if (!token) {
      res.redirect(`${BASE_URL}/auth?verified=error`);
      return;
    }
    const user = await storage.getUserByVerificationToken(token);
    if (!user) {
      res.redirect(`${BASE_URL}/auth?verified=invalid`);
      return;
    }
    await storage.setUserEmailVerified(user.id);
    res.redirect(`${BASE_URL}/auth?verified=success`);
  });

  // Auth: Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    const user = await storage.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    req.session!.userId = user.id;
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  });

  // Auth: Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session = null as any;
    res.json({ ok: true });
  });

  // Auth: Me
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      res.status(200).json({ user: null });
      return;
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session = null as any;
      res.status(200).json({ user: null });
      return;
    }
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  });

  // Listings: list
  app.get("/api/listings", async (req: Request, res: Response) => {
    const city = req.query.city as string | undefined;
    const propertyType = req.query.propertyType as string | undefined;
    const listings = await storage.getListings({ city, propertyType });
    res.json({ listings });
  });

  // Listings: get one
  app.get("/api/listings/:id", async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    const listing = await storage.getListingById(id);
    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }
    res.json(listing);
  });

  // Listings: create (auth required)
  app.post(
    "/api/listings",
    requireAuth,
    async (req: Request, res: Response) => {
      const body = req.body;
      const ownerId = req.session!.userId!;
      const listing = await storage.createListing({
        title: body.title,
        city: body.city,
        address: body.address,
        rent: Number(body.rent),
        deposit: body.deposit != null ? Number(body.deposit) : undefined,
        moveInDate: body.moveInDate,
        amenities:
          typeof body.amenities === "string"
            ? body.amenities
            : JSON.stringify(body.amenities || []),
        propertyType: body.propertyType,
        image: body.image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
        description: body.description,
        ownerId,
        houseRules: body.houseRules,
        contactPreferences: body.contactPreferences,
      });
      res.status(201).json(listing);
    }
  );

  // Roommates: list
  app.get("/api/roommates", async (req: Request, res: Response) => {
    const city = req.query.city as string | undefined;
    const roommates = await storage.getRoommates({ city });
    res.json({ roommates });
  });

  // Roommates: create (auth required - "Be a Roommater" profile)
  app.post(
    "/api/roommates",
    requireAuth,
    async (req: Request, res: Response) => {
      const userId = req.session!.userId!;
      const existing = await storage.getRoommateByUserId(userId);
      if (existing) {
        res.status(409).json({
          message: "You already have a roommate profile. Only one per account.",
        });
        return;
      }
      const body = req.body;
      const lifestyle =
        typeof body.lifestylePreferences === "string"
          ? body.lifestylePreferences
          : JSON.stringify(body.lifestylePreferences || []);
      const roommate = await storage.createRoommate({
        userId,
        name: body.name,
        age: Number(body.age),
        occupation: body.occupation,
        city: body.city,
        budgetMin: Number(body.budgetMin),
        budgetMax: Number(body.budgetMax),
        moveInDate: body.moveInDate,
        lifestylePreferences: lifestyle,
        bio: body.bio,
        profileImage:
          body.profileImage ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      });
      res.status(201).json(roommate);
    }
  );

  // Roommates: get one
  app.get("/api/roommates/:id", async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    const roommate = await storage.getRoommateById(id);
    if (!roommate) {
      res.status(404).json({ message: "Roommate not found" });
      return;
    }
    res.json(roommate);
  });

  // Roommates: delete own profile (auth required)
  app.delete("/api/roommates/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    const ok = await storage.deleteRoommate(id, req.session!.userId!);
    if (!ok) {
      res.status(403).json({ message: "Forbidden or not found" });
      return;
    }
    res.json({ ok: true });
  });

  // Listings: delete own listing (auth required)
  app.delete("/api/listings/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    const ok = await storage.deleteListing(id, req.session!.userId!);
    if (!ok) {
      res.status(403).json({ message: "Forbidden or not found" });
      return;
    }
    res.json({ ok: true });
  });

  // Me: my listings
  app.get("/api/me/listings", requireAuth, async (req: Request, res: Response) => {
    const listings = await storage.getListings({ ownerId: req.session!.userId! });
    res.json({ listings });
  });

  // Me: my roommate profile
  app.get("/api/me/roommate", requireAuth, async (req: Request, res: Response) => {
    const roommate = await storage.getRoommateByUserId(req.session!.userId!);
    res.json({ roommate: roommate ?? null });
  });

  // Me: favourite listings
  app.get("/api/me/favourites/listings", requireAuth, async (req: Request, res: Response) => {
    const listings = await storage.getFavouriteListings(req.session!.userId!);
    res.json({ listings });
  });

  app.get("/api/me/favourites/listings/ids", requireAuth, async (req: Request, res: Response) => {
    const ids = await storage.getFavouriteListingIds(req.session!.userId!);
    res.json({ ids });
  });

  app.post("/api/me/favourites/listings/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    const listing = await storage.getListingById(id);
    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }
    await storage.addFavouriteListing(req.session!.userId!, id);
    res.json({ ok: true });
  });

  app.delete("/api/me/favourites/listings/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    await storage.removeFavouriteListing(req.session!.userId!, id);
    res.json({ ok: true });
  });

  // Me: favourite roommates
  app.get("/api/me/favourites/roommates", requireAuth, async (req: Request, res: Response) => {
    const roommates = await storage.getFavouriteRoommates(req.session!.userId!);
    res.json({ roommates });
  });

  app.get("/api/me/favourites/roommates/ids", requireAuth, async (req: Request, res: Response) => {
    const ids = await storage.getFavouriteRoommateIds(req.session!.userId!);
    res.json({ ids });
  });

  app.post("/api/me/favourites/roommates/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    const roommate = await storage.getRoommateById(id);
    if (!roommate) {
      res.status(404).json({ message: "Roommate not found" });
      return;
    }
    await storage.addFavouriteRoommate(req.session!.userId!, id);
    res.json({ ok: true });
  });

  app.delete("/api/me/favourites/roommates/:id", requireAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    await storage.removeFavouriteRoommate(req.session!.userId!, id);
    res.json({ ok: true });
  });

  return _httpServer;
}
