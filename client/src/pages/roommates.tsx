import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RoommateCard } from "@/components/roommate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal, Filter } from "lucide-react";

const ROOMMATES = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 26,
    occupation: "UX Designer",
    location: "Downtown",
    budget: 1200,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    tags: ["Early Bird", "Non-Smoker", "Yoga"],
    bio: "Hi! I'm a clean and organized designer looking for a sunny spot downtown. I love cooking and having occasional game nights.",
    matchPercentage: 95
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 28,
    occupation: "Software Engineer",
    location: "Tech Park",
    budget: 1500,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    tags: ["Gamer", "Night Owl", "Pet Friendly"],
    bio: "Chill software dev. I come with a very cute golden retriever named Max. Looking for a place with some outdoor space.",
    matchPercentage: 88
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    age: 24,
    occupation: "Grad Student",
    location: "University District",
    budget: 900,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    tags: ["Studious", "Quiet", "Vegetarian"],
    bio: "Architecture student finishing my masters. I spend most of my time at the studio or reading. Looking for a quiet, respectful home.",
    matchPercentage: 92
  },
  {
    id: 4,
    name: "David Kim",
    age: 30,
    occupation: "Chef",
    location: "Culinary District",
    budget: 1300,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    tags: ["Foodie", "Social", "Clean"],
    bio: "Professional chef which means I cook... a lot! Happy to share meals. Looking for roommates who appreciate good food and wine.",
    matchPercentage: 85
  },
  {
    id: 5,
    name: "Aisha Patel",
    age: 27,
    occupation: "Marketing Manager",
    location: "West End",
    budget: 1100,
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
    tags: ["Traveler", "Extrovert", "Music"],
    bio: "Always planning my next trip! When I'm home, I love hosting dinner parties and exploring the local music scene.",
    matchPercentage: 78
  },
  {
    id: 6,
    name: "Tom Wilson",
    age: 25,
    occupation: "Teacher",
    location: "Suburbs",
    budget: 850,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    tags: ["Outdoorsy", "Morning Person", "Plants"],
    bio: "High school history teacher. In my free time I'm hiking or tending to my indoor jungle. Looking for a green-friendly space.",
    matchPercentage: 82
  }
];

export default function Roommates() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Find Your Perfect Roommate</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with people who share your lifestyle, interests, and living habits.
          </p>
          
          <div className="max-w-xl mx-auto bg-white p-2 rounded-xl shadow-lg border border-border flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, interests, or location..." className="pl-9 border-none shadow-none focus-visible:ring-0" />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-display font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Budget (Monthly)</label>
                  <Slider defaultValue={[800, 1500]} max={3000} step={100} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$800</span>
                    <span>$3,000+</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Age Range</label>
                  <Slider defaultValue={[22, 35]} max={50} min={18} step={1} className="py-4" />
                   <div className="flex justify-between text-xs text-muted-foreground">
                    <span>18</span>
                    <span>50+</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Gender Preference</label>
                  <div className="space-y-2">
                    {['Male', 'Female', 'Non-binary', 'No Preference'].map((g) => (
                      <div key={g} className="flex items-center space-x-2">
                        <Checkbox id={g.toLowerCase().replace(' ', '-')} />
                        <label htmlFor={g.toLowerCase().replace(' ', '-')} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {g}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Lifestyle</label>
                  <div className="space-y-2">
                    {['Early Bird', 'Night Owl', 'Pet Friendly', 'Smoker', 'Student'].map((l) => (
                      <div key={l} className="flex items-center space-x-2">
                        <Checkbox id={l.toLowerCase().replace(' ', '-')} />
                        <label htmlFor={l.toLowerCase().replace(' ', '-')} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {l}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ROOMMATES.map(roommate => (
                <RoommateCard key={roommate.id} roommate={roommate} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
