import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/contexts/AppContext';

interface RouteSelectionProps {
  routes: Route[];
  selectedRoute: Route | null;
  onRouteSelect: (route: Route) => void;
}

const RouteSelection: React.FC<RouteSelectionProps> = ({ routes, selectedRoute, onRouteSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {routes.map(route => (
          <Card
            key={route.id}
            variant={selectedRoute?.id === route.id ? 'bordered' : 'interactive'}
            className={`cursor-pointer ${selectedRoute?.id === route.id ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={() => onRouteSelect(route)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{route.name}</h4>
                    {selectedRoute?.id === route.id && (
                      <Badge variant="success">Selected</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {route.source}
                    </span>
                    <span>→</span>
                    <span>{route.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Distance: <strong>{route.distance} km</strong></span>
                    <span>Fare: <strong>₹{route.farePerKm}/km</strong></span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Stops: {route.stops.join(' → ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{route.totalFare * 30}</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedRoute && (
        <Card variant="bordered" className="bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Fare Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Fare ({selectedRoute.distance} km × ₹{selectedRoute.farePerKm})</span>
                <span>₹{selectedRoute.totalFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly (30 days)</span>
                <span>₹{selectedRoute.totalFare * 30}</span>
              </div>
              <div className="flex justify-between font-semibold text-primary pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{selectedRoute.totalFare * 30}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RouteSelection;
