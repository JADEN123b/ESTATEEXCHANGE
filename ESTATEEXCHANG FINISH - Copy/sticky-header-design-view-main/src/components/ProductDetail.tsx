
import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const sampleVariants = [
  { id: '1', name: 'Basic', price: 19.99 },
  { id: '2', name: 'Pro', price: 29.99 },
  { id: '3', name: 'Premium', price: 49.99 }
];

const ProductDetail: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      toast({
        title: "Variant Selected",
        description: `Added ${selectedVariant.name} variant to cart`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please select a variant first",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Variants</h2>
      <VariantSelector 
        variants={sampleVariants} 
        onVariantSelect={handleVariantSelect} 
      />
      <Button 
        onClick={handleAddToCart} 
        className="mt-4 w-full"
        disabled={!selectedVariant}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductDetail;
