import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Scale, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicSiteLayout from '@/components/layouts/PublicSiteLayout';

const TermsOfServicePage = () => {
  return (
    <PublicSiteLayout
      title="Terms of Service"
      description="These terms define the rules for using the eBusPass platform and related student transport services."
      heroBadge="Legal"
      heroActions={
        <>
          <Link to="/privacy-policy">
            <Button variant="outline" size="lg">
              View Privacy Policy
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="hero" size="lg">
              Create Account
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card variant="bordered">
          <CardContent className="pt-6">
            <FileText className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">Eligibility</h2>
            <p className="text-sm text-muted-foreground">
              Use of this portal is intended for eligible students applying for government-approved travel concessions.
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <ShieldCheck className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">Account Responsibility</h2>
            <p className="text-sm text-muted-foreground">
              You are responsible for maintaining accurate profile details and keeping your login credentials secure.
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <Scale className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">Policy Compliance</h2>
            <p className="text-sm text-muted-foreground">
              Applications must follow transport department guidelines and may be reviewed, approved, or rejected.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card variant="default">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h3 className="font-display text-xl font-bold mb-2">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By creating an account or using eBusPass services, you agree to these Terms of Service and applicable
              government transport regulations.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">2. Account Registration</h3>
            <p className="text-muted-foreground">
              You must provide truthful, complete, and up-to-date information during registration and application steps.
              Any false or misleading data can result in suspension, rejection, or cancellation of bus-pass benefits.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">3. Documents and Verification</h3>
            <p className="text-muted-foreground">
              Uploaded documents must be clear and valid. The administration may request additional verification,
              reject unreadable files, or flag inconsistent records for manual review.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">4. Payments and Refunds</h3>
            <p className="text-muted-foreground">
              Payment confirmation is required for pass issuance where applicable. Refunds, if allowed, are processed
              only under transport department rules and approved dispute workflows.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">5. Service Availability</h3>
            <p className="text-muted-foreground">
              We aim for reliable service but may perform maintenance, updates, or temporary downtime. Platform features
              may change to reflect policy updates or operational needs.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">6. Prohibited Use</h3>
            <p className="text-muted-foreground">
              You may not misuse the system through identity impersonation, unauthorized access attempts, data scraping,
              or fraudulent applications. Violations may lead to legal action.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">7. Changes to Terms</h3>
            <p className="text-muted-foreground">
              Terms may be revised when required by law, policy, or service improvements. Continued use after updates
              indicates acceptance of revised terms.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">8. Contact</h3>
            <p className="text-muted-foreground">
              For questions regarding these terms, visit the contact page and raise a support request with your
              registered details.
            </p>
          </section>

          <p className="text-sm text-muted-foreground border-t border-border pt-4">Effective Date: April 24, 2026</p>
        </CardContent>
      </Card>
    </PublicSiteLayout>
  );
};

export default TermsOfServicePage;
