import { useSEO } from '@/lib/useSEO';
import { HelpCircle, Search, MessageSquare, Shield, FileText } from 'lucide-react';

export default function HelpPage() {
  useSEO({
    title: 'Help Centre | AdHub Kenya',
    description: 'Find answers to frequently asked questions and learn how to use AdHub Kenya.',
    canonicalPath: '/help'
  });

  const faqs = [
    {
      q: "How do I post an ad?",
      a: "Click the 'Post Ad' button in the navigation bar. You will need to create an account or sign in first. Follow the steps to add photos, title, price, and details."
    },
    {
      q: "Is it free to post ads?",
      a: "Yes, basic ads are completely free to post. We also offer premium promotional options for sellers who want more visibility."
    },
    {
      q: "How do I contact a seller?",
      a: "On the listing page, you can use the 'Chat on WhatsApp' button or the 'Message' button to contact the seller directly."
    },
    {
      q: "How do I edit or delete my ad?",
      a: "Go to 'My Ads' from your profile menu. There you will see options to Edit, Promote, or Delete your active listings."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">How can we help?</h1>
          
          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input type="text" placeholder="Search for help..." className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-lg" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition cursor-pointer">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Buying & Selling</h3>
            <p className="text-sm text-muted-foreground">Guides on how to transact safely and effectively.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition cursor-pointer">
            <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Trust & Safety</h3>
            <p className="text-sm text-muted-foreground">Learn about verified profiles and scam prevention.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition cursor-pointer">
            <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">My Account</h3>
            <p className="text-sm text-muted-foreground">Manage your profile, ads, and settings.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-card border border-border rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground outline-none">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still can't find what you're looking for?</p>
          <a href="/contact" className="inline-flex bg-primary/10 text-primary font-bold py-3 px-6 rounded-xl hover:bg-primary/20 transition">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
