import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp, Route } from '@/contexts/AppContext';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';

const AdminRoutes = () => {
  const { routes, addRoute, updateRoute, deleteRoute } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    destination: '',
    stops: '',
    distance: '',
    farePerKm: '2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.source || !formData.destination || !formData.distance) {
      toast.error('Please fill all required fields');
      return;
    }

    const distance = parseFloat(formData.distance);
    const farePerKm = parseFloat(formData.farePerKm);
    const routeData = {
      name: formData.name,
      source: formData.source,
      destination: formData.destination,
      stops: formData.stops.split(',').map(s => s.trim()).filter(Boolean),
      distance,
      farePerKm,
      totalFare: distance * farePerKm
    };

    if (editingRoute) {
      updateRoute(editingRoute.id, routeData);
      toast.success('Route updated successfully');
    } else {
      addRoute(routeData);
      toast.success('Route added successfully');
    }

    resetForm();
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      source: route.source,
      destination: route.destination,
      stops: route.stops.join(', '),
      distance: route.distance.toString(),
      farePerKm: route.farePerKm.toString()
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      deleteRoute(id);
      toast.success('Route deleted');
    }
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingRoute(null);
    setFormData({ name: '', source: '', destination: '', stops: '', distance: '', farePerKm: '2' });
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
              Route Management
            </h1>
            <p className="text-muted-foreground">
              Manage bus routes, distances, and fares
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Route A - Central Line"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder="Starting point"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="End point"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stops">Stops (comma-separated)</Label>
                  <Input
                    id="stops"
                    value={formData.stops}
                    onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                    placeholder="Stop 1, Stop 2, Stop 3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      placeholder="15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farePerKm">Fare per km (₹)</Label>
                    <Input
                      id="farePerKm"
                      type="number"
                      value={formData.farePerKm}
                      onChange={(e) => setFormData({ ...formData, farePerKm: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                </div>
                {formData.distance && formData.farePerKm && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Calculated Fare:</div>
                    <div className="text-lg font-bold text-primary">
                      ₹{(parseFloat(formData.distance) * parseFloat(formData.farePerKm)).toFixed(2)} per trip
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{(parseFloat(formData.distance) * parseFloat(formData.farePerKm) * 30).toFixed(2)} monthly
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingRoute ? 'Update' : 'Add'} Route
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Routes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card variant="interactive">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {route.source} → {route.destination}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="p-2 bg-muted rounded">
                      <div className="text-lg font-bold">{route.distance}</div>
                      <div className="text-xs text-muted-foreground">km</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="text-lg font-bold">₹{route.farePerKm}</div>
                      <div className="text-xs text-muted-foreground">per km</div>
                    </div>
                    <div className="p-2 bg-primary/10 rounded">
                      <div className="text-lg font-bold text-primary">₹{route.totalFare}</div>
                      <div className="text-xs text-muted-foreground">daily</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Stops: {route.stops.join(' → ')}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(route)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(route.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminRoutes;
