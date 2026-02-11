import { sql } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailVerified: text("email_verified").default("false"), // "true" | "false"
  verificationToken: text("verification_token"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const propertyTypes = ["Apartment", "Townhome", "House"] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const listings = pgTable("listings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  rent: integer("rent").notNull(),
  deposit: integer("deposit"),
  moveInDate: text("move_in_date").notNull(),
  amenities: text("amenities").notNull(), // JSON array as string
  propertyType: text("property_type").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  ownerId: varchar("owner_id", { length: 36 }).notNull(),
  houseRules: text("house_rules"),
  contactPreferences: text("contact_preferences"),
  createdAt: text("created_at").notNull(),
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;

export const roommates = pgTable("roommates", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }), // optional: set when user creates "Be a Roommater" profile
  name: text("name").notNull(),
  age: integer("age").notNull(),
  occupation: text("occupation").notNull(),
  city: text("city").notNull(),
  budgetMin: integer("budget_min").notNull(),
  budgetMax: integer("budget_max").notNull(),
  moveInDate: text("move_in_date").notNull(),
  lifestylePreferences: text("lifestyle_preferences").notNull(), // JSON array as string
  bio: text("bio").notNull(),
  profileImage: text("profile_image").notNull(),
});

export const insertRoommateSchema = createInsertSchema(roommates).omit({
  id: true,
});

export type InsertRoommate = z.infer<typeof insertRoommateSchema>;
export type Roommate = typeof roommates.$inferSelect;
