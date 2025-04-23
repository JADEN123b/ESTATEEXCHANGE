import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import AuthGuard from '../components/AuthGuard';

interface Agent {
  id: number;
  name: string;
  image: string;
  experience: number;
  fees: number;
  verified: boolean;
}

const agents: Agent[] = [
  {
    id: 1,
    name: "Agent 1",
    image: "/agents/agent1.jpg",
    experience: 5,
    fees: 30,
    verified: true
  },
  {
    id: 2,
    name: "Agent 2",
    image: "/agents/agent2.jpg",
    experience: 7,
    fees: 30,
    verified: true
  },
  {
    id: 3,
    name: "Agent 3",
    image: "/agents/agent3.jpg",
    experience: 3,
    fees: 30,
    verified: true
  },
  {
    id: 4,
    name: "Agent 4",
    image: "/agents/agent4.jpg",
    experience: 9,
    fees: 30,
    verified: true
  }
];

const PropertyVerification: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  const handleStartVerification = () => {
    if (!selectedAgent) {
      return;
    }
    // Here you would typically make an API call to start the verification process
    navigate('/dashboard');
  };

  const selectedAgentDetails = selectedAgent ? agents.find(agent => agent.id === selectedAgent) : null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto p-6 relative">
            <Button
              variant="ghost"
              className="absolute left-4 top-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-center text-green-600 mb-8 mt-8">
              {selectedAgent ? 'Selected Agent' : 'Select an Agent for Property Verification'}
            </h1>

            {selectedAgent ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={selectedAgentDetails?.image}
                        alt={selectedAgentDetails?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedAgentDetails?.name}
                    </h3>
                    <div className="text-gray-600 text-center">
                      <p>Experience: {selectedAgentDetails?.experience} years</p>
                      <p>Fees: ${selectedAgentDetails?.fees}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white hover:bg-green-500"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 text-center text-gray-600">
                  <p>
                    A $30 fee is charged to cover the agent's expenses for on-site property verification.
                    This ensures a thorough and unbiased assessment of your purchased property.
                  </p>
                  <p>
                    The verification process takes between 1 to 7 business days. If we do not receive
                    confirmation within 7 days, your money held at our escrow company account will be
                    automatically refunded.
                  </p>
                </div>

                <Button
                  onClick={handleStartVerification}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Verification Process
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:border-green-500 transition-all"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
                      <div className="text-sm text-gray-600 text-center">
                        <p>Experience: {agent.experience} years</p>
                        <p>Fees: ${agent.fees}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500 text-white hover:bg-green-500"
                      >
                        Verified
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default PropertyVerification; 