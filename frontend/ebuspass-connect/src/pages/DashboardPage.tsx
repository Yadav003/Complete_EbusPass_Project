import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, FileText, MapPin, CreditCard, Clock, CheckCircle, XCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import StudentLayout from '@/components/layouts/StudentLayout';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getUserApplication, routes } = useApp();
  
  const application = user ? getUserApplication(user.id) : undefined;
  const route = application ? routes.find(r => r.id === application.route.routeId) : undefined;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
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
    <StudentLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your bus pass application and track its status
          </p>
        </div>

        {!application ? (
          /* No Application State */
          <Card variant="elevated" className="text-center py-12">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Bus className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">No Active Application</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't applied for a bus pass yet. Start your application to get your student eBusPass.
              </p>
              <Link to="/apply">
                <Button size="lg" variant="hero">
                  Apply for eBusPass
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Application Exists */
          <div className="space-y-6">
            {/* Status Card */}
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Application Status</CardTitle>
                  <CardDescription>Application ID: {application.id}</CardDescription>
                </div>
                {getStatusBadge(application.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  {getStatusIcon(application.status)}
                  <div>
                    <p className="font-semibold">
                      {application.status === 'approved' && 'Your bus pass has been approved!'}
                      {application.status === 'rejected' && 'Your application was rejected'}
                      {application.status === 'under_review' && 'Your application is under review'}
                      {application.status === 'pending' && 'Your application is pending'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.status === 'approved' && 'Download your eBusPass below'}
                      {application.status === 'rejected' && 'Please contact support for more information'}
                      {application.status === 'under_review' && 'We are verifying your documents. This usually takes 2-3 working days.'}
                      {application.status === 'pending' && 'Your application will be reviewed soon'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* eBusPass Card - Show only if approved */}
            {application.status === 'approved' && (
              <Card variant="bordered" className="border-success overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-card/20 flex items-center justify-center">
                        <Bus className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Student eBusPass</h3>
                        <p className="text-sm opacity-90">Valid for Academic Year 2024-25</p>
                      </div>
                    </div>
                    <Badge className="bg-card/20 text-primary-foreground border-0">Active</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pass Holder</span>
                        <span className="font-medium">{application.personalDetails.fullName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">College</span>
                        <span className="font-medium">{application.personalDetails.collegeName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Course</span>
                        <span className="font-medium">{application.personalDetails.course}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Route</span>
                        <span className="font-medium">{route?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valid Till</span>
                        <span className="font-medium text-success">March 2025</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="success">
                    <Download className="w-4 h-4 mr-2" />
                    Download eBusPass
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span>{application.personalDetails.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{application.personalDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mobile</span>
                      <span>{application.personalDetails.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">College</span>
                      <span>{application.personalDetails.collegeName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Route Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route</span>
                      <span>{route?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From</span>
                      <span>{application.route.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To</span>
                      <span>{application.route.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span>{application.route.distance} km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Aadhaar Card</span>
                      <Badge variant="success">Uploaded</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>College ID</span>
                      <Badge variant="success">Uploaded</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Photo</span>
                      <Badge variant="success">Uploaded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Receipt */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold">₹{application.payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span>{application.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-xs">{application.payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="success">Paid</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </StudentLayout>
  );
};

export default DashboardPage;
