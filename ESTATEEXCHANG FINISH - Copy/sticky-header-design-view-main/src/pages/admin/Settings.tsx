import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Mail, Shield, Globe, DollarSign, Bell, Lock } from 'lucide-react';

interface SystemSettings {
  emailNotifications: boolean;
  automaticVerification: boolean;
  maintenanceMode: boolean;
  defaultCurrency: string;
  verificationFee: number;
  systemEmail: string;
  supportEmail: string;
  maxListingsPerUser: number;
  maxImagesPerListing: number;
  autoSuspendThreshold: number;
}

const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    emailNotifications: true,
    automaticVerification: false,
    maintenanceMode: false,
    defaultCurrency: 'USD',
    verificationFee: 30,
    systemEmail: 'system@estateexchange.com',
    supportEmail: 'support@estateexchange.com',
    maxListingsPerUser: 10,
    maxImagesPerListing: 8,
    autoSuspendThreshold: 3
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    try {
      // In real app, make API call to save settings
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordForm;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      // In a real app, verify current password matches admin credentials
      const ADMIN_PASSWORD = localStorage.getItem('ADMIN_PASSWORD') || 'admin@2024';
      if (currentPassword !== ADMIN_PASSWORD) {
        toast.error("Current password is incorrect");
        return;
      }

      // Update the password in localStorage
      localStorage.setItem('ADMIN_PASSWORD', newPassword);
      
      // Clear the form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="fees">Fees & Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>System Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Input
                    value={settings.systemEmail}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, systemEmail: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Support Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Input
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, supportEmail: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(value) =>
                    setSettings(prev => ({ ...prev, defaultCurrency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoVerification">Automatic Verification</Label>
                <Switch
                  id="autoVerification"
                  checked={settings.automaticVerification}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, automaticVerification: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Auto-Suspend Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={settings.autoSuspendThreshold}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, autoSuspendThreshold: parseInt(e.target.value) }))
                    }
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Number of reports before auto-suspending a user
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Admin Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))
                    }
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))
                    }
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Fee</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={settings.verificationFee}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, verificationFee: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Max Listings per User</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={settings.maxListingsPerUser}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, maxListingsPerUser: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Max Images per Listing</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={settings.maxImagesPerListing}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, maxImagesPerListing: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 