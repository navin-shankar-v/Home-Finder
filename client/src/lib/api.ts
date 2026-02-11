const API = "/api";

/** Set by app so API can attach Clerk JWT to authenticated requests. */
let authGetToken: (() => Promise<string | null>) | null = null;
export function setAuthGetToken(fn: () => Promise<string | null>) {
  authGetToken = fn;
}


async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  const token = authGetToken ? await authGetToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
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

export async function getListing(id: string): Promise<Listing> {
  const res = await fetch(`${API}/listings/${id}`, { credentials: "include" });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Listing not found");
    throw new Error("Failed to fetch listing");
  }
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
  const headers = await authHeaders();
  const res = await fetch(`${API}/listings`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
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

export async function getRoommates(filters?: {
  city?: string;
  ageMin?: number;
  ageMax?: number;
  foodPreference?: string;
  smoker?: string;
  alcohol?: string;
  gender?: string;
}): Promise<{ roommates: Roommate[] }> {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  if (filters?.ageMin != null) params.set("ageMin", String(filters.ageMin));
  if (filters?.ageMax != null) params.set("ageMax", String(filters.ageMax));
  if (filters?.foodPreference) params.set("foodPreference", filters.foodPreference);
  if (filters?.smoker) params.set("smoker", filters.smoker);
  if (filters?.alcohol) params.set("alcohol", filters.alcohol);
  if (filters?.gender) params.set("gender", filters.gender);
  const q = params.toString();
  const res = await fetch(`${API}/roommates${q ? `?${q}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch roommates");
  return res.json();
}

export async function getRoommate(id: string): Promise<Roommate> {
  const res = await fetch(`${API}/roommates/${id}`, { credentials: "include" });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Roommate not found");
    throw new Error("Failed to fetch roommate");
  }
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
  lifestylePreferences: string[] | Record<string, unknown>;
  bio: string;
  profileImage?: string;
}): Promise<Roommate> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/roommates`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.message || "Failed to create profile");
  return out;
}

// Dashboard / My account (require Clerk auth)
export async function getMyListings(): Promise<{ listings: Listing[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/listings`, { headers, credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch my listings");
  return res.json();
}

export async function getMyRoommate(): Promise<{ roommate: Roommate | null }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/roommate`, { headers, credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch my roommate profile");
  return res.json();
}

export async function getFavouriteListings(): Promise<{ listings: Listing[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/listings`, { headers, credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

export async function getFavouriteRoommates(): Promise<{ roommates: Roommate[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/roommates`, { headers, credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

export async function getFavouriteListingIds(): Promise<{ ids: string[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/listings/ids`, { headers, credentials: "include" });
  if (!res.ok) return { ids: [] };
  return res.json();
}

export async function getFavouriteRoommateIds(): Promise<{ ids: string[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/roommates/ids`, { headers, credentials: "include" });
  if (!res.ok) return { ids: [] };
  return res.json();
}

export async function addFavouriteListing(listingId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/listings/${listingId}`, {
    method: "POST",
    headers,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favourite");
}

export async function removeFavouriteListing(listingId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/listings/${listingId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove favourite");
}

export async function addFavouriteRoommate(roommateId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/roommates/${roommateId}`, {
    method: "POST",
    headers,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favourite");
}

export async function removeFavouriteRoommate(roommateId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/me/favourites/roommates/${roommateId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove favourite");
}

export async function deleteListing(listingId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/listings/${listingId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete listing");
}

export async function deleteRoommate(roommateId: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/roommates/${roommateId}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete profile");
}
