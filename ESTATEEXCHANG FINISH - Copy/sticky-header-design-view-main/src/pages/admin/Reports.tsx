import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, FileText, BarChart, Users, Home } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReportFilters {
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  format: string;
}

const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    type: '',
    startDate: undefined,
    endDate: undefined,
    format: 'pdf'
  });

  const handleGenerateReport = async () => {
    if (!filters.type || !filters.startDate || !filters.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'transaction',
      name: 'Transaction Report',
      description: 'Detailed report of all transactions',
      icon: BarChart
    },
    {
      id: 'user',
      name: 'User Activity Report',
      description: 'User engagement and activity metrics',
      icon: Users
    },
    {
      id: 'property',
      name: 'Property Report',
      description: 'Property listings and performance',
      icon: Home
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue and financial metrics',
      icon: FileText
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download system reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              filters.type === type.id && "border-primary"
            )}
            onClick={() => setFilters(prev => ({ ...prev, type: type.id }))}
          >
            <CardHeader>
              <type.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{type.name}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Report</CardTitle>
          <CardDescription>
            Set the parameters for your report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                date={filters.startDate}
                setDate={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                date={filters.endDate}
                setDate={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Format</Label>
            <Select
              value={filters.format}
              onValueChange={(value) => setFilters(prev => ({ ...prev, format: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleGenerateReport}
            disabled={isLoading || !filters.type || !filters.startDate || !filters.endDate}
          >
            {isLoading ? (
              <>Generating Report...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Your recently generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Transaction Report - March 2024',
                date: '2024-03-15',
                format: 'PDF',
                size: '2.4 MB'
              },
              {
                name: 'User Activity Report - Q1 2024',
                date: '2024-03-01',
                format: 'Excel',
                size: '1.8 MB'
              },
              {
                name: 'Property Performance - February 2024',
                date: '2024-02-28',
                format: 'CSV',
                size: '956 KB'
              }
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Generated on {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {report.format} • {report.size}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports; 