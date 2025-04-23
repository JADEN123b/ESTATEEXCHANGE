import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Share2, MapPin, Bed, Bath, Square, Filter, Home } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from '@/components/ui/label';

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  status: 'available' | 'sold' | 'pending';
  agent: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  isFavorite?: boolean;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    description: 'Beautiful modern villa with stunning views',
    location: 'Beverly Hills, CA',
    price: 2500000,
    type: 'house',
    bedrooms: 5,
    bathrooms: 4,
    size: 4500,
    images: ['/placeholder.svg'],
    amenities: ['Pool', 'Garden', 'Garage'],
    status: 'available',
    agent: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@example.com',
      avatar: '/placeholder.svg'
    }
  },
  // Add more mock properties here
];

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sortBy, setSortBy] = useState('price-low');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteProperties');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleFavorite = (propertyId: string) => {
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, isFavorite: !property.isFavorite }
          : property
      )
    );

    toast({
      title: favorites.includes(propertyId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(propertyId)
        ? "Property removed from your favorites"
        : "Property added to your favorites"
    });
  };

  const handleShare = (property: Property) => {
    // Implement share functionality
    toast({
      title: "Sharing property",
      description: `Sharing ${property.title} with your network`
    });
  };

  const handleContact = (property: Property) => {
    // Implement contact functionality
    toast({
      title: "Contact agent",
      description: `Connecting you with ${property.agent.name}`
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const FilterMenu = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="Min"
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => handleFilterChange('propertyType', value)}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => handleFilterChange('bedrooms', value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </Select>
      </div>
    </div>
  );

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === 'all' || property.type === propertyType;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'size':
        return b.size - a.size;
      case 'beds':
        return b.bedrooms - a.bedrooms;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 sm:pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Desktop Filters */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Filters</h2>
                <FilterMenu />
              </div>
            </div>

            {/* Mobile Filters Button */}
            <div className="md:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterMenu />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Properties Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                          favorites.includes(property.id) ? 'text-red-500' : 'text-gray-600'
                        }`}
                        onClick={() => handleFavorite(property.id)}
                      >
                        <Heart className="h-5 w-5" fill={favorites.includes(property.id) ? 'currentColor' : 'none'} />
                      </Button>
                      <Badge
                        className={`absolute top-2 left-2 ${
                          property.status === 'sold' ? 'bg-red-500' :
                          property.status === 'pending' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">{property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{property.bathrooms} baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{property.size} sqft</span>
                        </div>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        ${property.price.toLocaleString()}
                      </p>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleShare(property)} className="w-full sm:w-auto">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        className="w-full sm:w-auto bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)]"
                        onClick={() => handleContact(property)}
                      >
                        Contact Agent
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {sortedProperties.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
