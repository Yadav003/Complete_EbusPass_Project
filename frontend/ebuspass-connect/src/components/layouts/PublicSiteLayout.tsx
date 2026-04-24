import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PublicSiteLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  heroBadge?: string;
  heroActions?: React.ReactNode;
  className?: string;
}

const PublicSiteLayout = ({
  title,
  description,
  children,
  heroBadge,
  heroActions,
  className,
}: PublicSiteLayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Bus className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">eBusPass</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Link to="/apply">
                  <Button>Apply Now</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="pt-28 pb-10 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto">
          {heroBadge ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              {heroBadge}
            </div>
          ) : null}
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
          {heroActions ? <div className="mt-7 flex flex-wrap gap-4">{heroActions}</div> : null}
        </div>
      </section>

      <main className={cn('pb-20 px-4', className)}>
        <div className="container mx-auto">{children}</div>
      </main>

      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Bus className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl">eBusPass</span>
              </div>
              <p className="text-background/70 text-sm">Official Student Bus Pass Management Portal</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link to="/" className="hover:text-background transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-background transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-background transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-background transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:text-background transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-background transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Helpline: 1800-XXX-XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@ebuspass.gov.in
                </li>
                <li>Mon-Sat: 9:00 AM - 6:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Address</h4>
              <p className="text-sm text-background/70">
                State Transport Department
                <br />
                Government Complex, Main Road
                <br />
                City - 123456
              </p>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
            {new Date().getFullYear()} eBusPass. All rights reserved. | Government of State
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSiteLayout;
