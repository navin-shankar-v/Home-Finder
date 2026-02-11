import type {
  InsertListing,
  InsertRoommate,
  InsertUser,
  Listing,
  Roommate,
  User,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { createSeedListings, createSeedRoommates } from "./seed";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  setUserEmailVerified(userId: string): Promise<void>;
  createUser(user: InsertUser & { verificationToken?: string; emailVerified?: string }): Promise<User>;
  getListings(filters?: { city?: string; propertyType?: string; ownerId?: string }): Promise<Listing[]>;
  getListingById(id: string): Promise<Listing | undefined>;
  createListing(data: InsertListing): Promise<Listing>;
  deleteListing(id: string, userId: string): Promise<boolean>;
  getRoommates(filters?: {
    city?: string;
    ageMin?: number;
    ageMax?: number;
    foodPreference?: string;
    smoker?: string;
    alcohol?: string;
    gender?: string;
  }): Promise<Roommate[]>;
  getRoommateById(id: string): Promise<Roommate | undefined>;
  getRoommateByUserId(userId: string): Promise<Roommate | undefined>;
  createRoommate(data: Omit<Roommate, "id">): Promise<Roommate>;
  deleteRoommate(id: string, userId: string): Promise<boolean>;
  getFavouriteListings(userId: string): Promise<Listing[]>;
  getFavouriteRoommates(userId: string): Promise<Roommate[]>;
  addFavouriteListing(userId: string, listingId: string): Promise<void>;
  removeFavouriteListing(userId: string, listingId: string): Promise<void>;
  addFavouriteRoommate(userId: string, roommateId: string): Promise<void>;
  removeFavouriteRoommate(userId: string, roommateId: string): Promise<void>;
  isFavouriteListing(userId: string, listingId: string): Promise<boolean>;
  isFavouriteRoommate(userId: string, roommateId: string): Promise<boolean>;
  getFavouriteListingIds(userId: string): Promise<string[]>;
  getFavouriteRoommateIds(userId: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private listings: Map<string, Listing>;
  private roommates: Map<string, Roommate>;
  private favouriteListings: Map<string, Set<string>>; // userId -> Set of listingIds
  private favouriteRoommates: Map<string, Set<string>>; // userId -> Set of roommateIds

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.roommates = new Map();
    this.favouriteListings = new Map();
    this.favouriteRoommates = new Map();
    this.seedData();
  }

  private seedData() {
    const seedOwnerId = randomUUID();
    const seedListings = createSeedListings(seedOwnerId);
    seedListings.forEach((l) => {
      const id = randomUUID();
      this.listings.set(id, { ...l, id } as Listing);
    });
    const seedRoommates = createSeedRoommates();
    seedRoommates.forEach((r) => this.roommates.set(r.id, r as Roommate));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => (u as any).verificationToken === token
    );
  }

  async setUserEmailVerified(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) (user as any).emailVerified = "true";
  }

  async createUser(
    insertUser: InsertUser & { verificationToken?: string; emailVerified?: string }
  ): Promise<User> {
    const existing = await this.getUserByEmail(insertUser.email);
    if (existing) {
      throw new Error("EMAIL_IN_USE");
    }
    const id = randomUUID();
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      emailVerified: insertUser.emailVerified ?? "false",
      verificationToken: insertUser.verificationToken ?? null,
    } as User;
    this.users.set(id, user);
    return user;
  }

  async getListings(filters?: {
    city?: string;
    propertyType?: string;
    ownerId?: string;
  }): Promise<Listing[]> {
    let list = Array.from(this.listings.values());
    if (filters?.city) {
      const q = filters.city.toLowerCase().trim();
      list = list.filter((l) => l.city.toLowerCase().includes(q));
    }
    if (filters?.propertyType) {
      list = list.filter(
        (l) =>
          l.propertyType.toLowerCase() === filters.propertyType!.toLowerCase()
      );
    }
    if (filters?.ownerId) {
      list = list.filter((l) => l.ownerId === filters.ownerId);
    }
    return list;
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async createListing(data: InsertListing): Promise<Listing> {
    const id = randomUUID();
    const listing: Listing = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    } as Listing;
    this.listings.set(id, listing);
    return listing;
  }

  private parseLifestylePrefs(lifestylePreferences: string): { foodPreference?: string; smoker?: string; alcohol?: string; gender?: string } {
    try {
      const parsed = JSON.parse(lifestylePreferences);
      if (Array.isArray(parsed)) return {};
      return {
        foodPreference: parsed.foodPreference,
        smoker: parsed.smoker,
        alcohol: parsed.alcohol,
        gender: parsed.gender,
      };
    } catch {
      return {};
    }
  }

  async getRoommates(filters?: {
    city?: string;
    ageMin?: number;
    ageMax?: number;
    foodPreference?: string;
    smoker?: string;
    alcohol?: string;
    gender?: string;
  }): Promise<Roommate[]> {
    let list = Array.from(this.roommates.values());
    if (filters?.city) {
      const q = filters.city.toLowerCase().trim();
      list = list.filter((r) => r.city.toLowerCase().includes(q));
    }
    if (filters?.ageMin != null) {
      list = list.filter((r) => r.age >= filters!.ageMin!);
    }
    if (filters?.ageMax != null) {
      list = list.filter((r) => r.age <= filters!.ageMax!);
    }
    if (filters?.foodPreference) {
      const q = filters.foodPreference.toLowerCase();
      list = list.filter((r) => {
        const prefs = this.parseLifestylePrefs(r.lifestylePreferences);
        return prefs.foodPreference?.toLowerCase() === q;
      });
    }
    if (filters?.smoker) {
      const q = filters.smoker.toLowerCase();
      list = list.filter((r) => {
        const prefs = this.parseLifestylePrefs(r.lifestylePreferences);
        return prefs.smoker?.toLowerCase() === q;
      });
    }
    if (filters?.alcohol) {
      const q = filters.alcohol.toLowerCase();
      list = list.filter((r) => {
        const prefs = this.parseLifestylePrefs(r.lifestylePreferences);
        return prefs.alcohol?.toLowerCase() === q;
      });
    }
    if (filters?.gender) {
      const q = filters.gender.toLowerCase();
      list = list.filter((r) => {
        const prefs = this.parseLifestylePrefs(r.lifestylePreferences);
        return prefs.gender?.toLowerCase() === q;
      });
    }
    return list;
  }

  async getRoommateById(id: string): Promise<Roommate | undefined> {
    return this.roommates.get(id);
  }

  async getRoommateByUserId(userId: string): Promise<Roommate | undefined> {
    return Array.from(this.roommates.values()).find(
      (r) => r.userId === userId
    );
  }

  async createRoommate(data: Omit<Roommate, "id">): Promise<Roommate> {
    const id = randomUUID();
    const roommate = { ...data, id } as Roommate;
    this.roommates.set(id, roommate);
    return roommate;
  }

  async deleteListing(id: string, userId: string): Promise<boolean> {
    const listing = this.listings.get(id);
    if (!listing || listing.ownerId !== userId) return false;
    this.listings.delete(id);
    return true;
  }

  async deleteRoommate(id: string, userId: string): Promise<boolean> {
    const roommate = this.roommates.get(id);
    if (!roommate || roommate.userId !== userId) return false;
    this.roommates.delete(id);
    return true;
  }

  private getFavListingIds(userId: string): Set<string> {
    if (!this.favouriteListings.has(userId)) {
      this.favouriteListings.set(userId, new Set());
    }
    return this.favouriteListings.get(userId)!;
  }

  private getFavRoommateIds(userId: string): Set<string> {
    if (!this.favouriteRoommates.has(userId)) {
      this.favouriteRoommates.set(userId, new Set());
    }
    return this.favouriteRoommates.get(userId)!;
  }

  async getFavouriteListings(userId: string): Promise<Listing[]> {
    const ids = Array.from(this.getFavListingIds(userId));
    const list: Listing[] = [];
    ids.forEach((id) => {
      const listing = this.listings.get(id);
      if (listing) list.push(listing);
    });
    return list;
  }

  async getFavouriteRoommates(userId: string): Promise<Roommate[]> {
    const ids = Array.from(this.getFavRoommateIds(userId));
    const list: Roommate[] = [];
    ids.forEach((id) => {
      const roommate = this.roommates.get(id);
      if (roommate) list.push(roommate);
    });
    return list;
  }

  async addFavouriteListing(userId: string, listingId: string): Promise<void> {
    this.getFavListingIds(userId).add(listingId);
  }

  async removeFavouriteListing(userId: string, listingId: string): Promise<void> {
    this.getFavListingIds(userId).delete(listingId);
  }

  async addFavouriteRoommate(userId: string, roommateId: string): Promise<void> {
    this.getFavRoommateIds(userId).add(roommateId);
  }

  async removeFavouriteRoommate(userId: string, roommateId: string): Promise<void> {
    this.getFavRoommateIds(userId).delete(roommateId);
  }

  async isFavouriteListing(userId: string, listingId: string): Promise<boolean> {
    return this.getFavListingIds(userId).has(listingId);
  }

  async isFavouriteRoommate(userId: string, roommateId: string): Promise<boolean> {
    return this.getFavRoommateIds(userId).has(roommateId);
  }

  async getFavouriteListingIds(userId: string): Promise<string[]> {
    return Array.from(this.getFavListingIds(userId));
  }

  async getFavouriteRoommateIds(userId: string): Promise<string[]> {
    return Array.from(this.getFavRoommateIds(userId));
  }
}

import { DrizzleStorage } from "./storage-drizzle";

const storage: IStorage = process.env.DATABASE_URL
  ? new DrizzleStorage()
  : new MemStorage();

export { storage };
