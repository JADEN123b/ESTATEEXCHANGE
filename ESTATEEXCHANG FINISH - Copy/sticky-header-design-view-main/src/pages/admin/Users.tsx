import { useState, useEffect } from 'react';
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
import { Search, MoreVertical, UserPlus, Filter, Download } from 'lucide-react';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedDate: string;
  properties: number;
  isVerified: boolean;
}

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Load users from localStorage
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const formattedUsers = registeredUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'User',
      status: user.status || 'pending',
      joinedDate: user.createdAt,
      properties: user.stats.listings,
      isVerified: user.isVerified
    }));
    setUsers(formattedUsers);
  }, []);

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    // Update user status in state
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);

    // Update user status in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedRegisteredUsers = registeredUsers.map((user: any) => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));

    toast.success(`User status updated to ${newStatus}`);
  };

  const handleVerification = (userId: string, verify: boolean) => {
    // Update user verification in state
    const updatedUsers = users.map(user => 
      user.id === userId ? { 
        ...user, 
        isVerified: verify,
        status: verify ? 'active' : 'pending'
      } : user
    );
    setUsers(updatedUsers);

    // Update user verification in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedRegisteredUsers = registeredUsers.map((user: any) => 
      user.id === userId ? { 
        ...user, 
        isVerified: verify,
        status: verify ? 'active' : 'pending'
      } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));

    toast.success(verify ? 'User verified successfully' : 'User verification revoked');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search users..."
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell>{user.properties}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info("View profile")}>
                        View Profile
                      </DropdownMenuItem>
                      {!user.isVerified && (
                        <DropdownMenuItem onClick={() => handleVerification(user.id, true)}>
                          Verify User
                        </DropdownMenuItem>
                      )}
                      {user.isVerified && (
                        <DropdownMenuItem onClick={() => handleVerification(user.id, false)}>
                          Revoke Verification
                        </DropdownMenuItem>
                      )}
                      {user.status !== 'suspended' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')} className="text-red-600">
                          Suspend Account
                        </DropdownMenuItem>
                      )}
                      {user.status === 'suspended' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600">
                          Reactivate Account
                        </DropdownMenuItem>
                      )}
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

export default Users; 