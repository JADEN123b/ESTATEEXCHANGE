import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';

interface PaymentDetails {
  amount: string;
  paymentMethod: string;
  cardNumber: string;
}

const PropertyTransferPayment: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: '',
    paymentMethod: 'credit',
    cardNumber: '',
  });

  const handleInputChange = (name: string, value: string) => {
    if (name === 'amount') {
      // Only allow numbers and decimal point
      if (!/^\d*\.?\d*$/.test(value)) return;
      
      // Prevent multiple decimal points
      if (value.split('.').length > 2) return;
      
      // Limit to 2 decimal places
      if (value.includes('.') && value.split('.')[1]?.length > 2) return;
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDetails.amount || parseFloat(paymentDetails.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate transaction details
      const transactionDetails = {
        transactionId: Math.random().toString().slice(2, 12),
        amount: parseFloat(paymentDetails.amount).toFixed(2),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        purchasedItem: 'Luxury Villa',
        location: 'Miami, FL',
        paymentMethod: paymentDetails.paymentMethod === 'credit' ? 'Credit Card' : 'Debit Card'
      };

      // Navigate to success page with transaction details
      navigate('/payment-success', { state: transactionDetails });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process your payment. Please try again.",
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
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-green-600 mb-4 md:mb-6 text-center">
              Payment Details
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm md:text-base">Amount:</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm md:text-base">$</span>
                  <Input
                    id="amount"
                    type="text"
                    value={paymentDetails.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="pl-7 text-sm md:text-base"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm md:text-base">Payment Method:</Label>
                <Select
                  value={paymentDetails.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger className="w-full text-sm md:text-base">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit" className="text-sm md:text-base">Credit Card</SelectItem>
                    <SelectItem value="debit" className="text-sm md:text-base">Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm md:text-base">Card Number:</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="Enter card number"
                  className="text-sm md:text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 md:py-3 text-sm md:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Payment'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default PropertyTransferPayment; 