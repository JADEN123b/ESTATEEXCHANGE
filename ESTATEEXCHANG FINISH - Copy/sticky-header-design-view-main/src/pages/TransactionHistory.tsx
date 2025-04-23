import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import SocialHeader from '../components/SocialHeader';
import BackButton from '../components/BackButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import paymentService, { Payment } from '@/lib/api/payment.service';
import { format } from 'date-fns';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await paymentService.getPaymentHistory({
          limit: 50, // Adjust as needed
          page: 1
        });
        setTransactions(response.payments);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-100">
          <SocialHeader currentPage="profile" />
          <div className="max-w-6xl mx-auto p-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <SocialHeader currentPage="profile" />
        <div className="max-w-6xl mx-auto p-4">
          <Card>
            <CardHeader className="relative">
              <BackButton className="absolute top-4 left-4" />
              <CardTitle className="text-2xl font-bold text-center text-green-600">
                Transaction History
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Desktop view */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          {Array(6).fill(0).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                              <Skeleton className="h-4 w-[100px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono">{transaction.id}</TableCell>
                          <TableCell>{format(new Date(transaction.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: transaction.currency
                            }).format(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {transaction.method.brand && transaction.method.last4 
                              ? `${transaction.method.brand} ****${transaction.method.last4}`
                              : transaction.method.type}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden space-y-4">
                {loading ? (
                  // Loading skeleton for mobile
                  Array(3).fill(0).map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </Card>
                  ))
                ) : (
                  transactions.map((transaction) => (
                    <Card key={transaction.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Badge 
                            className={getStatusColor(transaction.status)}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-lg font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: transaction.currency
                          }).format(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>ID: {transaction.id}</p>
                          <p>
                            {transaction.method.brand && transaction.method.last4 
                              ? `${transaction.method.brand} ****${transaction.method.last4}`
                              : transaction.method.type}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default TransactionHistory; 