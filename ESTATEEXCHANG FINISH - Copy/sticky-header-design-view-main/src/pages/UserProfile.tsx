import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { BadgeCheck, MapPin, Calendar, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  location: string;
  phone: string;
  joinDate: string;
  bio: string;
  listings: any[];
  reviews: any[];
}

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    // This should be replaced with actual API call
    const fetchUser = async () => {
      try {
        // Simulated API response
        const mockUser: UserData = {
          id: id || '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '',
          isVerified: true,
          location: 'New York, NY',
          phone: '+1 (555) 123-4567',
          joinDate: 'January 2024',
          bio: 'Experienced real estate professional with a passion for helping people find their dream homes.',
          listings: [],
          reviews: []
        };

        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Header */}
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.isVerified && (
                <BadgeCheck className="h-6 w-6 text-[hsl(142,64%,38%)]" />
              )}
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {user.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{user.bio}</p>
          </div>
        </div>

        <Tabs defaultValue="listings" className="mt-8">
          <TabsList>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="listings" className="mt-4">
            {user.listings.length === 0 ? (
              <p className="text-gray-500">No listings yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Listing cards would go here */}
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            {user.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {/* Review cards would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile; 