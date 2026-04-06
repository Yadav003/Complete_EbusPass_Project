import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type College } from '@/services/resources.service';

interface PersonalDetails {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  collegeName: string;
  course: string;
  yearSemester: string;
}

interface BasicDetailsProps {
  personalDetails: PersonalDetails;
  colleges: College[];
  isLoadingColleges: boolean;
  onPersonalChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  personalDetails,
  colleges,
  isLoadingColleges,
  onPersonalChange,
}) => {
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
            onChange={onPersonalChange}
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
            onChange={onPersonalChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <select
            id="gender"
            name="gender"
            value={personalDetails.gender}
            onChange={onPersonalChange}
            className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
          >
            <option value="" disabled>Select Gender</option>
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
            onChange={onPersonalChange}
            placeholder="Enter mobile number"
            maxLength={10}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={personalDetails.email}
            onChange={onPersonalChange}
            placeholder="Enter email address"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Full Address *</Label>
          <textarea
            id="address"
            name="address"
            value={personalDetails.address}
            onChange={onPersonalChange}
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
            onChange={onPersonalChange}
            disabled={isLoadingColleges}
            className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
          >
            <option value="" disabled>
              {isLoadingColleges
                ? 'Loading colleges...'
                : colleges.length > 0
                  ? 'Select College'
                  : 'No colleges available'}
            </option>
            {colleges.map(college => (
              <option key={college._id} value={college.name}>{college.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course *</Label>
          <Input
            id="course"
            name="course"
            value={personalDetails.course}
            onChange={onPersonalChange}
            placeholder="e.g., B.Tech, MBBS, BA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearSemester">Year/Semester *</Label>
          <select
            id="yearSemester"
            name="yearSemester"
            value={personalDetails.yearSemester}
            onChange={onPersonalChange}
            className="flex h-11 w-full rounded-lg border-2 border-input bg-card px-4 py-2 text-sm"
          >
            <option value="" disabled>Select Year</option>
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
};

export default BasicDetails;
