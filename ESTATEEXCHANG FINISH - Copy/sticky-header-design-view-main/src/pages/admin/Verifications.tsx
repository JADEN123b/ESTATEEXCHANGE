import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, Download, CheckCircle, XCircle } from 'lucide-react';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  type: 'individual' | 'agent' | 'developer';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: {
    id: string;
    name: string;
    url: string;
  }[];
  links?: {
    [key: string]: string;
  };
}

const Verifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [viewingDocuments, setViewingDocuments] = useState(false);

  // Mock data - In real app, this would come from an API
  const verificationRequests: VerificationRequest[] = [
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      email: "john@example.com",
      type: "agent",
      status: "pending",
      submittedAt: "2024-04-23",
      documents: [
        { id: "doc1", name: "Professional License", url: "/documents/license.pdf" },
        { id: "doc2", name: "Business Registration", url: "/documents/registration.pdf" }
      ]
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      email: "jane@example.com",
      type: "individual",
      status: "pending",
      submittedAt: "2024-04-22",
      documents: [
        { id: "doc3", name: "Government ID", url: "/documents/id.pdf" },
        { id: "doc4", name: "Proof of Address", url: "/documents/address.pdf" }
      ],
      links: {
        linkedin: "https://linkedin.com/in/janesmith",
        twitter: "https://twitter.com/janesmith"
      }
    }
  ];

  const handleApprove = (requestId: string) => {
    // In real app, make API call to approve verification
    toast.success("Verification request approved successfully");
  };

  const handleReject = (requestId: string) => {
    // In real app, make API call to reject verification
    toast.success("Verification request rejected successfully");
  };

  const handleDownload = (documentUrl: string) => {
    // In real app, implement document download
    console.log("Downloading document:", documentUrl);
  };

  const filteredRequests = verificationRequests.filter(request => 
    request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Verification Requests</h1>
        <p className="text-gray-600">
          Manage and review user verification requests
        </p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{request.userName}</CardTitle>
                  <CardDescription>{request.email}</CardDescription>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="capitalize">{request.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p>{request.submittedAt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <p>{request.documents.length} files</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setViewingDocuments(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
                {request.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={viewingDocuments} onOpenChange={setViewingDocuments}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification Documents</DialogTitle>
            <DialogDescription>
              Review submitted documents and social media links
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {selectedRequest.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{doc.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.url)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              {selectedRequest.links && Object.keys(selectedRequest.links).length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Social Media Links</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedRequest.links).map(([platform, url]) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="capitalize">{platform}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Verifications; 