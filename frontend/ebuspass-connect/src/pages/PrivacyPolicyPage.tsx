import { Link } from 'react-router-dom';
import { ArrowRight, Database, Lock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicSiteLayout from '@/components/layouts/PublicSiteLayout';

const PrivacyPolicyPage = () => {
  return (
    <PublicSiteLayout
      title="Privacy Policy"
      description="This policy explains how eBusPass collects, uses, and protects your personal information."
      heroBadge="Legal"
      heroActions={
        <>
          <Link to="/terms-of-service">
            <Button variant="outline" size="lg">
              View Terms of Service
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="hero" size="lg">
              Contact Support
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card variant="bordered">
          <CardContent className="pt-6">
            <Database className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">Data Collection</h2>
            <p className="text-sm text-muted-foreground">
              We collect account, application, and payment-related details needed to process student bus-pass requests.
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <Lock className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">Data Security</h2>
            <p className="text-sm text-muted-foreground">
              Reasonable security controls are used to protect uploaded documents and user account information.
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <UserCheck className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold mb-2">User Rights</h2>
            <p className="text-sm text-muted-foreground">
              You can request correction of inaccurate profile details and seek assistance on privacy-related concerns.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card variant="default">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h3 className="font-display text-xl font-bold mb-2">1. Information We Collect</h3>
            <p className="text-muted-foreground">
              We may collect your name, email, mobile number, institution details, route preferences, identity
              documents, and transaction references necessary for eligibility checks and pass issuance.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">2. How We Use Information</h3>
            <p className="text-muted-foreground">
              Your data is used to verify identity, validate student status, process applications, manage approvals,
              support route allocation, and provide updates related to pass lifecycle events.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">3. Sharing of Information</h3>
            <p className="text-muted-foreground">
              Data may be shared only with authorized transport officials, verification teams, payment processors, and
              technical partners as needed for platform operations and legal compliance.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">4. Data Retention</h3>
            <p className="text-muted-foreground">
              Information is retained for the period required by administrative, auditing, and legal obligations. Data
              may be archived or removed according to official retention schedules.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">5. Security Measures</h3>
            <p className="text-muted-foreground">
              We use industry-standard safeguards to reduce unauthorized access risk. However, no online platform can
              guarantee absolute security in all circumstances.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">6. Your Choices</h3>
            <p className="text-muted-foreground">
              You can update profile information through the portal. For sensitive corrections or account issues,
              contact support with your registered details and application reference.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">7. Policy Updates</h3>
            <p className="text-muted-foreground">
              This policy may be updated periodically to reflect legal or operational changes. Updated versions will be
              published on this page.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl font-bold mb-2">8. Contact Us</h3>
            <p className="text-muted-foreground">
              If you have privacy concerns, reach out through the contact page and include enough detail to help us
              verify and address your request.
            </p>
          </section>

          <p className="text-sm text-muted-foreground border-t border-border pt-4">Effective Date: April 24, 2026</p>
        </CardContent>
      </Card>
    </PublicSiteLayout>
  );
};

export default PrivacyPolicyPage;
