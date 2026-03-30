import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, User, FileText, MapPin, CreditCard, Check, ArrowLeft, ArrowRight, Upload, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, Route } from '@/contexts/AppContext';
import { toast } from 'sonner';
import StudentLayout from '@/components/layouts/StudentLayout';
import UploadDocuments from './UploadDocuments';
import RouteSelection from './RouteSelection';

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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    if (!validateStep(4) || !user || !selectedRoute) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const appId = addApplication({
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={personalDetails.fullName}
                  onChange={handlePersonalChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={personalDetails.dob}
                  onChange={handlePersonalChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={personalDetails.gender}
                  onChange={handlePersonalChange}
                  className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={personalDetails.mobile}
                  onChange={handlePersonalChange}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={personalDetails.email}
                  onChange={handlePersonalChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Full Address *</Label>
                <textarea
                  id="address"
                  name="address"
                  value={personalDetails.address}
                  onChange={handlePersonalChange}
                  placeholder="Enter your complete address"
                  className="flex min-h-20 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collegeName">College/Institution *</Label>
                <select
                  id="collegeName"
                  name="collegeName"
                  value={personalDetails.collegeName}
                  onChange={handlePersonalChange}
                  className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
                >
                  <option value="">Select College</option>
                  {colleges.map(college => (
                    <option key={college.id} value={college.name}>{college.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Input
                  id="course"
                  name="course"
                  value={personalDetails.course}
                  onChange={handlePersonalChange}
                  placeholder="e.g., B.Tech, MBBS, BA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearSemester">Year/Semester *</Label>
                <select
                  id="yearSemester"
                  name="yearSemester"
                  value={personalDetails.yearSemester}
                  onChange={handlePersonalChange}
                  className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>
            </div>
          </motion.div>
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {selectedRoute && (
              <Card variant="default">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Order Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route</span>
                      <span>{selectedRoute.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From - To</span>
                      <span>{selectedRoute.source} → {selectedRoute.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span>{selectedRoute.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass Validity</span>
                      <span>30 Days</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{selectedRoute.totalFare * 30}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {['UPI', 'Debit Card', 'Credit Card', 'Net Banking'].map(method => (
                  <Card
                    key={method}
                    variant={paymentMethod === method ? 'bordered' : 'interactive'}
                    className={`cursor-pointer ${paymentMethod === method ? 'ring-2 ring-primary border-primary' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <CardContent className="p-4 text-center">
                      <span className="font-medium">{method}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
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
            {steps.map((step, index) => (
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
                <Button onClick={nextStep}>
                  Next
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
