import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star, 
  Filter, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  Tag, 
  Bookmark,
  ExternalLink,
  Sparkles 
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";
import { cn } from "../../lib/utils";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Types
interface Gig {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "part-time" | "freelance" | "one-time" | "internship";
  category: string;
  payRate: number;
  payType: "hourly" | "fixed" | "monthly";
  description: string;
  requirements: string[];
  postedDate: string;
  applicationDeadline?: string;
  isRemote: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  savedByUser: boolean;
  skills: string[];
  estimatedTime?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Categories
const GIG_CATEGORIES = [
  "Technology",
  "Design",
  "Writing",
  "Customer Service",
  "Marketing",
  "Education",
  "Research",
  "Data Entry",
  "Delivery",
  "Event Staff"
];

// Mock data
const DEMO_GIGS: Gig[] = [
  {
    id: "1",
    title: "Website QA Testing",
    company: "TechStart Solutions",
    location: "Remote",
    type: "freelance",
    category: "Technology",
    payRate: 20,
    payType: "hourly",
    description: "Test our client's website for bugs, usability issues, and provide detailed reports. Perfect for CS students!",
    requirements: ["Basic HTML/CSS knowledge", "Attention to detail", "Good communication skills"],
    postedDate: "2023-09-15",
    applicationDeadline: "2023-10-15", 
    isRemote: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 124,
    savedByUser: false,
    skills: ["Web Testing", "Bug Reporting", "UI/UX"],
    estimatedTime: "5-10 hours/week",
    difficulty: "beginner"
  },
  {
    id: "2",
    title: "Campus Brand Ambassador",
    company: "Spotify",
    location: "On Campus",
    type: "part-time",
    category: "Marketing",
    payRate: 15,
    payType: "hourly",
    description: "Promote Spotify Premium on campus through events, social media, and direct engagement with fellow students.",
    requirements: ["Active student status", "Social media presence", "Event organization experience"],
    postedDate: "2023-09-10",
    isRemote: false,
    isFeatured: true,
    rating: 4.2,
    reviewCount: 78,
    savedByUser: true,
    skills: ["Social Media", "Event Planning", "Communication"],
    estimatedTime: "8-12 hours/week",
    difficulty: "beginner"
  },
  {
    id: "3",
    title: "Research Data Analysis",
    company: "University Research Lab",
    location: "Hybrid",
    type: "part-time",
    category: "Research",
    payRate: 18,
    payType: "hourly",
    description: "Assist with analyzing research data for a psychology study on student financial habits.",
    requirements: ["Statistics knowledge", "Excel or SPSS skills", "Psychology coursework preferred"],
    postedDate: "2023-09-05",
    applicationDeadline: "2023-09-25",
    isRemote: false,
    isFeatured: false,
    rating: 4.5,
    reviewCount: 42,
    savedByUser: false,
    skills: ["Data Analysis", "Research", "Statistics"],
    estimatedTime: "10-15 hours/week",
    difficulty: "intermediate"
  },
  {
    id: "4",
    title: "Content Writing for Student Blog",
    company: "EduToday",
    location: "Remote",
    type: "freelance",
    category: "Writing",
    payRate: 50,
    payType: "fixed",
    description: "Write articles about student life, financial tips, and career advice for our popular student blog.",
    requirements: ["Strong writing skills", "Understanding of student issues", "SEO knowledge a plus"],
    postedDate: "2023-09-12",
    isRemote: true,
    isFeatured: false,
    rating: 4.0,
    reviewCount: 56,
    savedByUser: false,
    skills: ["Content Writing", "SEO", "Research"],
    estimatedTime: "3-5 hours per article",
    difficulty: "beginner"
  },
  {
    id: "5",
    title: "Social Media Content Creation",
    company: "Local Coffee Shop",
    location: "Hybrid",
    type: "part-time",
    category: "Marketing",
    payRate: 16,
    payType: "hourly",
    description: "Create engaging social media content for a popular local coffee shop near campus.",
    requirements: ["Photography skills", "Social media expertise", "Creative mindset"],
    postedDate: "2023-09-08",
    isRemote: false,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 31,
    savedByUser: true,
    skills: ["Social Media", "Photography", "Content Creation"],
    estimatedTime: "5-10 hours/week",
    difficulty: "beginner"
  },
  {
    id: "6",
    title: "Python Tutoring",
    company: "Independent",
    location: "Remote",
    type: "freelance",
    category: "Education",
    payRate: 25,
    payType: "hourly",
    description: "Tutor students in Python programming basics. Set your own hours and work remotely.",
    requirements: ["Strong Python skills", "Teaching experience", "Patience"],
    postedDate: "2023-09-14",
    isRemote: true,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 47,
    savedByUser: false,
    skills: ["Python", "Teaching", "Programming"],
    estimatedTime: "Flexible",
    difficulty: "intermediate"
  }
];

// Filter component
const GigFilters = ({ 
  onFilterChange, 
  categories 
}: { 
  onFilterChange: (filters: any) => void, 
  categories: string[] 
}) => {
  const [payRange, setPayRange] = useState<[number, number]>([0, 50]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const handleFilterUpdate = () => {
    onFilterChange({
      payRange,
      categories: selectedCategories,
      remoteOnly,
      difficulty
    });
  };

  useEffect(() => {
    handleFilterUpdate();
  }, [payRange, selectedCategories, remoteOnly, difficulty]);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-400" />
            Filters
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs text-gray-400 hover:text-white"
            onClick={() => {
              setPayRange([0, 50]);
              setSelectedCategories([]);
              setRemoteOnly(false);
              setDifficulty(null);
            }}
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pay Range */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm text-white">Pay Rate</Label>
            <span className="text-sm text-gray-400">
              ${payRange[0]} - ${payRange[1]}+
            </span>
          </div>
          <Slider
            defaultValue={[0, 50]}
            max={50}
            step={1}
            value={payRange}
            onValueChange={(value) => setPayRange(value as [number, number])}
            className="py-2"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-sm text-white">Categories</Label>
          <Select onValueChange={(value) => {
            if (value && !selectedCategories.includes(value)) {
              setSelectedCategories([...selectedCategories, value]);
            }
          }}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map(category => (
              <Badge 
                key={category} 
                variant="outline"
                className="bg-gray-700/50 text-white px-2 py-1 flex items-center gap-1"
              >
                {category}
                <X 
                  className="h-3 w-3 text-gray-400 hover:text-white cursor-pointer" 
                  onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Remote only */}
        <div className="flex items-center justify-between">
          <Label className="text-sm text-white">Remote only</Label>
          <Switch 
            checked={remoteOnly} 
            onCheckedChange={setRemoteOnly}
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-sm text-white">Difficulty Level</Label>
          <div className="flex items-center space-x-2">
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <Badge 
                key={level}
                variant="outline"
                className={cn(
                  "cursor-pointer px-3 py-1 capitalize",
                  difficulty === level 
                    ? "bg-blue-900/50 text-blue-300 border-blue-700" 
                    : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                )}
                onClick={() => setDifficulty(difficulty === level ? null : level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Gig Card Component
const GigCard = ({ 
  gig, 
  onSave 
}: { 
  gig: Gig, 
  onSave: (id: string, saved: boolean) => void 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/80 transition-colors">
        <CardHeader className="pb-2 relative">
          {gig.isFeatured && (
            <Badge className="absolute right-4 top-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-white">{gig.title}</h3>
              <p className="text-sm text-gray-400">{gig.company}</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-400 space-x-2">
            <Badge variant="outline" className={cn(
              "px-2 py-0.5",
              gig.type === "part-time" && "bg-blue-900/30 text-blue-400 border-blue-800/50",
              gig.type === "freelance" && "bg-purple-900/30 text-purple-400 border-purple-800/50",
              gig.type === "one-time" && "bg-green-900/30 text-green-400 border-green-800/50",
              gig.type === "internship" && "bg-amber-900/30 text-amber-400 border-amber-800/50"
            )}>
              {gig.type.replace('-', ' ')}
            </Badge>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {gig.location}
            </div>
            {gig.estimatedTime && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {gig.estimatedTime}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-sm text-gray-300">
          <p className="line-clamp-2 mb-3">{gig.description}</p>
          
          <div className="flex items-center mb-3">
            <DollarSign className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">
              ${gig.payRate}{gig.payType === 'hourly' ? '/hr' : gig.payType === 'monthly' ? '/month' : ' fixed'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {gig.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs bg-gray-700/30 border-gray-700/50 text-gray-300">
                {skill}
              </Badge>
            ))}
            {gig.skills.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-700/30 border-gray-700/50 text-gray-300">
                +{gig.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span>{gig.rating}</span>
              <span className="mx-1">•</span>
              <span>{gig.reviewCount} reviews</span>
            </div>
            <div>
              Posted {new Date(gig.postedDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <ExternalLink className="h-3 w-3 mr-1.5" />
            Apply Now
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-xs h-8",
              gig.savedByUser ? "text-yellow-400" : "text-gray-400"
            )}
            onClick={() => onSave(gig.id, !gig.savedByUser)}
          >
            <Bookmark className={cn(
              "h-3 w-3 mr-1.5",
              gig.savedByUser && "fill-yellow-400"
            )} />
            {gig.savedByUser ? "Saved" : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ message, icon }: { message: string, icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-64 p-6 rounded-lg border border-gray-700/50 bg-gray-800/30"
  >
    <div className="p-4 rounded-full bg-gray-800/50 mb-4">
      {icon}
    </div>
    <p className="text-gray-400 text-sm text-center">{message}</p>
  </motion.div>
);

// Main Component
const GigMarketplace = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    payRange: [0, 50],
    categories: [] as string[],
    remoteOnly: false,
    difficulty: null as string | null
  });

  // Load gigs
  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would fetch from an API or database
        setTimeout(() => {
          setGigs(DEMO_GIGS);
          setFilteredGigs(DEMO_GIGS);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching gigs:', error);
        toast({
          title: "Error",
          description: "Failed to load gigs. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...gigs];
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        gig => 
          gig.title.toLowerCase().includes(query) || 
          gig.company.toLowerCase().includes(query) ||
          gig.description.toLowerCase().includes(query) ||
          gig.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "saved") {
        result = result.filter(gig => gig.savedByUser);
      } else if (activeTab === "featured") {
        result = result.filter(gig => gig.isFeatured);
      } else {
        result = result.filter(gig => gig.type === activeTab);
      }
    }
    
    // Additional filters
    if (filters.payRange) {
      result = result.filter(
        gig => gig.payRate >= filters.payRange[0] && gig.payRate <= filters.payRange[1]
      );
    }
    
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(gig => filters.categories.includes(gig.category));
    }
    
    if (filters.remoteOnly) {
      result = result.filter(gig => gig.isRemote);
    }
    
    if (filters.difficulty) {
      result = result.filter(gig => gig.difficulty === filters.difficulty);
    }
    
    setFilteredGigs(result);
  }, [gigs, searchQuery, activeTab, filters]);

  // Handle save/bookmark
  const handleSaveGig = (id: string, saved: boolean) => {
    setGigs(gigs.map(gig => 
      gig.id === id ? { ...gig, savedByUser: saved } : gig
    ));
    
    toast({
      title: saved ? "Gig saved" : "Gig removed",
      description: saved 
        ? "This gig has been added to your saved list" 
        : "This gig has been removed from your saved list",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for gigs, skills, or companies..."
              className="pl-9 bg-gray-800/50 border-gray-700/50 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="all">
            <TabsList className="bg-gray-800/50">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-gray-700" : ""}
              >
                All Gigs
              </TabsTrigger>
              <TabsTrigger 
                value="part-time" 
                onClick={() => setActiveTab("part-time")}
                className={activeTab === "part-time" ? "bg-gray-700" : ""}
              >
                Part-time
              </TabsTrigger>
              <TabsTrigger 
                value="freelance" 
                onClick={() => setActiveTab("freelance")}
                className={activeTab === "freelance" ? "bg-gray-700" : ""}
              >
                Freelance
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                onClick={() => setActiveTab("saved")}
                className={activeTab === "saved" ? "bg-gray-700" : ""}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>

      {/* Info notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-2"
      >
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <Briefcase className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Find Side Hustles & Extra Income</h3>
            <p className="text-xs text-gray-300">
              Browse gigs tailored to students - perfect for earning extra money while managing your studies.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left column - Filters */}
        <div className="md:col-span-1">
          <GigFilters 
            onFilterChange={setFilters} 
            categories={GIG_CATEGORIES} 
          />
        </div>

        {/* Right column - Gig listings */}
        <div className="md:col-span-3">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-gray-700/50 bg-gray-800/30">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredGigs.map(gig => (
                  <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    onSave={handleSaveGig} 
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState 
              message={searchQuery || filters.categories.length > 0
                ? "No gigs found matching your filters. Try broadening your search."
                : "No gigs available at the moment. Check back later!"
              }
              icon={<Briefcase className="h-6 w-6 text-gray-400" />}
            />
          )}
        </div>
      </div>
      
      {filteredGigs.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            className="bg-gray-800/50 hover:bg-gray-800 border-gray-700"
          >
            Load More Gigs
          </Button>
        </div>
      )}
    </div>
  );
};

export default GigMarketplace; 