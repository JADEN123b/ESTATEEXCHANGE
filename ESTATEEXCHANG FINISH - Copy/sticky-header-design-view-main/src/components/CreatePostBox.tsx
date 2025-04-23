import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CreatePostBox: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only images (JPG, PNG, GIF) or MP4 videos",
        variant: "destructive"
      });
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setSelectedMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmitPost = () => {
    if (!postContent.trim() && selectedMedia.length === 0) {
      toast({
        title: "Empty post",
        description: "Please enter some content or add media to your post",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically upload the media files to your server
    // and create the post with the uploaded media URLs
    toast({
      title: "Post created",
      description: "Your post has been published successfully"
    });
    
    // Clear the form
    setPostContent('');
    setSelectedMedia([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };
  
  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <textarea
          className="flex-grow p-3 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[hsl(142,64%,38%)]"
          placeholder="What would you like to list?"
          rows={3}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              {selectedMedia[index].type.startsWith('image/') ? (
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={url}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/gif,video/mp4"
          onChange={handleMediaSelect}
        />
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
          <span className="text-sm">Add Media</span>
        </Button>
        
        <Button 
          className="bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)] text-white px-6"
          onClick={handleSubmitPost}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePostBox;
