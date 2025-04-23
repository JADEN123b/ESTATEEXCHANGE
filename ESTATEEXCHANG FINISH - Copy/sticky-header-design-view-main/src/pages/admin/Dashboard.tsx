import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Home, BadgeCheck, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts and statistics
  const propertyListingsData = [
    { month: 'Jan', count: 400 },
    { month: 'Feb', count: 300 },
    { month: 'Mar', count: 600 },
    { month: 'Apr', count: 800 },
    { month: 'May', count: 500 }
  ];

  const userRegistrationsData = [
    { month: 'Jan', users: 30 },
    { month: 'Feb', users: 45 },
    { month: 'Mar', users: 25 },
    { month: 'Apr', users: 50 },
    { month: 'May', users: 35 }
  ];

  const verificationStats = [
    { name: 'Pending', value: 15 },
    { name: 'Approved', value: 45 },
    { name: 'Rejected', value: 10 }
  ];

  const recentActivities = [
    { 
      id: 1,
      type: 'user_registration',
      description: 'New user registered',
      user: 'John Smith',
      time: '5 minutes ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'verification_request',
      description: 'Verification requested',
      user: 'Sarah Johnson',
      time: '15 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'property_listed',
      description: 'New property listed',
      user: 'Mike Wilson',
      time: '1 hour ago',
      status: 'new'
    },
    {
      id: 4,
      type: 'transaction_completed',
      description: 'Property sale completed',
      user: 'Emma Davis',
      time: '2 hours ago',
      status: 'completed'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'verification',
      message: '5 new verification requests pending review',
      priority: 'high'
    },
    {
      id: 2,
      type: 'reports',
      message: '3 properties reported for review',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'system',
      message: 'System maintenance scheduled for tonight',
      priority: 'low'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-semibold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-3xl font-semibold text-gray-900">567</p>
                <p className="text-sm text-green-600">+8% this month</p>
              </div>
              <Home className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                <p className="text-3xl font-semibold text-gray-900">15</p>
                <p className="text-sm text-orange-600">5 new today</p>
              </div>
              <BadgeCheck className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-semibold text-gray-900">$45.2K</p>
                <p className="text-sm text-green-600">+15% this month</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                  </div>
                </div>
                {getPriorityBadge(alert.priority)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Property Listings Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={propertyListingsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Registrations</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRegistrationsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Link to="/admin/activity" className="text-sm text-green-600 hover:text-green-700 flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Statistics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {verificationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {verificationStats.map((stat, index) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{stat.name}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 