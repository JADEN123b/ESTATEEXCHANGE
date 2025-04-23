import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PendingListing {
  id: string;
  property: string;
  user: string;
}

const PendingListings = () => {
  const pendingListings: PendingListing[] = [
    {
      id: "#456",
      property: "Commercial Space",
      user: "User C"
    },
    {
      id: "#457",
      property: "Land Plot",
      user: "User D"
    }
  ];

  const handleApprove = (id: string) => {
    // Add your approval logic here
    toast.success("Listing approved successfully");
  };

  const handleReject = (id: string) => {
    // Add your rejection logic here
    toast.error("Listing rejected");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Pending Listings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Listing ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingListings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4 whitespace-nowrap">{listing.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{listing.property}</td>
                <td className="px-6 py-4 whitespace-nowrap">{listing.user}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button
                    onClick={() => handleApprove(listing.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(listing.id)}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingListings; 