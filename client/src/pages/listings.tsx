import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Map } from "lucide-react";

// Using more mock data for the listings page
const LISTINGS = [
  {
    id: 1,
    title: "Sunny Loft in Arts District",
    price: 1200,
    location: "Downtown, Metro City",
    type: "Private Room",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    beds: 1,
    baths: 1,
    roommates: 2,
    isNew: true,
    tags: ["Furnished", "Pet Friendly"]
  },
  {
    id: 2,
    title: "Modern Shared House with Garden",
    price: 950,
    location: "Greenwood Suburbs",
    type: "Shared Room",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    beds: 1,
    baths: 2,
    roommates: 3,
    tags: ["Garden", "Parking"]
  },
  {
    id: 3,
    title: "Luxury Condo with City View",
    price: 1600,
    location: "Financial District",
    type: "Entire Apartment",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    beds: 2,
    baths: 2,
    roommates: 0,
    isNew: true,
    tags: ["Gym", "Pool"]
  },
  {
    id: 4,
    title: "Cozy Studio near University",
    price: 1100,
    location: "University Heights",
    type: "Studio",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    beds: 1,
    baths: 1,
    roommates: 0,
    tags: ["Student Friendly", "Wifi"]
  },
  {
    id: 5,
    title: "Spacious Room in Victorian Home",
    price: 850,
    location: "Historic District",
    type: "Private Room",
    image: "https://images.unsplash.com/photo-1512918760383-56453715e1c8?auto=format&fit=crop&q=80&w=800",
    beds: 1,
    baths: 1.5,
    roommates: 3,
    tags: ["Vintage", "Large Kitchen"]
  },
  {
    id: 6,
    title: "Minimalist Apartment Downtown",
    price: 1400,
    location: "Downtown, Metro City",
    type: "Entire Apartment",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800",
    beds: 1,
    baths: 1,
    roommates: 0,
    isNew: true,
    tags: ["Modern", "Gym"]
  }
];

export default function Listings() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              
              {/* Price Range */}
              <div className="space-y-4 mb-6">
                <label className="text-sm font-medium">Price Range</label>
                <Slider defaultValue={[500, 2000]} max={5000} step={100} className="py-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$500</span>
                  <span>$2,000+</span>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium">Property Type</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="private-room" />
                    <label htmlFor="private-room" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Private Room
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shared-room" />
                    <label htmlFor="shared-room" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Shared Room
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="entire-place" />
                    <label htmlFor="entire-place" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Entire Place
                    </label>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium">Amenities</label>
                <div className="space-y-2">
                  {['Furnished', 'Pet Friendly', 'Wifi', 'AC', 'Parking', 'Laundry'].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={amenity.toLowerCase().replace(' ', '-')} />
                      <label htmlFor={amenity.toLowerCase().replace(' ', '-')} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="w-full">Apply Filters</Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by city, neighborhood, or zip..." className="pl-9 w-full md:max-w-md" />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">6</span> results
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LISTINGS.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
               <Button variant="outline" size="lg" className="w-full md:w-auto">Load More Listings</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
