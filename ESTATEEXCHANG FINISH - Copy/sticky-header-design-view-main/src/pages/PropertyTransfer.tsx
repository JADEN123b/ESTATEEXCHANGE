import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

interface DocumentState {
  propertyDeed: File | null;
  transferForm: File | null;
  identificationDocs: File[] | null;
  proofOfPayment: File | null;
  propertySurvey: File | null;
  legalClearance: File[] | null;
}

const PropertyTransfer: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentState>({
    propertyDeed: null,
    transferForm: null,
    identificationDocs: null,
    proofOfPayment: null,
    propertySurvey: null,
    legalClearance: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: keyof DocumentState
  ) => {
    const files = event.target.files;
    if (!files) return;

    if (documentType === 'identificationDocs' || documentType === 'legalClearance') {
      setDocuments(prev => ({
        ...prev,
        [documentType]: Array.from(files)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: files[0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all required documents are uploaded
    const missingDocuments = Object.entries(documents)
      .filter(([_, value]) => !value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

    if (missingDocuments.length > 0) {
      toast({
        title: "Required Documents Missing",
        description: `Please upload all required documents before proceeding. Missing: ${missingDocuments.join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Your documents have been uploaded successfully. Proceeding to payment.",
      });
      setIsSubmitting(false);
      navigate('/property-transfer-payment');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your documents. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="profile" />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8 relative">
            <BackButton />
            <h1 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-6 md:mb-8">
              Ownership Transfer Process
            </h1>

            <Alert variant="destructive" className="mb-4 md:mb-6 text-sm md:text-base">
              <AlertDescription>
                ⚠️ All documents listed below are required. You must upload all documents before proceeding to payment.
              </AlertDescription>
            </Alert>

            <p className="text-gray-600 mb-4 md:mb-6 text-center text-sm md:text-base">
              To complete the property ownership transfer, please provide the following documents:
            </p>

            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-4">Required Documents:</h2>
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">Property Deed:</label>
                    <div className="text-xs md:text-sm text-gray-500">Official document proving ownership.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'propertyDeed')}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full text-sm"
                  />
                </div>

                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">Transfer Form:</label>
                    <div className="text-xs md:text-sm text-gray-500">Completed and signed form.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'transferForm')}
                    accept=".pdf,.doc,.docx"
                    className="w-full text-sm"
                  />
                </div>

                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">ID Documents:</label>
                    <div className="text-xs md:text-sm text-gray-500">Copies of valid IDs for both parties.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'identificationDocs')}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm"
                    multiple
                  />
                </div>

                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">Payment Proof:</label>
                    <div className="text-xs md:text-sm text-gray-500">Receipt or transaction record.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'proofOfPayment')}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm"
                  />
                </div>

                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">Property Survey:</label>
                    <div className="text-xs md:text-sm text-gray-500">Recent survey of boundaries.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'propertySurvey')}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm"
                  />
                </div>

                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <label className="block font-medium text-gray-700 mb-1 md:mb-0">Legal Clearance:</label>
                    <div className="text-xs md:text-sm text-gray-500">All needed clearance documents.</div>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'legalClearance')}
                    accept=".pdf,.doc,.docx"
                    className="w-full text-sm"
                    multiple
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 bg-gray-50 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                <strong>Note:</strong> The submit button will be enabled once all required documents are uploaded.
                Please ensure all documents are valid and clearly legible.
              </p>
              <Button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base"
                disabled={isSubmitting || Object.values(documents).some(doc => doc === null)}
              >
                {isSubmitting ? 'Submitting Documents...' : 'Submit Documents & Proceed to Payment'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default PropertyTransfer; 