import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { getAuth } from "@clerk/express";
import { storage } from "./storage";

/** Clerk-based auth: use for protected API routes. Returns 401 JSON if not signed in. */
function requireClerkAuth(req: Request, res: Response, next: () => void) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export async function registerRoutes(
  _httpServer: Server,
  app: Express
): Promise<Server> {
  // Debug: Clerk auth
  app.get("/api/debug/me-clerk", (req: Request, res: Response) => {
    const auth = getAuth(req);
    res.json({ userId: auth?.userId ?? null });
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
    requireClerkAuth,
    async (req: Request, res: Response) => {
      const body = req.body;
      const ownerId = getAuth(req).userId!;
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
    const ageMin = req.query.ageMin != null ? Number(req.query.ageMin) : undefined;
    const ageMax = req.query.ageMax != null ? Number(req.query.ageMax) : undefined;
    const foodPreference = req.query.foodPreference as string | undefined;
    const smoker = req.query.smoker as string | undefined;
    const alcohol = req.query.alcohol as string | undefined;
    const gender = req.query.gender as string | undefined;
    const roommates = await storage.getRoommates({
      city,
      ageMin: ageMin !== undefined && !Number.isNaN(ageMin) ? ageMin : undefined,
      ageMax: ageMax !== undefined && !Number.isNaN(ageMax) ? ageMax : undefined,
      foodPreference: foodPreference || undefined,
      smoker: smoker || undefined,
      alcohol: alcohol || undefined,
      gender: gender || undefined,
    });
    res.json({ roommates });
  });

  // Roommates: create (auth required - "Be a Roommater" profile)
  app.post(
    "/api/roommates",
    requireClerkAuth,
    async (req: Request, res: Response) => {
      const userId = getAuth(req).userId!;
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
  app.delete("/api/roommates/:id", requireClerkAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    const ok = await storage.deleteRoommate(id, getAuth(req).userId!);
    if (!ok) {
      res.status(403).json({ message: "Forbidden or not found" });
      return;
    }
    res.json({ ok: true });
  });

  // Listings: delete own listing (auth required)
  app.delete("/api/listings/:id", requireClerkAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    const ok = await storage.deleteListing(id, getAuth(req).userId!);
    if (!ok) {
      res.status(403).json({ message: "Forbidden or not found" });
      return;
    }
    res.json({ ok: true });
  });

  // Me: my listings
  app.get("/api/me/listings", requireClerkAuth, async (req: Request, res: Response) => {
    const listings = await storage.getListings({ ownerId: getAuth(req).userId! });
    res.json({ listings });
  });

  // Me: my roommate profile
  app.get("/api/me/roommate", requireClerkAuth, async (req: Request, res: Response) => {
    const roommate = await storage.getRoommateByUserId(getAuth(req).userId!);
    res.json({ roommate: roommate ?? null });
  });

  // Me: favourite listings
  app.get("/api/me/favourites/listings", requireClerkAuth, async (req: Request, res: Response) => {
    const listings = await storage.getFavouriteListings(getAuth(req).userId!);
    res.json({ listings });
  });

  app.get("/api/me/favourites/listings/ids", requireClerkAuth, async (req: Request, res: Response) => {
    const ids = await storage.getFavouriteListingIds(getAuth(req).userId!);
    res.json({ ids });
  });

  app.post("/api/me/favourites/listings/:id", requireClerkAuth, async (req: Request, res: Response) => {
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
    await storage.addFavouriteListing(getAuth(req).userId!, id);
    res.json({ ok: true });
  });

  app.delete("/api/me/favourites/listings/:id", requireClerkAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid listing id" });
      return;
    }
    await storage.removeFavouriteListing(getAuth(req).userId!, id);
    res.json({ ok: true });
  });

  // Me: favourite roommates
  app.get("/api/me/favourites/roommates", requireClerkAuth, async (req: Request, res: Response) => {
    const roommates = await storage.getFavouriteRoommates(getAuth(req).userId!);
    res.json({ roommates });
  });

  app.get("/api/me/favourites/roommates/ids", requireClerkAuth, async (req: Request, res: Response) => {
    const ids = await storage.getFavouriteRoommateIds(getAuth(req).userId!);
    res.json({ ids });
  });

  app.post("/api/me/favourites/roommates/:id", requireClerkAuth, async (req: Request, res: Response) => {
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
    await storage.addFavouriteRoommate(getAuth(req).userId!, id);
    res.json({ ok: true });
  });

  app.delete("/api/me/favourites/roommates/:id", requireClerkAuth, async (req: Request, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
    if (!id) {
      res.status(400).json({ message: "Invalid roommate id" });
      return;
    }
    await storage.removeFavouriteRoommate(getAuth(req).userId!, id);
    res.json({ ok: true });
  });

  return _httpServer;
}
