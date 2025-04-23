import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Shield, AlertTriangle, UserX, DollarSign, FileWarning } from 'lucide-react';
import adminService, { RiskAlert, SystemHealth } from '@/lib/api/admin.service';

const RiskManagement = () => {
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [alertsData, healthData] = await Promise.all([
        adminService.getRiskAlerts(),
        adminService.getSystemHealth()
      ]);
      setRiskAlerts(alertsData);
      setSystemHealth(healthData);
    } catch (error) {
      toast.error("Failed to load risk management data");
    }
  };

  const handleUpdateStatus = async (alertId: string, status: 'investigating' | 'resolved') => {
    try {
      const updated = await adminService.updateRiskAlertStatus(alertId, status);
      setRiskAlerts(prev => prev.map(alert => 
        alert.id === alertId ? updated : alert
      ));
      toast.success(`Alert status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update alert status");
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'suspicious_activity':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'multiple_accounts':
        return <UserX className="h-5 w-5 text-red-500" />;
      case 'price_manipulation':
        return <DollarSign className="h-5 w-5 text-orange-500" />;
      case 'verification_fraud':
        return <FileWarning className="h-5 w-5 text-purple-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'investigating':
        return <Badge className="bg-yellow-500">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return null;
    }
  };

  const filteredAlerts = riskAlerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Management</h1>
          <p className="text-gray-600">Monitor and manage potential security risks</p>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="high">High Severity</SelectItem>
            <SelectItem value="medium">Medium Severity</SelectItem>
            <SelectItem value="low">Low Severity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* System Health */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>System Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">API Latency</p>
                <p className="text-2xl font-semibold">
                  {systemHealth.metrics.apiLatency}ms
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Error Rate</p>
                <p className="text-2xl font-semibold">
                  {systemHealth.metrics.errorRate}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold">
                  {systemHealth.metrics.activeUsers}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">DB Performance</p>
                <p className="text-2xl font-semibold">
                  {systemHealth.metrics.databasePerformance}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Alerts */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRiskIcon(alert.type)}
                      <span className="capitalize">
                        {alert.type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.userName}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell>
                    {alert.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(alert.id, 'investigating')}
                      >
                        Investigate
                      </Button>
                    )}
                    {alert.status === 'investigating' && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {systemHealth?.status !== 'healthy' && (
        <Alert variant={systemHealth?.status === 'critical' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Health Warning</AlertTitle>
          <AlertDescription>
            {systemHealth?.status === 'critical' 
              ? 'Critical system issues detected. Immediate attention required.'
              : 'System performance is degraded. Investigation recommended.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RiskManagement; 