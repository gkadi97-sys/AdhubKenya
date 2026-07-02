import { useSEO } from '@/lib/useSEO';

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy | AdHub Kenya',
    description: 'Learn how AdHub Kenya collects, uses, and protects your personal data.',
    canonicalPath: '/privacy'
  });

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Privacy Policy</h1>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground">Last updated: July 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collection</h2>
          <p>
            We collect information you provide directly to us, such as your name, email address, phone number, and location when you register or post an ad.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Data</h2>
          <p>
            Your data is used to provide and improve our services, communicate with you, and facilitate transactions between buyers and sellers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. Your contact information is only shared with other users when you explicitly agree (e.g., when posting an ad or sending a message).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time through your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
