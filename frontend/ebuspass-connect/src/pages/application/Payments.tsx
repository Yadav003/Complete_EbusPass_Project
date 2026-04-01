import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Route } from '@/contexts/AppContext';

interface PaymentsProps {
  selectedRoute: Route | null;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const Payments: React.FC<PaymentsProps> = ({ selectedRoute, paymentMethod, onPaymentMethodChange }) => {
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
              onClick={() => onPaymentMethodChange(method)}
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
};

export default Payments;
