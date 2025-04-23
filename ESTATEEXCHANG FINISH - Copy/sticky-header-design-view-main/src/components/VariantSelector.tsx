
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Variant {
  id: string;
  name: string;
  price: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variant: Variant) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, onVariantSelect }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      onVariantSelect(variant);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleVariantChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a variant">
            {selectedVariant ? selectedVariant.name : "Choose variant"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {variant.name} - ${variant.price.toFixed(2)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelector;
