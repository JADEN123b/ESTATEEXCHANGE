import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import BackButton from '../components/BackButton';
import PropertyPost from '../components/PropertyPost';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MapPin, MessageCircle, Plus, User, UserPlus, Star, Image, Camera, Link as LinkIcon, StarHalf } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import reviewService, { Review } from '@/lib/api/review.service';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileStats {
  listings: number;
  followers: number;
  following: number;
}

interface Post {
  id: string;
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  location?: string;
  bio?: string;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  stats: ProfileStats;
  reviews: Review[];
  posts?: Post[];
  averageRating: number;
  totalReviews: number;
  isVerified?: boolean;
}

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isFollowing, setIsFollowing] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [newPost, setNewPost] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (storedUser && storedUser.id) {
      const userProfile: UserProfile = {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        avatar: storedUser.avatar || '/placeholder.svg',
        coverPhoto: storedUser.coverPhoto || '/cover-placeholder.jpg',
        location: storedUser.location || 'Location not set',
        bio: storedUser.bio || 'No bio available',
        isCurrentUser: true,
        stats: {
          listings: storedUser.listings || 0,
          followers: storedUser.followers || 0,
          following: storedUser.following || 0
        },
        reviews: [],
        posts: storedUser.posts || [],
        averageRating: 0,
        totalReviews: 0,
        isVerified: storedUser.isVerified || false
      };
      
      setUser(userProfile);
    } else {
      toast({
        title: "User not found",
        description: "Please log in to view your profile",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (user?.id) {
        try {
          const response = await reviewService.getUserReviews(user.id);
          setReviews(response.reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          toast({
            title: "Error",
            description: "Failed to load reviews",
            variant: "destructive"
          });
        }
      }
    };

    fetchReviews();
  }, [user?.id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You unfollowed ${user?.name}` : `You are now following ${user?.name}`,
    });
  };

  const handleMessage = () => {
    navigate(`/messages?user=${user?.id}`);
  };

  const handleSubmitReview = async () => {
    if (!user?.id || !rating || !reviewComment.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a rating and a comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewService.createReview({
        userId: user.id,
        rating,
        comment: reviewComment,
        type: 'buyer', // or 'seller' or 'agent' based on context
        images: reviewImages
      });

      setRating(0);
      setReviewComment('');
      setReviewImages([]);
      
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });

      // Refresh reviews
      const response = await reviewService.getUserReviews(user.id);
      setReviews(response.reviews);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReviewImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Please write something to post",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0
    };

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        posts: [post, ...(prev.posts || [])]
      };
    });

    setNewPost('');
    toast({
      title: "Success",
      description: "Post created successfully"
    });
  };
  
  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-100">
          <SocialHeader currentPage="profile" />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading profile...</div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="profile" />
        
        <main className="relative">
          {/* Cover Photo */}
          <div className="h-[300px] w-full relative bg-gradient-to-b from-green-600 to-green-700">
            {user.coverPhoto && (
              <img
                src={user.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {user.isCurrentUser && (
              <Button
                variant="outline"
                className="absolute bottom-4 right-4 bg-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Cover
              </Button>
            )}
          </div>

          <div className="container mx-auto px-4">
            {/* Profile Header */}
            <div className="relative -mt-[96px] mb-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-8">
                <Avatar className="h-[168px] w-[168px] ring-4 ring-white">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                <div className="flex gap-4">
                  {user.isCurrentUser ? (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        className={isFollowing ? "" : "bg-green-600 hover:bg-green-700"}
                        onClick={handleFollow}
                      >
                        {isFollowing ? (
                          <>
                            <User className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleMessage}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-6 border-t border-b border-gray-200 bg-white">
                <div className="container flex justify-center lg:justify-start gap-8 py-3">
                  <div className="text-center">
                    <span className="font-semibold">{user.stats.listings}</span>
                    <span className="text-gray-500 ml-1">Listings</span>
                  </div>
                  <div className="text-center">
                    <span className="font-semibold">{user.stats.followers}</span>
                    <span className="text-gray-500 ml-1">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="font-semibold">{user.stats.following}</span>
                    <span className="text-gray-500 ml-1">Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {user.posts?.filter(post => post.images).map((post) => (
                        post.images?.map((image, index) => (
                          <img
                            key={`${post.id}-${index}`}
                            src={image}
                            alt=""
                            className="aspect-square object-cover rounded-md"
                          />
                        ))
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Reviews
                      <Badge variant="secondary" className="text-lg">
                        {user.averageRating?.toFixed(1) || 0} ⭐
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {user.totalReviews || 0} total reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                        const percentage = (reviews.length > 0 ? (count / reviews.length) * 100 : 0).toFixed(0);
                        
                        return (
                          <div key={stars} className="flex items-center gap-2">
                            <div className="w-12 text-sm">{stars} stars</div>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm text-right">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                {user.isCurrentUser && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="mb-4"
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                              <Button variant="outline" className="text-green-600">
                                <Image className="h-4 w-4 mr-2" />
                                Photo
                              </Button>
                            </div>
                            <Button
                              onClick={handleCreatePost}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Write Review Section */}
                {!user.isCurrentUser && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                      <CardDescription>Share your experience with {user.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant="ghost"
                                size="sm"
                                className={`p-0 hover:bg-transparent ${
                                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                onClick={() => setRating(star)}
                              >
                                <Star className="h-8 w-8 fill-current" />
                              </Button>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">
                            {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
                          </p>
                        </div>

                        <Textarea
                          placeholder="Write your review here..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="min-h-[100px]"
                        />

                        <div>
                          <Label htmlFor="images">Add Photos</Label>
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-1"
                          />
                          {reviewImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {reviewImages.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Review image ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6"
                                    onClick={() => removeImage(index)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || !rating || !reviewComment.trim()}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Posts */}
                <div className="space-y-6">
                  {user.posts && user.posts.length > 0 ? (
                    user.posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{user.name}</CardTitle>
                              <CardDescription>
                                {format(new Date(post.createdAt), 'MMM d, yyyy')}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{post.content}</p>
                          {post.images && (
                            <div className="mt-4 grid gap-4">
                              {post.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt=""
                                  className="rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t">
                          <div className="flex justify-between w-full">
                            <Button variant="ghost" className="text-gray-600">
                              👍 {post.likes}
                            </Button>
                            <Button variant="ghost" className="text-gray-600">
                              💬 {post.comments}
                            </Button>
                            <Button variant="ghost" className="text-gray-600">
                              ↗️ {post.shares}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8">
                        <p className="text-center text-gray-500">No posts yet</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{review.reviewerId}</CardTitle>
                              <CardDescription>
                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => {
                              const value = index + 1;
                              const filled = value <= review.rating;
                              const half = value - 0.5 === review.rating;
                              
                              return (
                                <span key={index} className="text-yellow-400">
                                  {half ? (
                                    <StarHalf className="h-5 w-5 fill-current" />
                                  ) : (
                                    <Star className={`h-5 w-5 ${filled ? 'fill-current' : ''}`} />
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-4">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" onClick={() => reviewService.likeReview(review.id)}>
                            👍 {review.likes}
                          </Button>
                          {review.replies && review.replies.length > 0 && (
                            <span className="text-sm text-gray-500">
                              {review.replies.length} replies
                            </span>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Profile;
