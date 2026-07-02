import { useSEO } from '@/lib/useSEO';

export default function ReportPage() {
  useSEO({
    title: 'Report a Listing | AdHub Kenya',
    description: 'Report suspicious, fraudulent, or illegal listings on AdHub Kenya.',
    canonicalPath: '/report'
  });

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Report a Listing</h1>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground text-lg mb-8">
            Help us keep AdHub safe. If you see a listing that violates our policies, please let us know.
          </p>
          
          <div className="rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold mt-0 mb-4">How to report an ad</h2>
            <p>
              The fastest way to report an ad is directly from the listing page itself. 
              Click the <strong>"Report this listing"</strong> button located on the right side of the listing page.
            </p>
            <p className="mb-0">
              Alternatively, you can send an email to <strong>safety@adhub.co.ke</strong> with a link to the suspicious listing and a brief description of the issue. Our Trust & Safety team will review it within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
