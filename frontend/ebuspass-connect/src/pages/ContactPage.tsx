import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import PublicSiteLayout from '@/components/layouts/PublicSiteLayout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields before submitting.');
      return;
    }

    toast.success('Your message has been submitted. Support will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <PublicSiteLayout
      title="Contact & Support"
      description="Need help with application status, route selection, payments, or document upload? Reach the eBusPass support team through the channels below."
      heroBadge="Support Center"
      heroActions={
        <>
          <a href="tel:1800-000-0000">
            <Button variant="hero" size="lg">
              Call Helpline
              <Phone className="w-4 h-4" />
            </Button>
          </a>
          <Link to="/faq">
            <Button variant="outline" size="lg">
              Browse FAQs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="pt-6">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Helpline</h3>
            <p className="text-muted-foreground text-sm">1800-XXX-XXXX</p>
            <p className="text-muted-foreground text-sm mt-1">Toll free support for students</p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Email</h3>
            <p className="text-muted-foreground text-sm">support@ebuspass.gov.in</p>
            <p className="text-muted-foreground text-sm mt-1">For non-urgent and document-related queries</p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Clock3 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Working Hours</h3>
            <p className="text-muted-foreground text-sm">Monday to Saturday</p>
            <p className="text-muted-foreground text-sm mt-1">9:00 AM to 6:00 PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-3"
        >
          <Card variant="elevated">
            <CardContent className="pt-6">
              <h2 className="font-display text-2xl font-bold mb-1">Send Us a Message</h2>
              <p className="text-muted-foreground text-sm mb-5">Fields marked with * are required.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      value={formData.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Mobile Number</Label>
                    <Input
                      id="contact-phone"
                      value={formData.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject *</Label>
                    <Input
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(event) => updateField('subject', event.target.value)}
                      placeholder="Application / Payment / Route / Other"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    placeholder="Please share your issue with application number if available"
                    className="min-h-32"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Submit Request
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card variant="glass">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-3">Office Address</h3>
              <p className="text-muted-foreground flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                State Transport Department, Government Complex, Main Road, City - 123456
              </p>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-3">Quick Support Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Keep your application ID ready before calling support.</li>
                <li>Use your registered email while raising ticket queries.</li>
                <li>Attach clear document screenshots for faster resolution.</li>
                <li>Check FAQ first for common verification and payment issues.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PublicSiteLayout>
  );
};

export default ContactPage;
