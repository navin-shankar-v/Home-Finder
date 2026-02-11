import type { Listing, Roommate } from "@shared/schema";
import { randomUUID } from "crypto";

const CITIES = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
];

const PROPERTY_TYPES = ["Apartment", "Townhome", "House"] as const;
const AMENITIES_POOL = [
  "WiFi",
  "Parking",
  "Laundry",
  "Gym",
  "AC",
  "Furnished",
  "Pet Friendly",
  "Dishwasher",
  "Balcony",
  "Pool",
  "Security",
  "Storage",
];

const LISTING_TITLES = [
  "Sunny room in shared apartment",
  "Private bedroom with ensuite",
  "Cozy room near downtown",
  "Spacious room in quiet neighborhood",
  "Modern apartment with city view",
  "Charming room in historic building",
  "Bright room with natural light",
  "Furnished room ready to move in",
  "Room in pet-friendly home",
  "Quiet room for professional",
  "Room with private bathroom",
  "Large room with closet",
  "Room in new construction",
  "Budget-friendly room",
  "Luxury condo room",
  "Room with parking included",
  "Room near public transit",
  "Room in house with garden",
  "Room with gym access",
  "Room in safe neighborhood",
];

const STREET_NAMES = [
  "Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Park Blvd",
  "Washington St", "Lake View Dr", "Hill St", "River Rd", "Sunset Blvd",
];

const NAMES = [
  "Sarah Chen", "Marcus Johnson", "Elena Rodriguez", "David Kim", "Aisha Patel",
  "Tom Wilson", "Jessica Lee", "James Martinez", "Emily Brown", "Michael Davis",
  "Sofia Garcia", "Daniel Taylor", "Olivia Anderson", "William Thomas", "Emma Jackson",
  "Liam White", "Ava Harris", "Noah Martin", "Isabella Thompson", "Lucas Moore",
  "Mia Clark", "Ethan Lewis", "Charlotte Walker", "Alexander Hall", "Amelia Young",
  "Benjamin King", "Harper Wright", "Henry Lopez", "Evelyn Hill", "Sebastian Scott",
  "Abigail Green", "Jack Adams", "Ella Baker", "Owen Nelson", "Scarlett Carter",
  "Samuel Mitchell", "Grace Perez", "Joseph Roberts", "Chloe Turner", "David Phillips",
  "Victoria Campbell", "Carter Parker", "Riley Evans", "Ryan Edwards", "Zoey Collins",
  "John Stewart", "Penelope Sanchez", "Nathan Morris", "Layla Rogers", "Isaac Reed",
  "Lillian Cook", "Dylan Morgan", "Hannah Bell", "Leo Murphy", "Addison Bailey",
  "Luke Rivera", "Eleanor Cooper", "Gabriel Richardson", "Natalie Cox", "Anthony Howard",
  "Lillian Ward", "Isaac Torres", "Stella Peterson", "Julian Gray", "Bella Ramirez",
  "Aaron James", "Aria Watson", "Robert Brooks", "Savannah Kelly", "Christopher Sanders",
  "Nora Price", "Jose Bennett", "Brooklyn Wood", "Kevin Barnes", "Paisley Ross",
  "Brandon Henderson", "Audrey Coleman", "Tyler Jenkins", "Brielle Perry", "Jacob Powell",
  "Skylar Long", "Gavin Patterson", "Claire Hughes", "Mason Flores", "Anna Washington",
  "Evan Butler", "Caroline Simmons", "Logan Foster", "Genesis Gonzales", "Austin Bryant",
  "Aaliyah Alexander", "Jaxon Russell", "Kennedy Griffin", "Caleb Hayes", "Kinsley Ford",
  "Adrian Hamilton", "Madelyn Graham", "Nolan Sullivan", "Hailey Wallace", "Easton West",
];

const OCCUPATIONS = [
  "Software Engineer", "UX Designer", "Teacher", "Nurse", "Marketing Manager",
  "Data Analyst", "Graphic Designer", "Accountant", "Chef", "Architect",
  "Grad Student", "Product Manager", "Writer", "Consultant", "Research Scientist",
  "Sales Representative", "HR Specialist", "Financial Analyst", "Photographer", "Lawyer",
];

const LIFESTYLE_TAGS = [
  "Early Bird", "Night Owl", "Non-Smoker", "Pet Friendly", "Yoga", "Gamer",
  "Studious", "Quiet", "Social", "Foodie", "Traveler", "Outdoorsy", "Music Lover",
  "Clean", "Minimalist", "Fitness", "Reader", "Cooking", "Gardening",
];

const BIOS = [
  "Looking for a clean, respectful living situation. I work from home sometimes and value quiet evenings.",
  "Outgoing and love hosting friends. Prefer a place with good common areas.",
  "Grad student—mostly at campus or library. Need a quiet room and reliable WiFi.",
  "Professional with a small dog. Need pet-friendly and parking.",
  "I cook a lot and love sharing meals. Prefer roommates who appreciate good food.",
  "Early riser, into fitness. Looking for a place with gym or nearby park.",
  "Work in tech, flexible schedule. I keep to myself but enjoy occasional game nights.",
  "Artist and freelancer. Need natural light and a calm environment.",
  "Travel often for work. Need reliable roommates to hold down the fort.",
  "New to the city. Hoping to find friendly roommates and explore together.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function createSeedListings(ownerId: string): Omit<Listing, "id">[] {
  const listings: Omit<Listing, "id">[] = [];
  for (let i = 0; i < 100; i++) {
    const city = pick(CITIES);
    const [cityName] = city.split(",");
    const moveIn = new Date();
    moveIn.setDate(moveIn.getDate() + Math.floor(Math.random() * 60));
    listings.push({
      title: pick(LISTING_TITLES) + ` - ${cityName}`,
      city,
      address: `${Math.floor(Math.random() * 9000) + 100} ${pick(STREET_NAMES)}`,
      rent: Math.floor(Math.random() * 1500) + 600,
      deposit: Math.floor(Math.random() * 1000) + 500,
      moveInDate: moveIn.toISOString().split("T")[0],
      amenities: JSON.stringify(pickMany(AMENITIES_POOL, 4)),
      propertyType: pick([...PROPERTY_TYPES]),
      image: `https://images.unsplash.com/photo-${1502672260266 + i}-1c1ef2d93688?auto=format&fit=crop&q=80&w=800`,
      description: `Spacious and well-located room in ${city}. Great amenities and friendly neighborhood.`,
      ownerId,
      houseRules: "No smoking, quiet hours after 10 PM.",
      contactPreferences: "Text or email",
      createdAt: new Date().toISOString(),
    });
  }
  // Fix image URLs to use real Unsplash IDs
  const unsplashIds = [
    "1502672260266-1c1ef2d93688", "1493809842364-78817add7ffb", "1522708323590-d24dbb6b0267",
    "1554995207-c18c203602cb", "1512918760383-56453715e1c8", "1502005229762-cf1b2da7c5d6",
    "1560448204-e02f43605775", "1484154218962-a197022b5858", "1502672023488-718e0a6406b8",
    "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539e9", "1600585154340-beef1c6a9815",
  ];
  listings.forEach((l, i) => {
    l.image = `https://images.unsplash.com/photo-${unsplashIds[i % unsplashIds.length]}?auto=format&fit=crop&q=80&w=800`;
  });
  return listings;
}

export function createSeedRoommates(): (Omit<Roommate, "id"> & { id: string })[] {
  const roommates: (Omit<Roommate, "id"> & { id: string })[] = [];
  const usedNames = new Set<string>();
  const imageIds = [
    "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1534528741775-53994a69daeb",
    "1507003211169-0a1dd7228f2d", "1531123897727-8f129e1688ce", "1506794778202-cad84cf45f1d",
    "1502823403499-6ccdce4a304d", "1517841905240-472988babdf9", "1531746020798-e6953c6e8e04",
    "1524504381995-2c6a6845972a", "1529626455594-4ff0802cfbeb", "1544005313-94ddf0286d6b",
    "1528892952291-98c9239a8d0a", "1519345182560-32f2e963aee0", "1506794778202-cad84cf45f1d",
  ];
  for (let i = 0; i < 100; i++) {
    let name = pick(NAMES);
    while (usedNames.has(name)) {
      name = pick(NAMES);
    }
    usedNames.add(name);
    const budgetMin = Math.floor(Math.random() * 600) + 600;
    const budgetMax = budgetMin + Math.floor(Math.random() * 600) + 200;
    const moveIn = new Date();
    moveIn.setDate(moveIn.getDate() + Math.floor(Math.random() * 90));
    roommates.push({
      id: randomUUID(),
      userId: null,
      name,
      age: Math.floor(Math.random() * 25) + 22,
      occupation: pick(OCCUPATIONS),
      city: pick(CITIES),
      budgetMin,
      budgetMax,
      moveInDate: moveIn.toISOString().split("T")[0],
      lifestylePreferences: JSON.stringify(pickMany(LIFESTYLE_TAGS, 4)),
      bio: pick(BIOS),
      profileImage: `https://images.unsplash.com/photo-${imageIds[i % imageIds.length]}?auto=format&fit=crop&q=80&w=400`,
    });
  }
  return roommates;
}
