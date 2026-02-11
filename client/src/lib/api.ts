const API = "/api";

export type User = { id: string; name: string; email: string };

export async function authMe(): Promise<{ user: User | null }> {
  const res = await fetch(`${API}/auth/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function login(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User }> {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export type Listing = {
  id: string;
  title: string;
  city: string;
  address: string;
  rent: number;
  deposit?: number;
  moveInDate: string;
  amenities: string;
  propertyType: string;
  image: string;
  description: string;
  ownerId: string;
  houseRules?: string;
  contactPreferences?: string;
  createdAt: string;
};

export async function getListings(filters?: {
  city?: string;
  propertyType?: string;
}): Promise<{ listings: Listing[] }> {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  if (filters?.propertyType) params.set("propertyType", filters.propertyType);
  const q = params.toString();
  const res = await fetch(`${API}/listings${q ? `?${q}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function createListing(data: {
  title: string;
  city: string;
  address: string;
  rent: number;
  deposit?: number;
  moveInDate: string;
  amenities: string[] | string;
  propertyType: string;
  image?: string;
  description: string;
  houseRules?: string;
  contactPreferences?: string;
}): Promise<Listing> {
  const res = await fetch(`${API}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.message || "Failed to create listing");
  return out;
}

export type Roommate = {
  id: string;
  userId?: string | null;
  name: string;
  age: number;
  occupation: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  lifestylePreferences: string;
  bio: string;
  profileImage: string;
};

export async function getRoommates(filters?: { city?: string }): Promise<{
  roommates: Roommate[];
}> {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  const q = params.toString();
  const res = await fetch(`${API}/roommates${q ? `?${q}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch roommates");
  return res.json();
}

export async function createRoommateProfile(data: {
  name: string;
  age: number;
  occupation: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  lifestylePreferences: string[];
  bio: string;
  profileImage?: string;
}): Promise<Roommate> {
  const res = await fetch(`${API}/roommates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.message || "Failed to create profile");
  return out;
}

// Dashboard / My account
export async function getMyListings(): Promise<{ listings: Listing[] }> {
  const res = await fetch(`${API}/me/listings`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch my listings");
  return res.json();
}

export async function getMyRoommate(): Promise<{ roommate: Roommate | null }> {
  const res = await fetch(`${API}/me/roommate`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch my roommate profile");
  return res.json();
}

export async function getFavouriteListings(): Promise<{ listings: Listing[] }> {
  const res = await fetch(`${API}/me/favourites/listings`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

export async function getFavouriteRoommates(): Promise<{ roommates: Roommate[] }> {
  const res = await fetch(`${API}/me/favourites/roommates`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

export async function getFavouriteListingIds(): Promise<{ ids: string[] }> {
  const res = await fetch(`${API}/me/favourites/listings/ids`, { credentials: "include" });
  if (!res.ok) return { ids: [] };
  return res.json();
}

export async function getFavouriteRoommateIds(): Promise<{ ids: string[] }> {
  const res = await fetch(`${API}/me/favourites/roommates/ids`, { credentials: "include" });
  if (!res.ok) return { ids: [] };
  return res.json();
}

export async function addFavouriteListing(listingId: string): Promise<void> {
  const res = await fetch(`${API}/me/favourites/listings/${listingId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favourite");
}

export async function removeFavouriteListing(listingId: string): Promise<void> {
  const res = await fetch(`${API}/me/favourites/listings/${listingId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove favourite");
}

export async function addFavouriteRoommate(roommateId: string): Promise<void> {
  const res = await fetch(`${API}/me/favourites/roommates/${roommateId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favourite");
}

export async function removeFavouriteRoommate(roommateId: string): Promise<void> {
  const res = await fetch(`${API}/me/favourites/roommates/${roommateId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove favourite");
}

export async function deleteListing(listingId: string): Promise<void> {
  const res = await fetch(`${API}/listings/${listingId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete listing");
}

export async function deleteRoommate(roommateId: string): Promise<void> {
  const res = await fetch(`${API}/roommates/${roommateId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete profile");
}
