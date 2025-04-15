import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ChevronUp, Coffee, Filter, Heart, Plus, Search, 
  ShoppingCart, Trash2, UtensilsCrossed, X, Calendar, Sparkles 
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";

// Types
interface Meal {
  id: string;
  name: string;
  description: string;
  category: string;
  cost_per_serving: number;
  ingredients: string[];
  preparation_time: number;
  image_url?: string;
  is_favorite: boolean;
  tags: string[];
  user_id: string;
}

interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  meals: PlannedMeal[];
  total_cost: number;
  user_id: string;
}

interface PlannedMeal {
  meal_id: string;
  day: string;
  meal_time: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
}

// Demo data 
const DEMO_MEALS: Meal[] = [
  {
    id: "1",
    name: "Budget Pasta Primavera",
    description: "A quick and affordable pasta dish with seasonal vegetables.",
    category: "lunch",
    cost_per_serving: 2.50,
    ingredients: ["Pasta", "Mixed vegetables", "Olive oil", "Garlic", "Salt", "Pepper"],
    preparation_time: 20,
    image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1740&auto=format&fit=crop",
    is_favorite: true,
    tags: ["quick", "vegetarian", "budget-friendly"],
    user_id: ""
  },
  {
    id: "2",
    name: "Student Ramen Upgrade",
    description: "Transform instant ramen into a filling meal with simple add-ins.",
    category: "dinner",
    cost_per_serving: 1.75,
    ingredients: ["Instant ramen", "Egg", "Green onions", "Frozen vegetables", "Soy sauce"],
    preparation_time: 10,
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1160&auto=format&fit=crop",
    is_favorite: false,
    tags: ["quick", "easy", "budget-friendly"],
    user_id: ""
  },
  {
    id: "3",
    name: "Breakfast Oatmeal Bowl",
    description: "Nutrient-packed breakfast that's customizable and affordable.",
    category: "breakfast",
    cost_per_serving: 1.25,
    ingredients: ["Oats", "Milk or water", "Banana", "Cinnamon", "Honey"],
    preparation_time: 5,
    image_url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1256&auto=format&fit=crop",
    is_favorite: true,
    tags: ["quick", "healthy", "breakfast"],
    user_id: ""
  },
  {
    id: "4",
    name: "Budget Bean Burrito",
    description: "Filling and protein-rich burrito that's easy on your wallet.",
    category: "lunch",
    cost_per_serving: 1.95,
    ingredients: ["Tortillas", "Canned beans", "Rice", "Cheese", "Salsa"],
    preparation_time: 15,
    image_url: "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?q=80&w=1065&auto=format&fit=crop",
    is_favorite: false,
    tags: ["protein", "budget-friendly", "filling"],
    user_id: ""
  }
];

// Empty state component
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

// Meal card component
const MealCard = ({ 
  meal, 
  onAddToWeekly, 
  onToggleFavorite 
}: { 
  meal: Meal, 
  onAddToWeekly: (meal: Meal) => void, 
  onToggleFavorite: (id: string, favorite: boolean) => void 
}) => {
  // Generate a consistent color based on meal name
  const getColorForMeal = (name: string) => {
    const colors = [
      "from-amber-900/40 to-amber-700/40", // Earthy tones for pasta
      "from-blue-900/40 to-blue-700/40",   // Blue tones for seafood/ramen
      "from-green-900/40 to-green-700/40", // Green tones for veggie dishes
      "from-red-900/40 to-red-700/40",     // Red tones for meat dishes
      "from-purple-900/40 to-purple-700/40", // Purple for exotic dishes
    ];
    
    // Simple hash function to get consistent color for same meal name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full border-gray-700/50 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/80 transition-colors flex flex-col">
        <div className={`relative h-24 overflow-hidden bg-gradient-to-r ${getColorForMeal(meal.name)}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Badge className="mb-1 bg-gray-900/60 text-white border-gray-700">
                {meal.category.toUpperCase()}
              </Badge>
              <div className="text-xs text-white font-medium">
                {meal.preparation_time} min prep
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-gray-900/40 backdrop-blur-sm text-white hover:bg-gray-800/60 border border-gray-700/30"
            onClick={() => onToggleFavorite(meal.id, !meal.is_favorite)}
          >
            <Heart 
              className={cn(
                "h-4 w-4", 
                meal.is_favorite ? "fill-red-400 text-red-400" : "text-gray-400"
              )} 
            />
          </Button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-white line-clamp-1">{meal.name}</h3>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/20">
              ${meal.cost_per_serving.toFixed(2)}
            </Badge>
          </div>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{meal.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {meal.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs bg-gray-700/30 border-gray-700/50 text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-gray-300 mb-3">
            <div className="flex justify-between mb-1">
              <span>Ingredients:</span>
              <span>{meal.ingredients.length} items</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="capitalize">{meal.category}</span>
            </div>
          </div>
          <div className="mt-auto">
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => onAddToWeekly(meal)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Meal Plan
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const MealPlanner = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<PlannedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Load meals from demo data or database
  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('meals')
        //   .select('*')
        //   .eq('user_id', userId);
        
        // if (error) throw error;
        
        // For demo, use the demo meals
        setTimeout(() => {
          setMeals(DEMO_MEALS);
          setFilteredMeals(DEMO_MEALS);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching meals:', error);
        toast({
          title: "Error",
          description: "Failed to load meals. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Filter meals based on search and category
  useEffect(() => {
    let result = [...meals];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        meal => meal.name.toLowerCase().includes(query) || 
                meal.description.toLowerCase().includes(query) ||
                meal.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "favorites") {
        result = result.filter(meal => meal.is_favorite);
      } else {
        result = result.filter(meal => meal.category === activeFilter);
      }
    }
    
    setFilteredMeals(result);
  }, [meals, searchQuery, activeFilter]);

  // Add meal to weekly plan
  const handleAddToWeekly = (meal: Meal) => {
    // In a real app, this would be more sophisticated with day selection
    const newPlannedMeal: PlannedMeal = {
      meal_id: meal.id,
      day: "Monday", // Default for demo
      meal_time: "dinner", // Default for demo
      servings: 1
    };
    
    setWeeklyPlan(prev => [...prev, newPlannedMeal]);
    
    toast({
      title: "Added to meal plan",
      description: `${meal.name} has been added to your meal plan.`,
    });
  };

  // Toggle favorite status
  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    setMeals(prev => 
      prev.map(meal => 
        meal.id === id ? { ...meal, is_favorite: isFavorite } : meal
      )
    );
    
    // In a real app, update in database
    // const updateFavorite = async () => {
    //   const { error } = await supabase
    //     .from('meals')
    //     .update({ is_favorite: isFavorite })
    //     .eq('id', id);
    //   
    //   if (error) {
    //     console.error('Error updating favorite status:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to update favorite status.",
    //       variant: "destructive",
    //     });
    //   }
    // };
    // 
    // updateFavorite();
  };

  return (
    <div className="space-y-6">
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
              placeholder="Search meals by name, ingredients, or tags..."
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
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-gray-700" : ""}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="breakfast" 
                onClick={() => setActiveFilter("breakfast")}
                className={activeFilter === "breakfast" ? "bg-gray-700" : ""}
              >
                Breakfast
              </TabsTrigger>
              <TabsTrigger 
                value="lunch" 
                onClick={() => setActiveFilter("lunch")}
                className={activeFilter === "lunch" ? "bg-gray-700" : ""}
              >
                Lunch
              </TabsTrigger>
              <TabsTrigger 
                value="dinner" 
                onClick={() => setActiveFilter("dinner")}
                className={activeFilter === "dinner" ? "bg-gray-700" : ""}
              >
                Dinner
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                onClick={() => setActiveFilter("favorites")}
                className={activeFilter === "favorites" ? "bg-gray-700" : ""}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>

      {/* AI meal recommender notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-2"
      >
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Personalized AI Recommendations</h3>
            <p className="text-xs text-gray-300">
              Soon, our AI will recommend meals based on your budget, location, dietary needs, and preferences!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Meal list */}
        <div className="md:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center text-white">
                  <UtensilsCrossed className="h-5 w-5 mr-2 text-pink-400" />
                  Budget-Friendly Meals
                </h2>
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1.5" />
                  Add New Meal
                </Button>
              </div>

              {isLoading ? (
                // Loading state
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-gray-700/50 bg-gray-800/30 overflow-hidden">
                      <Skeleton className="h-24 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredMeals.length > 0 ? (
                // Meals grid
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredMeals.map(meal => (
                      <MealCard 
                        key={meal.id}
                        meal={meal}
                        onAddToWeekly={handleAddToWeekly}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                // No meals matching filters
                <EmptyState 
                  message={searchQuery 
                    ? `No meals found matching "${searchQuery}". Try a different search term.` 
                    : "No meals found for the selected filter."
                  }
                  icon={<Coffee className="h-6 w-6 text-gray-400" />}
                />
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right column - Weekly plan */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center text-white">
                  <ShoppingCart className="h-5 w-5 mr-2 text-green-400" />
                  Weekly Plan
                </h2>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/20">
                  Total: $14.50
                </Badge>
              </div>

              {weeklyPlan.length > 0 ? (
                <div className="space-y-3">
                  {/* Week summary goes here */}
                  <p className="text-sm text-white mb-2">Your planned meals for the week:</p>
                  
                  {/* This would render the planned meals */}
                  {weeklyPlan.map((planned, index) => {
                    const meal = meals.find(m => m.id === planned.meal_id);
                    if (!meal) return null;
                    
                    return (
                      <motion.div
                        key={`${planned.meal_id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-2 rounded-md bg-gray-700/30 border border-gray-700/50"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-md mr-3 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center`}>
                            <UtensilsCrossed className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{meal.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs px-1 py-0 h-4 bg-gray-700 border-gray-600 text-gray-300"
                              >
                                {planned.day}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs px-1 py-0 h-4 bg-gray-700 border-gray-600 capitalize text-gray-300"
                              >
                                {planned.meal_time}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-xs">
                            ${(meal.cost_per_serving * planned.servings).toFixed(2)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-400"
                            onClick={() => setWeeklyPlan(prev => prev.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  <Button className="w-full mt-4 text-white">
                    Generate Shopping List
                  </Button>
                </div>
              ) : (
                <EmptyState 
                  message="Your meal plan is empty. Add meals from the list to start planning your week."
                  icon={<ShoppingCart className="h-6 w-6 text-gray-400" />}
                />
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner; 