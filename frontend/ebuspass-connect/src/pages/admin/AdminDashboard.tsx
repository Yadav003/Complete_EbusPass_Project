import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Clock, IndianRupee, TrendingUp, Bus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/layouts/AdminLayout';

const AdminDashboard = () => {
  const { applications, colleges, routes } = useApp();

  const stats = {
    totalApplications: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    pending: applications.filter(a => a.status === 'pending' || a.status === 'under_review').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    totalRevenue: applications.filter(a => a.payment.status === 'completed').reduce((sum, a) => sum + a.payment.amount, 0),
    totalColleges: colleges.length,
    totalRoutes: routes.length,
  };

  const statCards = [
    { title: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'bg-primary/10 text-primary' },
    { title: 'Approved Passes', value: stats.approved, icon: CheckCircle, color: 'bg-success/10 text-success' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-warning/10 text-warning' },
    { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-destructive/10 text-destructive' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-accent/10 text-accent' },
    { title: 'Active Routes', value: stats.totalRoutes, icon: Bus, color: 'bg-info/10 text-info' },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of the eBusPass management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">College</th>
                      <th className="text-left py-3 px-4 font-medium">Route</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 10).map(app => (
                      <tr key={app.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs">{app.id.slice(0, 12)}</td>
                        <td className="py-3 px-4">{app.personalDetails.fullName}</td>
                        <td className="py-3 px-4">{app.personalDetails.collegeName}</td>
                        <td className="py-3 px-4">{app.route.source} → {app.route.destination}</td>
                        <td className="py-3 px-4">₹{app.payment.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'approved' ? 'bg-success/20 text-success' :
                            app.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                            'bg-warning/20 text-warning'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
