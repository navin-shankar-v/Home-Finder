import { and, eq, inArray, like, sql } from "drizzle-orm";
import type {
  InsertListing,
  InsertRoommate,
  InsertUser,
  Listing,
  Roommate,
  User,
} from "@shared/schema";
import {
  favouriteListings as favouriteListingsTable,
  favouriteRoommates as favouriteRoommatesTable,
  listings as listingsTable,
  roommates as roommatesTable,
  users as usersTable,
} from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";
import { getDb } from "./db";

function parseLifestylePrefs(lifestylePreferences: string): {
  foodPreference?: string;
  smoker?: string;
  alcohol?: string;
  gender?: string;
} {
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

export class DrizzleStorage implements IStorage {
  private get db() {
    return getDb();
  }

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return rows[0] as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(sql`lower(${usersTable.email}) = lower(${email})`)
      .limit(1);
    return rows[0] as User | undefined;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.verificationToken, token))
      .limit(1);
    return rows[0] as User | undefined;
  }

  async setUserEmailVerified(userId: string): Promise<void> {
    await this.db
      .update(usersTable)
      .set({ emailVerified: "true" })
      .where(eq(usersTable.id, userId));
  }

  async createUser(
    insertUser: InsertUser & { verificationToken?: string; emailVerified?: string }
  ): Promise<User> {
    const existing = await this.getUserByEmail(insertUser.email);
    if (existing) throw new Error("EMAIL_IN_USE");
    const id = randomUUID();
    await this.db.insert(usersTable).values({
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      emailVerified: insertUser.emailVerified ?? "false",
      verificationToken: insertUser.verificationToken ?? null,
    });
    const user = await this.getUser(id);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  async getListings(filters?: {
    city?: string;
    propertyType?: string;
    ownerId?: string;
  }): Promise<Listing[]> {
    const conditions = [];
    if (filters?.city) {
      conditions.push(like(listingsTable.city, `%${filters.city.trim()}%`));
    }
    if (filters?.propertyType) {
      conditions.push(eq(listingsTable.propertyType, filters.propertyType));
    }
    if (filters?.ownerId) {
      conditions.push(eq(listingsTable.ownerId, filters.ownerId));
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;
    const rows = await this.db.select().from(listingsTable).where(whereClause);
    return rows as Listing[];
  }

  async getListingById(id: string): Promise<Listing | undefined> {
    const rows = await this.db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);
    return rows[0] as Listing | undefined;
  }

  async createListing(data: InsertListing): Promise<Listing> {
    const id = randomUUID();
    await this.db.insert(listingsTable).values({
      id,
      ...data,
      createdAt: new Date().toISOString(),
    });
    const listing = await this.getListingById(id);
    if (!listing) throw new Error("Failed to create listing");
    return listing;
  }

  async deleteListing(id: string, userId: string): Promise<boolean> {
    const listing = await this.getListingById(id);
    if (!listing || listing.ownerId !== userId) return false;
    await this.db.delete(listingsTable).where(eq(listingsTable.id, id));
    return true;
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
    const conditions = [];
    if (filters?.city) {
      conditions.push(like(roommatesTable.city, `%${filters.city.trim()}%`));
    }
    if (filters?.ageMin != null) {
      conditions.push(sql`${roommatesTable.age} >= ${filters.ageMin}`);
    }
    if (filters?.ageMax != null) {
      conditions.push(sql`${roommatesTable.age} <= ${filters.ageMax}`);
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;
    let rows = await this.db.select().from(roommatesTable).where(whereClause);
    if (filters?.foodPreference) {
      const q = filters.foodPreference.toLowerCase();
      rows = rows.filter((r) => parseLifestylePrefs(r.lifestylePreferences).foodPreference?.toLowerCase() === q);
    }
    if (filters?.smoker) {
      const q = filters.smoker.toLowerCase();
      rows = rows.filter((r) => parseLifestylePrefs(r.lifestylePreferences).smoker?.toLowerCase() === q);
    }
    if (filters?.alcohol) {
      const q = filters.alcohol.toLowerCase();
      rows = rows.filter((r) => parseLifestylePrefs(r.lifestylePreferences).alcohol?.toLowerCase() === q);
    }
    if (filters?.gender) {
      const q = filters.gender.toLowerCase();
      rows = rows.filter((r) => parseLifestylePrefs(r.lifestylePreferences).gender?.toLowerCase() === q);
    }
    return rows as Roommate[];
  }

  async getRoommateById(id: string): Promise<Roommate | undefined> {
    const rows = await this.db.select().from(roommatesTable).where(eq(roommatesTable.id, id)).limit(1);
    return rows[0] as Roommate | undefined;
  }

  async getRoommateByUserId(userId: string): Promise<Roommate | undefined> {
    const rows = await this.db
      .select()
      .from(roommatesTable)
      .where(eq(roommatesTable.userId, userId))
      .limit(1);
    return rows[0] as Roommate | undefined;
  }

  async createRoommate(data: Omit<Roommate, "id">): Promise<Roommate> {
    const id = randomUUID();
    await this.db.insert(roommatesTable).values({
      id,
      userId: data.userId ?? null,
      name: data.name,
      age: data.age,
      occupation: data.occupation,
      city: data.city,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      moveInDate: data.moveInDate,
      lifestylePreferences: data.lifestylePreferences,
      bio: data.bio,
      profileImage: data.profileImage,
    });
    const roommate = await this.getRoommateById(id);
    if (!roommate) throw new Error("Failed to create roommate");
    return roommate;
  }

  async deleteRoommate(id: string, userId: string): Promise<boolean> {
    const roommate = await this.getRoommateById(id);
    if (!roommate || roommate.userId !== userId) return false;
    await this.db.delete(roommatesTable).where(eq(roommatesTable.id, id));
    return true;
  }

  async getFavouriteListingIds(userId: string): Promise<string[]> {
    const rows = await this.db
      .select({ listingId: favouriteListingsTable.listingId })
      .from(favouriteListingsTable)
      .where(eq(favouriteListingsTable.userId, userId));
    return rows.map((r) => r.listingId);
  }

  async getFavouriteRoommateIds(userId: string): Promise<string[]> {
    const rows = await this.db
      .select({ roommateId: favouriteRoommatesTable.roommateId })
      .from(favouriteRoommatesTable)
      .where(eq(favouriteRoommatesTable.userId, userId));
    return rows.map((r) => r.roommateId);
  }

  async getFavouriteListings(userId: string): Promise<Listing[]> {
    const ids = await this.getFavouriteListingIds(userId);
    if (ids.length === 0) return [];
    const rows = await this.db.select().from(listingsTable).where(inArray(listingsTable.id, ids));
    return rows as Listing[];
  }

  async getFavouriteRoommates(userId: string): Promise<Roommate[]> {
    const ids = await this.getFavouriteRoommateIds(userId);
    if (ids.length === 0) return [];
    const rows = await this.db.select().from(roommatesTable).where(inArray(roommatesTable.id, ids));
    return rows as Roommate[];
  }

  async addFavouriteListing(userId: string, listingId: string): Promise<void> {
    await this.db
      .insert(favouriteListingsTable)
      .values({ userId, listingId })
      .onConflictDoNothing();
  }

  async removeFavouriteListing(userId: string, listingId: string): Promise<void> {
    await this.db
      .delete(favouriteListingsTable)
      .where(
        and(
          eq(favouriteListingsTable.userId, userId),
          eq(favouriteListingsTable.listingId, listingId)
        )
      );
  }

  async addFavouriteRoommate(userId: string, roommateId: string): Promise<void> {
    await this.db
      .insert(favouriteRoommatesTable)
      .values({ userId, roommateId })
      .onConflictDoNothing();
  }

  async removeFavouriteRoommate(userId: string, roommateId: string): Promise<void> {
    await this.db
      .delete(favouriteRoommatesTable)
      .where(
        and(
          eq(favouriteRoommatesTable.userId, userId),
          eq(favouriteRoommatesTable.roommateId, roommateId)
        )
      );
  }

  async isFavouriteListing(userId: string, listingId: string): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(favouriteListingsTable)
      .where(
        and(
          eq(favouriteListingsTable.userId, userId),
          eq(favouriteListingsTable.listingId, listingId)
        )
      )
      .limit(1);
    return rows.length > 0;
  }

  async isFavouriteRoommate(userId: string, roommateId: string): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(favouriteRoommatesTable)
      .where(
        and(
          eq(favouriteRoommatesTable.userId, userId),
          eq(favouriteRoommatesTable.roommateId, roommateId)
        )
      )
      .limit(1);
    return rows.length > 0;
  }
}
