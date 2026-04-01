import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { User, FileText, MapPin, CreditCard, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, Route } from '@/contexts/AppContext';
import { toast } from 'sonner';
import StudentLayout from '@/components/layouts/StudentLayout';
import { applicationService } from '@/services';
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

const ApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colleges, routes, addApplication } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingBasicDetails, setIsSavingBasicDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
        if (!documents.aadhaar || !documents.collegeId || !documents.photo) {
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

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    if (!validateStep(4) || !user || !selectedRoute) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addApplication({
      userId: user.id,
      status: 'under_review',
      personalDetails,
      documents: {
        aadhaar: documents.aadhaar?.name,
        collegeId: documents.collegeId?.name,
        photo: documents.photo?.name
      },
      route: {
        source: selectedRoute.source,
        destination: selectedRoute.destination,
        distance: selectedRoute.distance,
        fare: selectedRoute.totalFare * 30, // Monthly fare
        routeId: selectedRoute.id
      },
      payment: {
        status: 'completed',
        amount: selectedRoute.totalFare * 30,
        transactionId: `TXN${Date.now()}`,
        method: paymentMethod,
        date: new Date().toISOString()
      }
    });
    
    setIsProcessing(false);
    toast.success('Application submitted successfully!');
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetails
            personalDetails={personalDetails}
            colleges={colleges}
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

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto">
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
              {currentStep === 4 && 'Complete payment'}
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
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={nextStep} disabled={isSavingBasicDetails}>
                  {currentStep === 1 && isSavingBasicDetails ? 'Saving...' : 'Next'}
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
