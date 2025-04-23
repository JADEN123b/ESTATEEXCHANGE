import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import BackButton from '../components/BackButton';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { BadgeCheck, Upload } from 'lucide-react';

type UserType = 'individual' | 'agent' | 'developer';

interface VerificationRequirement {
  id: string;
  label: string;
  description: string;
  accept: string;
  required: boolean;
}

const requirementsByType: Record<UserType, VerificationRequirement[]> = {
  individual: [
    {
      id: 'government_id',
      label: 'Government-issued ID',
      description: 'Upload your passport, driver\'s license, or national ID card',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'proof_of_address',
      label: 'Proof of Address',
      description: 'Upload a utility bill, bank statement, or lease agreement',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'social_media',
      label: 'Social Media Profiles',
      description: 'Provide links to your social media profiles',
      accept: '',
      required: false
    }
  ],
  agent: [
    {
      id: 'professional_license',
      label: 'Professional License',
      description: 'Upload your real estate license or certification',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'business_registration',
      label: 'Business Registration',
      description: 'Upload business registration documents',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'business_address',
      label: 'Business Address Proof',
      description: 'Upload a utility bill or lease agreement for your business location',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    }
  ],
  developer: [
    {
      id: 'company_registration',
      label: 'Company Registration',
      description: 'Upload company registration documents',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'ownership_proof',
      label: 'Proof of Ownership',
      description: 'Upload documents showing ownership or authority',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    },
    {
      id: 'certifications',
      label: 'Industry Certifications',
      description: 'Upload relevant industry certifications',
      accept: '.jpg,.jpeg,.png,.pdf',
      required: true
    }
  ]
};

const Verification: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('individual');
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [links, setLinks] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (requirementId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles(prev => ({
      ...prev,
      [requirementId]: file
    }));
  };

  const handleLinkChange = (requirementId: string, value: string) => {
    setLinks(prev => ({
      ...prev,
      [requirementId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requirements = requirementsByType[userType];
    const missingRequired = requirements.filter(req => {
      if (!req.required) return false;
      if (req.accept) {
        return !files[req.id];
      } else {
        return !links[req.id];
      }
    });

    if (missingRequired.length > 0) {
      toast({
        title: "Missing Required Documents",
        description: `Please provide all required documents: ${missingRequired.map(r => r.label).join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully. We'll review your documents within 2-3 business days.",
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="profile" />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 relative">
            <BackButton />
            
            <div className="text-center mb-8">
              <BadgeCheck className="h-16 w-16 text-[hsl(142,64%,38%)] mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Get Verified</h1>
              <p className="text-gray-600 mt-2">
                Verify your account to build trust and credibility with other users
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <Label className="text-lg font-semibold">Select Your Category</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value: UserType) => setUserType(value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                >
                  <div className={`border rounded-lg p-4 cursor-pointer ${userType === 'individual' ? 'border-[hsl(142,64%,38%)] bg-[hsl(142,64%,95%)]' : ''}`}>
                    <RadioGroupItem value="individual" id="individual" className="sr-only" />
                    <Label htmlFor="individual" className="cursor-pointer">
                      <div className="font-semibold mb-1">Individual User</div>
                      <div className="text-sm text-gray-600">For personal use and property search</div>
                    </Label>
                  </div>
                  <div className={`border rounded-lg p-4 cursor-pointer ${userType === 'agent' ? 'border-[hsl(142,64%,38%)] bg-[hsl(142,64%,95%)]' : ''}`}>
                    <RadioGroupItem value="agent" id="agent" className="sr-only" />
                    <Label htmlFor="agent" className="cursor-pointer">
                      <div className="font-semibold mb-1">Real Estate Agent</div>
                      <div className="text-sm text-gray-600">For licensed real estate professionals</div>
                    </Label>
                  </div>
                  <div className={`border rounded-lg p-4 cursor-pointer ${userType === 'developer' ? 'border-[hsl(142,64%,38%)] bg-[hsl(142,64%,95%)]' : ''}`}>
                    <RadioGroupItem value="developer" id="developer" className="sr-only" />
                    <Label htmlFor="developer" className="cursor-pointer">
                      <div className="font-semibold mb-1">Property Developer</div>
                      <div className="text-sm text-gray-600">For companies and developers</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-6">
                {requirementsByType[userType].map(requirement => (
                  <div key={requirement.id} className="bg-gray-50 p-6 rounded-lg">
                    <Label className="text-base font-semibold mb-2">{requirement.label}</Label>
                    <p className="text-gray-600 text-sm mb-4">{requirement.description}</p>
                    
                    {requirement.accept ? (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept={requirement.accept}
                          onChange={(e) => handleFileChange(requirement.id, e)}
                          className="flex-grow"
                        />
                        {files[requirement.id] && (
                          <div className="text-sm text-[hsl(142,64%,38%)]">
                            File selected
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        type="url"
                        placeholder="Enter URL"
                        value={links[requirement.id] || ''}
                        onChange={(e) => handleLinkChange(requirement.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Upload className="h-8 w-8 text-[hsl(142,64%,38%)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verification Process</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our team will review your documents within 2-3 business days. Once approved, 
                      you'll receive a verification badge on your profile. A verification fee of $30 
                      will be charged upon approval.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-8 bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Verification; 