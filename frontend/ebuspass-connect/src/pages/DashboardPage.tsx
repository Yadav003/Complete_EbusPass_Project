import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, FileText, MapPin, CreditCard, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/layouts/StudentLayout';
import { applicationService, type AdminApplication, type UserDraftProgress } from '@/services/application.service';

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draftProgress, setDraftProgress] = useState<UserDraftProgress | null>(null);

  const getApplyBlockUntil = (application: AdminApplication | null) => {
    if (!application || application.status !== 'approved') {
      return null;
    }

    if (application.passValidityEnd) {
      return new Date(application.passValidityEnd);
    }

    if (application.passValidityStart) {
      return new Date(new Date(application.passValidityStart).getTime() + 90 * 24 * 60 * 60 * 1000);
    }

    return new Date(new Date(application.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000);
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!user) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        setLoadError(null);
        const progress = await applicationService.getDraftProgress();
        if (isMounted) {
          setDraftProgress(progress);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load dashboard details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!draftProgress) {
      return;
    }

    const blockUntil = getApplyBlockUntil(draftProgress.activeApplication ?? null);

    if (blockUntil) {
      sessionStorage.setItem('ebuspass_apply_block_until', blockUntil.toISOString());
    } else {
      sessionStorage.removeItem('ebuspass_apply_block_until');
    }
  }, [draftProgress]);

  const activeApplication = draftProgress?.activeApplication ?? null;
  const latestApplication = draftProgress?.latestApplication ?? null;

  const showResumeDraft = useMemo(() => {
    if (!draftProgress) {
      return false;
    }

    return (
      draftProgress.canCreateNewApplication &&
      draftProgress.progress.progressPercent >= 10 &&
      draftProgress.progress.resumeStep !== null
    );
  }, [draftProgress]);

  const showReapplyCard = Boolean(
    draftProgress?.canCreateNewApplication && latestApplication?.status === 'rejected',
  );

  const getStatusText = (status: AdminApplication['status']) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'pay_pending':
        return 'Payment Pending';
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'pay_pending':
        return <CreditCard className="w-5 h-5 text-warning" />;
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
      case 'pay_pending':
        return <Badge variant="pending">Payment Pending</Badge>;
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
            Welcome back, {user?.name?.split(' ')[0]}! 
          </h1>
          <p className="text-muted-foreground">
            Manage your bus pass application and track its status
          </p>
        </div>

        {isLoading ? (
          <Card variant="elevated" className="py-10">
            <CardHeader>
              <CardTitle>Loading dashboard</CardTitle>
              <CardDescription>Please wait while we fetch your latest application status.</CardDescription>
            </CardHeader>
          </Card>
        ) : loadError ? (
          <Card variant="elevated" className="py-10">
            <CardHeader>
              <CardTitle>Unable to load dashboard</CardTitle>
              <CardDescription>{loadError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {activeApplication && (
              <Card variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription className="mt-1">Application ID: {activeApplication._id}</CardDescription>
                  </div>
                  {getStatusBadge(activeApplication.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    {getStatusIcon(activeApplication.status)}
                    <div>
                      <p className="font-semibold">
                        {activeApplication.status === 'approved' && 'Your bus pass has been approved'}
                        {activeApplication.status === 'under_review' && 'Your application is under review'}
                        {activeApplication.status === 'pending' && 'Your application is pending review'}
                        {activeApplication.status === 'pay_pending' && 'Payment is pending for your application'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activeApplication.status === 'approved' && 'You cannot submit another application until this one is rejected or expires by policy.'}
                        {activeApplication.status === 'under_review' && 'A new application is blocked while your current application is under review.'}
                        {activeApplication.status === 'pending' && 'A new application is blocked while your current application is pending.'}
                        {activeApplication.status === 'pay_pending' && 'Complete your payment to continue with this application.'}
                      </p>
                    </div>
                  </div>

                  {activeApplication.status === 'pay_pending' && (
                    <Link to="/apply">
                      <Button className='mt-2'>
                        Continue Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
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
                            <span>{activeApplication.personalDetails.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{activeApplication.personalDetails.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mobile</span>
                            <span>{activeApplication.personalDetails.mobile}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">College</span>
                            <span>{activeApplication.personalDetails.collegeName}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                            <span className="text-muted-foreground">From</span>
                            <span>{activeApplication.route.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">To</span>
                            <span>{activeApplication.route.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distance</span>
                            <span>{activeApplication.route.distance} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span>{getStatusText(activeApplication.status)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                            <span className="font-semibold">₹{activeApplication.payment.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Method</span>
                            <span>{activeApplication.payment.method || 'Not selected'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Payment Status</span>
                            <Badge variant={activeApplication.payment.status === 'completed' ? 'approved' : 'pending'}>
                              {activeApplication.payment.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {showResumeDraft && (
              <Card variant="elevated" className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle>Continue Your Application</CardTitle>
                  <CardDescription>
                    You have already completed {draftProgress?.progress.progressPercent}% of your application. Continue from step {draftProgress?.progress.resumeStep}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/apply">
                    <Button variant="hero">
                      Continue Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {showReapplyCard && !activeApplication && (
              <Card variant="elevated" className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle>Your Last Application Was Rejected</CardTitle>
                  <CardDescription>
                    You can submit a new application now.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/apply">
                    <Button>
                      Apply Again
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {!activeApplication && !showResumeDraft && !showReapplyCard && (
              <Card variant="elevated" className="text-center py-12">
                <CardContent>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Bus className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-4">No Active Application</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You have not applied for a bus pass yet. Start your application to get your student eBusPass.
                  </p>
                  <Link to="/apply">
                    <Button size="lg" variant="hero">
                      Apply for eBusPass
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </motion.div>
    </StudentLayout>
  );
};

export default DashboardPage;
