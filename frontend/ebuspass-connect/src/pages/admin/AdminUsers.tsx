import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, ShieldCheck, User } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService, type AdminUser } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'student'>('all');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.users);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load users';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSearch =
        !normalizedSearch ||
        user.fullname.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.mobile.toLowerCase().includes(normalizedSearch);

      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalAdmins: users.filter((user) => user.role === 'admin').length,
      totalStudents: users.filter((user) => user.role === 'student').length,
    };
  }, [users]);

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'N/A';
    return parsedDate.toLocaleDateString();
  };

  const handleRoleChange = async (selectedUser: AdminUser) => {
    const nextRole = selectedUser.role === 'admin' ? 'student' : 'admin';
    const confirmed = confirm(`Change role for ${selectedUser.fullname} to ${nextRole}?`);

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(selectedUser._id);
      const updatedUser = await adminService.updateUserRole(selectedUser._id, nextRole);
      setUsers((previousUsers) =>
        previousUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)),
      );
      toast.success(`Role updated to ${updatedUser.role}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update role';
      toast.error(message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">View all registered users, including admins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Admins</p>
                  <p className="text-2xl font-semibold">{stats.totalAdmins}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-2xl font-semibold">{stats.totalStudents}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, email, or mobile"
                  className="pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as 'all' | 'admin' | 'student')}
                className="h-11 rounded-lg border-2 border-input bg-card px-4 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="student">Students</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-4 px-4 font-medium">Name</th>
                      <th className="text-left py-4 px-4 font-medium">Email</th>
                      <th className="text-left py-4 px-4 font-medium">Mobile</th>
                      <th className="text-left py-4 px-4 font-medium">Role</th>
                      <th className="text-left py-4 px-4 font-medium">Registered On</th>
                      <th className="text-left py-4 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const isCurrentUser = currentUser?.id === user._id;
                      const isUpdating = updatingUserId === user._id;

                      return (
                        <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4 font-medium">{user.fullname}</td>
                          <td className="py-4 px-4">{user.email}</td>
                          <td className="py-4 px-4">{user.mobile}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-foreground'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">{formatDate(user.createdAt)}</td>
                          <td className="py-4 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isCurrentUser || isUpdating}
                              onClick={() => handleRoleChange(user)}
                              title={isCurrentUser ? 'You cannot change your own role' : ''}
                            >
                              {isUpdating
                                ? 'Updating...'
                                : user.role === 'admin'
                                  ? 'Make Student'
                                  : 'Make Admin'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
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

export default AdminUsers;
