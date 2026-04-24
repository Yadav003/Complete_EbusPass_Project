import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PublicSiteLayout from '@/components/layouts/PublicSiteLayout';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  hint: string;
  items: FaqItem[];
}

const FAQPage = () => {
  const [query, setQuery] = useState('');

  const categories: FaqCategory[] = [
    {
      title: 'Application Process',
      hint: 'Everything from registration to submission',
      items: [
        {
          question: 'Who can apply for a student eBusPass?',
          answer:
            'Students enrolled in recognized schools, colleges, or universities under the state transport jurisdiction can apply by providing valid identity and institution details.',
        },
        {
          question: 'How do I start a new application?',
          answer:
            'Create an account, complete your profile, upload required documents, select your route, and complete payment from the Apply flow in your dashboard.',
        },
        {
          question: 'Can I save and continue the application later?',
          answer:
            'Yes. Your progress is stored step-wise, so you can return and continue without re-entering previously completed sections.',
        },
        {
          question: 'How long does approval usually take?',
          answer:
            'Most applications are processed within 2 to 3 working days, depending on document verification and institution validation.',
        },
      ],
    },
    {
      title: 'Documents & Verification',
      hint: 'Required files and validation issues',
      items: [
        {
          question: 'Which documents are mandatory?',
          answer:
            'Typically Aadhaar/identity proof, student or college ID, and a passport-size photograph are required. Additional documents may be requested in specific cases.',
        },
        {
          question: 'What file format should I upload?',
          answer:
            'Use clear JPG, JPEG, or PNG files where text and photos are readable. Avoid blurry, cropped, or password-protected files.',
        },
        {
          question: 'Why was my application marked for review?',
          answer:
            'Manual review can be triggered by mismatched details, unreadable uploads, duplicate records, or route-data inconsistencies. Update requested fields and resubmit.',
        },
      ],
    },
    {
      title: 'Payment & Pass Validity',
      hint: 'Fees, receipts, and renewal timeline',
      items: [
        {
          question: 'What payment options are available?',
          answer:
            'You can complete payment through supported digital methods shown on the payment step. Ensure payment is completed in a single uninterrupted session when possible.',
        },
        {
          question: 'How do I verify payment success?',
          answer:
            'Check your application status and payment section in the dashboard. A successful transaction will show as completed with reference details.',
        },
        {
          question: 'How long is the bus pass valid?',
          answer:
            'Validity is linked to the active academic period and approved route. Expiry details are available in your issued pass information.',
        },
        {
          question: 'Can I renew an existing pass online?',
          answer:
            'Yes. Eligible users can submit a renewal request through the portal, update changed details, and complete payment for the new term.',
        },
      ],
    },
    {
      title: 'Route & Account Management',
      hint: 'Changing routes and profile details',
      items: [
        {
          question: 'Can I change my selected route after submission?',
          answer:
            'Route changes are limited once verification starts. Use support with your application ID for route correction requests.',
        },
        {
          question: 'What should I do if I entered wrong details?',
          answer:
            'Update editable sections before final approval. If editing is locked, contact support and mention the field corrections needed.',
        },
        {
          question: 'I cannot log in to my account. What should I do?',
          answer:
            'Confirm your credentials and try again. If access still fails, use support and provide your registered email/mobile for account verification.',
        },
      ],
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          return (
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery) ||
            category.title.toLowerCase().includes(normalizedQuery)
          );
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, normalizedQuery]);

  const totalQuestions = filteredCategories.reduce((count, category) => count + category.items.length, 0);

  return (
    <PublicSiteLayout
      title="Frequently Asked Questions"
      description="Find clear answers about applications, documents, payment, pass validity, and route changes."
      heroBadge="Help & Guidance"
      heroActions={
        <>
          <Link to="/contact">
            <Button variant="hero" size="lg">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/apply">
            <Button variant="outline" size="lg">
              Start Application
            </Button>
          </Link>
        </>
      }
    >
      <Card variant="glass" className="mb-8">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-3">
              <label htmlFor="faq-search" className="text-sm font-medium text-foreground block mb-2">
                Search questions
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="faq-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Try: payment status, document upload, route change"
                />
              </div>
            </div>
            <div className="md:col-span-2 text-sm text-muted-foreground md:text-right">
              {totalQuestions} result{totalQuestions === 1 ? '' : 's'} found
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCategories.length === 0 ? (
        <Card variant="default">
          <CardContent className="pt-6 text-center">
            <CircleHelp className="w-8 h-8 mx-auto text-primary mb-3" />
            <h2 className="font-display text-xl font-bold mb-2">No matching FAQs found</h2>
            <p className="text-muted-foreground mb-4">Try a different keyword or contact support for direct help.</p>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.title} variant="default">
              <CardContent className="pt-6">
                <h2 className="font-display text-xl font-bold">{category.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{category.hint}</p>

                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={item.question} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PublicSiteLayout>
  );
};

export default FAQPage;
