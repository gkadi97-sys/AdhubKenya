import { useSEO } from '@/lib/useSEO';

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service | AdHub Kenya',
    description: 'Read the terms of service and user agreement for AdHub Kenya.',
    canonicalPath: '/terms'
  });

  return (
    <div className="min-h-screen bg-background py-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Terms of Service</h1>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground">Last updated: July 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AdHub Kenya, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Conduct</h2>
          <p>
            Users are responsible for all content they post on AdHub Kenya. You agree not to post any illegal, offensive, or counterfeit items. We reserve the right to remove any listing or suspend any account that violates these terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Privacy Policy</h2>
          <p>
            Your use of AdHub Kenya is also governed by our Privacy Policy. Please review it to understand our practices regarding your personal data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitation of Liability</h2>
          <p>
            AdHub Kenya acts as a marketplace to connect buyers and sellers. We do not guarantee the quality, safety, or legality of items advertised. You agree to use the service at your own risk.
          </p>
        </div>
      </div>
    </div>
  );
}
