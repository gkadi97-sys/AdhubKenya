import { useSEO } from '@/lib/useSEO';
import { Target, Zap } from 'lucide-react';

export default function AboutPage() {
  useSEO({
    title: 'About Us | AdHub Kenya',
    description: 'Learn about AdHub Kenya, our mission, and our vision for digital classifieds in Kenya.',
    canonicalPath: '/about'
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Section */}
      <div className="bg-secondary/30 py-20 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-6">Connecting Kenya, <br/><span className="text-primary">One Ad at a Time</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AdHub Kenya is building the most trusted, modern, and efficient marketplace for buyers and sellers across all 47 counties.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">To empower individuals and businesses in Kenya to trade easily and safely.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trust First</h3>
            <p className="text-muted-foreground">We prioritize security with verified profiles and smart fraud detection systems.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast & Modern</h3>
            <p className="text-muted-foreground">Built on modern technology to ensure blazing fast searches and smooth experiences.</p>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2>Our Story</h2>
          <p>
            Founded in 2026, AdHub Kenya started with a simple observation: existing classifieds platforms in the region were cluttered, slow, and plagued by trust issues. We believed Kenyans deserved better.
          </p>
          <p>
            We built AdHub from the ground up to be mobile-first, blazingly fast, and deeply integrated with local needs. From our unique auto-spares compatibility matrix to our dedicated CV and job seeking tools, every feature is designed with the Kenyan market in mind.
          </p>
          
          <h2>Looking Forward</h2>
          <p>
            We are continuously improving our platform, adding new features, and working with our community to make AdHub the undisputed number one destination for online trading in East Africa.
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline dummy component for Shield as it wasn't imported
function Shield(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
}
