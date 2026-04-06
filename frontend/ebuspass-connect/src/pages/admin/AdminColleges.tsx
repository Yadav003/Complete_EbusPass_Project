import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { collegeService, type College } from '@/services/resources.service';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';

const EMPTY_FORM = { name: '', address: '', district: '' };

const AdminColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCollegeId, setDeletingCollegeId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    const loadColleges = async () => {
      try {
        const data = await collegeService.getColleges();
        setColleges(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load colleges';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      district: formData.district.trim(),
    };

    if (!payload.name || !payload.address || !payload.district) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCollege) {
        const updatedCollege = await collegeService.updateCollege(editingCollege._id, payload);
        setColleges((prevColleges) =>
          prevColleges.map((college) => (college._id === updatedCollege._id ? updatedCollege : college)),
        );
        toast.success('College updated successfully');
      } else {
        const createdCollege = await collegeService.createCollege(payload);
        setColleges((prevColleges) => [createdCollege, ...prevColleges]);
        toast.success('College added successfully');
      }

      setFormData(EMPTY_FORM);
      setEditingCollege(null);
      setShowDialog(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save college';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({ name: college.name, address: college.address, district: college.district });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this college?')) {
      return;
    }

    try {
      setDeletingCollegeId(id);
      await collegeService.deleteCollege(id);
      setColleges((prevColleges) => prevColleges.filter((college) => college._id !== id));
      toast.success('College deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete college';
      toast.error(message);
    } finally {
      setDeletingCollegeId(null);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingCollege(null);
    setFormData(EMPTY_FORM);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className='mt-4'>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              College Management
            </h1>
            <p className="text-muted-foreground">
              Add, edit, or remove colleges from the system
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCollege(null); setFormData(EMPTY_FORM); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCollege ? 'Edit College' : 'Add New College'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">College Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter college name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Enter district"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {editingCollege ? 'Update' : 'Add'} College
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Colleges Grid */}
        {isLoading ? (
          <p className="text-muted-foreground">Loading colleges...</p>
        ) : colleges.length === 0 ? (
          <p className="text-muted-foreground">No colleges found. Add your first college.</p>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((college, index) => (
            <motion.div
              key={college._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card variant="interactive">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{college.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{college.address}</p>
                      <p className="text-xs text-muted-foreground">{college.district}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(college)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      disabled={deletingCollegeId === college._id}
                      onClick={() => handleDelete(college._id)}
                    >
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

export default AdminColleges;
