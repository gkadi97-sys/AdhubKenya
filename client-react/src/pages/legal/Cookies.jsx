import { useSEO } from '@/lib/useSEO';

export default function CookiesPage() {
  useSEO({
    title: 'Cookie Policy | AdHub Kenya',
    description: 'Learn how AdHub Kenya uses cookies and similar technologies.',
    canonicalPath: '/cookies'
  });

  return (
    <div className="min-h-screen bg-background py-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Cookie Policy</h1>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-muted-foreground">Last updated: July 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What are cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How we use cookies</h2>
          <p>
            AdHub Kenya uses cookies for the following purposes:
          </p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the operation of our platform (e.g., keeping you logged in).</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Preference cookies:</strong> Remember your settings, such as language or dark mode preferences.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Managing cookies</h2>
          <p>
            You can control and manage cookies using your browser settings. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
          </p>
        </div>
      </div>
    </div>
  );
}
