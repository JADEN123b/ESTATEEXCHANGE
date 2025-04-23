import React, { useState, useEffect } from 'react';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import BackButton from '../components/BackButton';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, Users, TrendingUp, BarChart } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  reach: string;
  status: 'active' | 'pending' | 'expired';
  startDate?: Date;
  endDate?: Date;
  stats?: {
    views: number;
    clicks: number;
    inquiries: number;
    conversion: number;
  };
  type: 'basic' | 'premium' | 'featured';
  cta: string;
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Premium Property Listing',
    description: 'Get your property featured at the top of search results',
    image: '/placeholder.svg',
    price: 99.99,
    duration: 30,
    reach: '50,000+ potential buyers',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    stats: {
      views: 1200,
      clicks: 350,
      inquiries: 45,
      conversion: 12.8
    },
    type: 'premium',
    cta: 'Boost Your Listing'
  },
  {
    id: '2',
    title: 'Featured Property Ad',
    description: 'Highlight your property in the featured section',
    image: '/placeholder.svg',
    price: 149.99,
    duration: 60,
    reach: '100,000+ potential buyers',
    status: 'pending',
    type: 'featured',
    cta: 'Feature Property'
  },
  {
    id: '3',
    title: 'Basic Listing Boost',
    description: 'Increase visibility of your property listing',
    image: '/placeholder.svg',
    price: 49.99,
    duration: 15,
    reach: '25,000+ potential buyers',
    status: 'expired',
    type: 'basic',
    cta: 'Start Basic Boost'
  }
];

const Ads: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [filter, setFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Ad>>({
    type: 'basic',
    status: 'pending'
  });
  const [startDate, setStartDate] = useState<Date>();
  const { toast } = useToast();

  const handleCreateAd = () => {
    if (!newAd.title || !newAd.description || !newAd.price || !startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ad: Ad = {
      id: Date.now().toString(),
      title: newAd.title,
      description: newAd.description,
      image: newAd.image || '/placeholder.svg',
      price: Number(newAd.price),
      duration: newAd.type === 'basic' ? 15 : newAd.type === 'premium' ? 30 : 60,
      reach: newAd.type === 'basic' ? '25,000+ potential buyers' :
             newAd.type === 'premium' ? '50,000+ potential buyers' :
             '100,000+ potential buyers',
      status: 'pending',
      startDate: startDate,
      endDate: new Date(startDate.getTime() + (newAd.type === 'basic' ? 15 : newAd.type === 'premium' ? 30 : 60) * 24 * 60 * 60 * 1000),
      type: newAd.type as 'basic' | 'premium' | 'featured',
      cta: newAd.type === 'basic' ? 'Start Basic Boost' :
           newAd.type === 'premium' ? 'Boost Your Listing' :
           'Feature Property'
    };

    setAds(prevAds => [...prevAds, ad]);
    setShowCreateDialog(false);
    setNewAd({
      type: 'basic',
      status: 'pending'
    });
    setStartDate(undefined);

    toast({
      title: "Ad created successfully",
      description: "Your ad has been submitted for review"
    });
  };

  const handleActivateAd = (adId: string) => {
    setAds(prevAds =>
      prevAds.map(ad =>
        ad.id === adId
          ? { ...ad, status: 'active', startDate: new Date() }
          : ad
      )
    );

    toast({
      title: "Ad activated",
      description: "Your ad is now live and reaching potential buyers"
    });
  };

  const filteredAds = ads.filter(ad => {
    if (filter === 'all') return true;
    return ad.status === filter;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="ads" />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto relative">
            <BackButton />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Advertising Options</h1>
                <p className="text-gray-600">Promote your properties and reach more potential buyers</p>
              </div>
              <Button 
                className="bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)] w-full md:w-auto"
                onClick={() => setShowCreateDialog(true)}
              >
                Create New Ad
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter ads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ads</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
                <Card key={ad.id} className="relative flex flex-col">
                  <img 
                    src={ad.image} 
                    alt={ad.title} 
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      ad.status === 'active' ? 'bg-green-500' :
                      ad.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  >
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </Badge>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl md:text-2xl">{ad.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base">${ad.price.toFixed(2)} / {ad.duration} days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm md:text-base">{ad.description}</p>
                    <div className="text-xs md:text-sm text-gray-500">
                      <p className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        {ad.reach}
                      </p>
                      {ad.stats && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {ad.stats.views} views
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart className="h-4 w-4" />
                            {ad.stats.conversion}% conversion
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {ad.status === 'pending' ? (
                      <Button 
                        className="w-full bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)]"
                        onClick={() => handleActivateAd(ad.id)}
                      >
                        Activate Ad
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline">
                        {ad.cta}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredAds.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No ads found matching your criteria</p>
              </div>
            )}
          </div>
        </main>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="w-[95vw] max-w-[425px] p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl">Create New Ad</DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Create a new advertising campaign for your property
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Ad Title"
                  value={newAd.title || ''}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Ad Description"
                  value={newAd.description || ''}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Price"
                  value={newAd.price || ''}
                  onChange={(e) => setNewAd({ ...newAd, price: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={newAd.type}
                  onValueChange={(value) => setNewAd({ ...newAd, type: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (15 days)</SelectItem>
                    <SelectItem value="premium">Premium (30 days)</SelectItem>
                    <SelectItem value="featured">Featured (60 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-2">Start Date</p>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border w-full"
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                className="bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)] w-full sm:w-auto"
                onClick={handleCreateAd}
              >
                Create Ad
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default Ads;
