
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const PropertySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const { toast } = useToast();
  
  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: `Searching for "${searchTerm}" in ${propertyType} properties`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Input 
          className="flex-grow" 
          placeholder="Search by location, agent..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select 
          value={propertyType}
          onValueChange={setPropertyType}
        >
          <SelectTrigger className="w-full md:w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          className="bg-[hsl(142,64%,38%)] hover:bg-[hsl(142,64%,30%)]"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default PropertySearch;
