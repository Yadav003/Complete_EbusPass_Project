import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { Application } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';

const AdminApplications = () => {
  const { applications, updateApplication, routes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.personalDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (appId: string) => {
    updateApplication(appId, { status: 'approved' });
    toast.success('Application approved successfully!');
    setShowDetails(false);
  };

  const handleReject = (appId: string) => {
    updateApplication(appId, { status: 'rejected' });
    toast.error('Application rejected');
    setShowDetails(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="approved">Approved</Badge>;
      case 'rejected':
        return <Badge variant="rejected">Rejected</Badge>;
      case 'under_review':
        return <Badge variant="pending">Under Review</Badge>;
      default:
        return <Badge variant="pending">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Applications
            </h1>
            <p className="text-muted-foreground">
              Manage and review student bus pass applications
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-lg border-2 border-input bg-card px-4 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-4 px-4 font-medium">Application ID</th>
                      <th className="text-left py-4 px-4 font-medium">Student Name</th>
                      <th className="text-left py-4 px-4 font-medium">College</th>
                      <th className="text-left py-4 px-4 font-medium">Route</th>
                      <th className="text-left py-4 px-4 font-medium">Amount</th>
                      <th className="text-left py-4 px-4 font-medium">Status</th>
                      <th className="text-left py-4 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => {
                      const route = routes.find(r => r.id === app.route.routeId);
                      return (
                        <tr key={app.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs">{app.id}</td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{app.personalDetails.fullName}</div>
                              <div className="text-xs text-muted-foreground">{app.personalDetails.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">{app.personalDetails.collegeName}</td>
                          <td className="py-4 px-4">{route?.name || 'N/A'}</td>
                          <td className="py-4 px-4 font-medium">₹{app.payment.amount}</td>
                          <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setShowDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {(app.status === 'pending' || app.status === 'under_review') && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-success hover:text-success"
                                    onClick={() => handleApprove(app.id)}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleReject(app.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>Review the complete application information</DialogDescription>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">{selectedApp.id}</span>
                  {getStatusBadge(selectedApp.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{selectedApp.personalDetails.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{selectedApp.personalDetails.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <span>{selectedApp.personalDetails.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DOB</span>
                        <span>{selectedApp.personalDetails.dob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender</span>
                        <span className="capitalize">{selectedApp.personalDetails.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Academic Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">College</span>
                        <span>{selectedApp.personalDetails.collegeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course</span>
                        <span>{selectedApp.personalDetails.course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year</span>
                        <span>{selectedApp.personalDetails.yearSemester}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Route & Payment</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From</span>
                        <span>{selectedApp.route.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To</span>
                        <span>{selectedApp.route.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance</span>
                        <span>{selectedApp.route.distance} km</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">₹{selectedApp.payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span>{selectedApp.payment.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-xs">{selectedApp.payment.transactionId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Documents</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted rounded-lg text-center text-sm">
                      <div className="font-medium">Aadhaar</div>
                      <div className="text-xs text-muted-foreground">{selectedApp.documents.aadhaar}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center text-sm">
                      <div className="font-medium">College ID</div>
                      <div className="text-xs text-muted-foreground">{selectedApp.documents.collegeId}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center text-sm">
                      <div className="font-medium">Photo</div>
                      <div className="text-xs text-muted-foreground">{selectedApp.documents.photo}</div>
                    </div>
                  </div>
                </div>

                {(selectedApp.status === 'pending' || selectedApp.status === 'under_review') && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="flex-1"
                      variant="success"
                      onClick={() => handleApprove(selectedApp.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => handleReject(selectedApp.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminApplications;
