import { useSEO } from '@/lib/useSEO';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  useSEO({
    title: 'Contact Us | AdHub Kenya',
    description: 'Get in touch with the AdHub Kenya support team.',
    canonicalPath: '/contact'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setLoading(false);
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Your Name</label>
                <input required type="text" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email Address</label>
                <input required type="email" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Subject</label>
                <select className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option>General Inquiry</option>
                  <option>Support/Help</option>
                  <option>Report an Issue</option>
                  <option>Business/Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Message</label>
                <textarea required rows="5" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-70">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in touch directly</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-muted-foreground">For general inquiries and support.</p>
                    <a href="mailto:support@adhubkenya.co.ke" className="text-primary font-semibold hover:underline">support@adhubkenya.co.ke</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phone</h3>
                    <p className="text-muted-foreground">Mon-Fri from 8am to 5pm.</p>
                    <a href="tel:+254700000000" className="text-primary font-semibold hover:underline">+254 700 000 000</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Office</h3>
                    <p className="text-muted-foreground">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
