import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bus, Clock, Landmark, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicSiteLayout from '@/components/layouts/PublicSiteLayout';

const AboutPage = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Trusted & Secure',
      description: 'Student data and uploaded documents are protected through secure application workflows.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Applications are verified quickly with a transparent status flow and clear approvals.',
    },
    {
      icon: Users,
      title: 'Student First',
      description: 'Designed around student convenience, with simpler forms and online support channels.',
    },
    {
      icon: Landmark,
      title: 'Government Backed',
      description: 'Built to align with official state transport rules and college verification standards.',
    },
  ];

  const milestones = [
    { year: '2022', detail: 'Digital bus-pass modernization initiative announced.' },
    { year: '2023', detail: 'Pilot launch across selected colleges and high-demand routes.' },
    { year: '2024', detail: 'Online application, document upload, and payment flow introduced.' },
    { year: '2025', detail: 'Expanded support coverage and centralized pass-management dashboard.' },
  ];

  const stats = [
    { value: '50,000+', label: 'Student Passes Issued' },
    { value: '500+', label: 'Institutions Supported' },
    { value: '200+', label: 'Routes in Network' },
    { value: '2-3 Days', label: 'Average Verification Time' },
  ];

  return (
    <PublicSiteLayout
      title="About eBusPass"
      description="eBusPass is a state-backed platform that helps students apply, verify, and manage transport passes through a secure, online-first system."
      heroBadge="About The Portal"
      heroActions={
        <>
          <Link to="/apply">
            <Button variant="hero" size="lg">
              Start Application
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/faq">
            <Button variant="outline" size="lg">
              View FAQs
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <Card variant="bordered" className="h-full">
              <CardContent className="pt-6">
                <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card variant="elevated" className="h-full">
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-display text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              We aim to reduce travel barriers for students by streamlining the bus-pass process and making it
              accessible from any device. The platform removes repetitive paperwork while improving transparency for
              colleges, transport officials, and applicants.
            </p>
            <p className="text-muted-foreground">
              By moving application and verification online, students can focus on academics while tracking every step
              of their pass request in real time.
            </p>
          </CardContent>
        </Card>

        <Card variant="glass" className="h-full">
          <CardContent className="pt-6">
            <h2 className="font-display text-2xl font-bold mb-4">How The System Helps</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Bus className="w-5 h-5 text-primary mt-0.5" />
                Reliable route selection for daily student commute requirements.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                Secure document submission and identity-aware verification checkpoints.
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                Faster approvals compared to manual, office-based processing.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card variant="default">
        <CardContent className="pt-6">
          <h2 className="font-display text-2xl font-bold mb-6">Core Values</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <Card variant="interactive" className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <value.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold mb-5">Program Milestones</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {milestones.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card variant="bordered">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="w-16 shrink-0 rounded-md bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center py-2">
                    {item.year}
                  </div>
                  <p className="text-muted-foreground">{item.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </PublicSiteLayout>
  );
};

export default AboutPage;
