import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { User, FileText, MapPin, CreditCard, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, Route } from '@/contexts/AppContext';
import { toast } from 'sonner';
import StudentLayout from '@/components/layouts/StudentLayout';
import { applicationService, type CreateApplicationRequest } from '@/services';
import { collegeService, type College } from '@/services/resources.service';
import BasicDetails from './BasicDetails';
import UploadDocuments from './UploadDocuments';
import RouteSelection from './RouteSelection';
import Payments from './Payments';

const steps = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Route Selection', icon: MapPin },
  { id: 4, title: 'Payment', icon: CreditCard },
];

const formatDateForInput = (value: string | Date | undefined) => {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 10);
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { routes } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isPaymentResumeOnly, setIsPaymentResumeOnly] = useState(false);
  const [isSavingBasicDetails, setIsSavingBasicDetails] = useState(false);
  const [isSavingDocuments, setIsSavingDocuments] = useState(false);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingColleges, setIsLoadingColleges] = useState(true);
  const [shouldLoadColleges, setShouldLoadColleges] = useState(false);
  const [draftProgressPercent, setDraftProgressPercent] = useState(0);
  const [colleges, setColleges] = useState<College[]>([]);
  const hasLoadedDraftProgress = useRef(false);
  
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user?.name || '',
    dob: '',
    gender: '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    address: '',
    collegeName: '',
    course: '',
    yearSemester: ''
  });

  const [documents, setDocuments] = useState<{
    aadhaar: File | null;
    collegeId: File | null;
    photo: File | null;
  }>({
    aadhaar: null,
    collegeId: null,
    photo: null
  });

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [draftApplicationId, setDraftApplicationId] = useState<string | null>(null);
  const [uploadedDocumentUrls, setUploadedDocumentUrls] = useState<{
    aadhaar: string;
    collegeId: string;
    photo: string;
  } | null>(null);

  const createSyntheticRoute = useCallback((
    source: string,
    destination: string,
    distance: number,
    totalFare: number,
    routeId?: string,
  ): Route => {
    const matchedRoute = routes.find((routeItem) => {
      if (routeId && routeItem.id === routeId) {
        return true;
      }

      return routeItem.source === source && routeItem.destination === destination;
    });

    if (matchedRoute) {
      return {
        ...matchedRoute,
        totalFare,
        distance,
      };
    }

    return {
      id: routeId || `saved-${source}-${destination}`.toLowerCase().replace(/\s+/g, '-'),
      name: `${source} - ${destination}`,
      source,
      destination,
      stops: [],
      distance,
      farePerKm: distance > 0 ? Number((totalFare / distance).toFixed(2)) : 0,
      totalFare,
    };
  }, [routes]);

  const setApplyBlockUntil = (application: { passValidityEnd?: string; passValidityStart?: string; createdAt: string }) => {
    const blockUntil = application.passValidityEnd
      ? new Date(application.passValidityEnd)
      : application.passValidityStart
        ? new Date(new Date(application.passValidityStart).getTime() + 90 * 24 * 60 * 60 * 1000)
        : new Date(new Date(application.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000);

    sessionStorage.setItem('ebuspass_apply_block_until', blockUntil.toISOString());
  };

  useEffect(() => {
    let isMounted = true;

    const loadColleges = async () => {
      if (!shouldLoadColleges) {
        return;
      }

      try {
        const data = await collegeService.getColleges();
        if (isMounted) {
          setColleges(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Failed to load colleges');
        }
      } finally {
        if (isMounted) {
          setIsLoadingColleges(false);
        }
      }
    };

    void loadColleges();

    return () => {
      isMounted = false;
    };
  }, [shouldLoadColleges]);

  useEffect(() => {
    if (hasLoadedDraftProgress.current) {
      return undefined;
    }

    hasLoadedDraftProgress.current = true;
    let isMounted = true;

    const loadDraftProgress = async () => {
      if (!user) {
        if (isMounted) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const draftProgress = await applicationService.getDraftProgress();

        if (!isMounted) {
          return;
        }

        setDraftProgressPercent(draftProgress.progress.progressPercent);

        const activeApplication = draftProgress.activeApplication;
        if (activeApplication && activeApplication.status !== 'rejected') {
          if (activeApplication.status !== 'pay_pending') {
            if (activeApplication.status === 'approved') {
              setApplyBlockUntil(activeApplication);
              toast.error('You can apply only once right now. You can apply again when your pass expires.');
            } else {
              toast.error('You already have an active application. You can apply again only after rejection.');
            }
            navigate('/dashboard');
            return;
          }

          setIsPaymentResumeOnly(true);
          setDraftApplicationId(activeApplication._id);
          setCurrentStep(4);

          setPersonalDetails({
            fullName: activeApplication.personalDetails.fullName || user.name || '',
            dob: formatDateForInput(activeApplication.personalDetails.dob),
            gender: activeApplication.personalDetails.gender || '',
            mobile: activeApplication.personalDetails.mobile || user.mobile || '',
            email: activeApplication.personalDetails.email || user.email || '',
            address: activeApplication.personalDetails.address || '',
            collegeName: activeApplication.personalDetails.collegeName || '',
            course: activeApplication.personalDetails.course || '',
            yearSemester: activeApplication.personalDetails.yearSemester || '',
          });

          if (
            activeApplication.documents.aadhaar &&
            activeApplication.documents.collegeId &&
            activeApplication.documents.photo
          ) {
            setUploadedDocumentUrls({
              aadhaar: activeApplication.documents.aadhaar,
              collegeId: activeApplication.documents.collegeId,
              photo: activeApplication.documents.photo,
            });
          }

          const monthlyFare = Number(activeApplication.route.fare || 0);
          const normalizedDailyFare = monthlyFare > 0 ? monthlyFare / 30 : 0;

          setSelectedRoute(
            createSyntheticRoute(
              activeApplication.route.source,
              activeApplication.route.destination,
              Number(activeApplication.route.distance || 0),
              normalizedDailyFare,
              activeApplication.route.routeId,
            ),
          );

          return;
        }

        if (isMounted) {
          setShouldLoadColleges(true);
        }

        if (draftProgress.draft.basicDetails) {
          setPersonalDetails((previous) => ({
            ...previous,
            ...draftProgress.draft.basicDetails,
            dob: formatDateForInput(draftProgress.draft.basicDetails.dob),
          }));
        }

        if (draftProgress.draft.documents.completed) {
          setUploadedDocumentUrls({
            aadhaar: draftProgress.draft.documents.aadhaarUrl,
            collegeId: draftProgress.draft.documents.collegeIdUrl,
            photo: draftProgress.draft.documents.photoUrl,
          });
        }

        if (draftProgress.draft.routeSelection) {
          setSelectedRoute(
            createSyntheticRoute(
              draftProgress.draft.routeSelection.source,
              draftProgress.draft.routeSelection.destination,
              Number(draftProgress.draft.routeSelection.distance || 0),
              Number(draftProgress.draft.routeSelection.fare || 0),
              draftProgress.draft.routeSelection.routeId,
            ),
          );
        }

        if (draftProgress.progress.resumeStep) {
          setCurrentStep(draftProgress.progress.resumeStep);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load saved application progress');
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void loadDraftProgress();

    return () => {
      isMounted = false;
    };
  }, [createSyntheticRoute, navigate, user]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (type: 'aadhaar' | 'collegeId' | 'photo', file: File | null) => {
    setDocuments({ ...documents, [type]: file });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const { fullName, dob, gender, mobile, email, address, collegeName, course, yearSemester } = personalDetails;
        if (!fullName || !dob || !gender || !mobile || !email || !address || !collegeName || !course || !yearSemester) {
          toast.error('Please fill in all personal details');
          return false;
        }
        return true;
      }
      case 2:
        if (
          !(uploadedDocumentUrls?.aadhaar && uploadedDocumentUrls?.collegeId && uploadedDocumentUrls?.photo) &&
          (!documents.aadhaar || !documents.collegeId || !documents.photo)
        ) {
          toast.error('Please upload all required documents');
          return false;
        }
        return true;
      case 3:
        if (!selectedRoute) {
          toast.error('Please select a route');
          return false;
        }
        return true;
      case 4:
        if (!paymentMethod) {
          toast.error('Please select a payment method');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (isPaymentResumeOnly) {
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 1) {
      if (!user) {
        toast.error('Please log in to save your details');
        return;
      }

      try {
        setIsSavingBasicDetails(true);
        await applicationService.saveBasicDetails(personalDetails);
        setCurrentStep(prev => Math.min(prev + 1, 4));
        toast.success('Basic details saved successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to save basic details');
      } finally {
        setIsSavingBasicDetails(false);
      }
      return;
    }

    if (currentStep === 2) {
      if (!user) {
        toast.error('Please log in to save your documents');
        return;
      }

      const hasStoredDocuments = Boolean(
        uploadedDocumentUrls?.aadhaar &&
          uploadedDocumentUrls?.collegeId &&
          uploadedDocumentUrls?.photo,
      );

      const hasAllNewDocuments = Boolean(documents.aadhaar && documents.collegeId && documents.photo);
      const hasAnyNewDocument = Boolean(documents.aadhaar || documents.collegeId || documents.photo);

      if (hasStoredDocuments && !hasAnyNewDocument) {
        setCurrentStep(prev => Math.min(prev + 1, 4));
        toast.success('Using your previously uploaded documents');
        return;
      }

      if (!hasAllNewDocuments) {
        toast.error('Please upload all required documents');
        return;
      }

      try {
        setIsSavingDocuments(true);
        const response = await applicationService.saveDocumentsUpload({
          aadhaar: documents.aadhaar,
          collegeId: documents.collegeId,
          photo: documents.photo,
        });

        const uploadedDocuments = response?.documentsUpload?.documents;
        if (
          uploadedDocuments?.aadhaar?.url &&
          uploadedDocuments?.collegeId?.url &&
          uploadedDocuments?.photo?.url
        ) {
          setUploadedDocumentUrls({
            aadhaar: uploadedDocuments.aadhaar.url,
            collegeId: uploadedDocuments.collegeId.url,
            photo: uploadedDocuments.photo.url,
          });
        }

        setCurrentStep(prev => Math.min(prev + 1, 4));
        toast.success('Documents uploaded successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload documents');
      } finally {
        setIsSavingDocuments(false);
      }
      return;
    }

    if (currentStep === 3) {
      if (!user) {
        toast.error('Please log in to save your route selection');
        return;
      }

      if (!selectedRoute) {
        toast.error('Please select a route');
        return;
      }

      try {
        setIsSavingRoute(true);
        await applicationService.saveRouteSelection({
          source: selectedRoute.source,
          destination: selectedRoute.destination,
          distance: selectedRoute.distance,
          fare: selectedRoute.totalFare,
          routeId: selectedRoute.id,
        });

        const monthlyAmount = selectedRoute.totalFare * 30;

        if (draftApplicationId) {
          setCurrentStep(prev => Math.min(prev + 1, 4));
          return;
        }

        const applicationPayload: CreateApplicationRequest = {
          personalDetails,
          documents: {
            aadhaar: uploadedDocumentUrls?.aadhaar ?? documents.aadhaar?.name ?? '',
            collegeId: uploadedDocumentUrls?.collegeId ?? documents.collegeId?.name ?? '',
            photo: uploadedDocumentUrls?.photo ?? documents.photo?.name ?? '',
          },
          route: {
            source: selectedRoute.source,
            destination: selectedRoute.destination,
            distance: selectedRoute.distance,
            fare: monthlyAmount,
            routeId: selectedRoute.id,
          },
          payment: {
            status: 'pending',
            amount: monthlyAmount,
          },
        };

        const createdApplication = await applicationService.createApplication(applicationPayload);
        setDraftApplicationId(createdApplication._id);

        setCurrentStep(prev => Math.min(prev + 1, 4));
        toast.success('Application saved with payment pending status');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to save route selection');
      } finally {
        setIsSavingRoute(false);
      }
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    if (isPaymentResumeOnly) {
      return;
    }

    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    if (!validateStep(4) || !user || !selectedRoute || !draftApplicationId) {
      if (!draftApplicationId) {
        toast.error('Please complete previous steps to create your application first');
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const paymentAmount = selectedRoute.totalFare * 30;

      await applicationService.completeApplicationPayment(draftApplicationId, {
        status: 'completed',
        amount: paymentAmount,
        transactionId: `TXN${Date.now()}`,
        method: paymentMethod as 'UPI' | 'Debit Card' | 'Credit Card' | 'Net Banking',
        date: new Date().toISOString(),
      });

      toast.success('Payment successful. Application is now under review.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetails
            personalDetails={personalDetails}
            colleges={colleges}
            isLoadingColleges={isLoadingColleges}
            onPersonalChange={handlePersonalChange}
          />
        );

      case 2:
        return (
          <UploadDocuments
            documents={documents}
            onFileChange={handleFileChange}
          />
        );

      case 3:
        return (
          <RouteSelection
            routes={routes}
            selectedRoute={selectedRoute}
            onRouteSelect={setSelectedRoute}
          />
        );

      case 4:
        return (
          <Payments
            selectedRoute={selectedRoute}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        );

      default:
        return null;
    }
  };

  if (isInitializing) {
    return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Loading your application progress</CardTitle>
              <CardDescription>Please wait while we prepare your form.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto">
        {draftProgressPercent >= 10 && !isPaymentResumeOnly && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4 text-sm">
              You already started this application. Progress restored at {draftProgressPercent}%.
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map(step => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter your personal information'}
              {currentStep === 2 && 'Upload required documents'}
              {currentStep === 3 && 'Select your preferred route'}
              {currentStep === 4 && (isPaymentResumeOnly ? 'Complete your pending payment to continue' : 'Complete payment')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isPaymentResumeOnly}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={isSavingBasicDetails || isSavingDocuments || isSavingRoute}
                >
                  {currentStep === 1 && isSavingBasicDetails
                    ? 'Saving...'
                    : currentStep === 2 && isSavingDocuments
                      ? 'Uploading...'
                      : currentStep === 3 && isSavingRoute
                        ? 'Saving...'
                      : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handlePayment} disabled={isProcessing} variant="success">
                  {isProcessing ? 'Processing...' : `Pay ₹${selectedRoute?.totalFare ? selectedRoute.totalFare * 30 : 0}`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default ApplyPage;
