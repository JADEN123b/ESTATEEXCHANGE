import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Filter, Download, Home } from 'lucide-react';
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'active' | 'pending' | 'sold';
  owner: string;
  createdAt: string;
}

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern Apartment in City Center',
      type: 'Apartment',
      location: 'New York, NY',
      price: 450000,
      status: 'active',
      owner: 'John Doe',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Luxury Villa with Pool',
      type: 'Villa',
      location: 'Miami, FL',
      price: 1200000,
      status: 'pending',
      owner: 'Jane Smith',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      title: 'Cozy Family House',
      type: 'House',
      location: 'Los Angeles, CA',
      price: 850000,
      status: 'sold',
      owner: 'Mike Johnson',
      createdAt: '2024-03-05'
    },
    {
      id: '4',
      title: 'Beachfront Condo',
      type: 'Condo',
      location: 'San Diego, CA',
      price: 650000,
      status: 'active',
      owner: 'Sarah Wilson',
      createdAt: '2024-03-10'
    },
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-gray-600">Manage property listings and verifications</p>
        </div>
        <Button>
          <Home className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Listed Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>{formatPrice(property.price)}</TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell>{property.owner}</TableCell>
                <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info("View details")}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Property approved")}>
                        Approve Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Property suspended")}>
                        Suspend Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => toast.error("Property rejected")}>
                        Reject Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Properties; 