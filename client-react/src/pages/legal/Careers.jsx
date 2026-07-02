import { useSEO } from '@/lib/useSEO';

export default function CareersPage() {
  useSEO({
    title: 'Careers | AdHub Kenya',
    description: 'Join the team building the best marketplace in Kenya.',
    canonicalPath: '/careers'
  });

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Careers at AdHub</h1>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground text-lg mb-8">
            We are always looking for talented individuals to join our team in Nairobi.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Open Positions</h2>
          <div className="rounded-lg border border-border p-6 text-center bg-card">
            <p className="text-muted-foreground">There are currently no open positions. Check back soon!</p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">General Inquiries</h2>
          <p>
            Don't see a position that fits? We still want to hear from you. Send your CV to <strong>careers@adhub.co.ke</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
