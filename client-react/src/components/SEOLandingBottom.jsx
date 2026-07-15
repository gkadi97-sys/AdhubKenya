import { CATEGORY_ICONS } from '@/lib/categoryData';

export default function SEOLandingBottom({ category, brand, model }) {
  if (!category) return null;

  const catName = CATEGORY_ICONS.find(c => c.slug === category)?.name || category.replace(/-/g, ' ');
  const targetEntity = [brand, model, catName.toLowerCase()].filter(Boolean).join(' ');
  const displayEntity = brand || model ? targetEntity : catName;

  return (
    <div className="w-full bg-secondary/20 border-t border-border mt-16 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEO Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-display font-extrabold text-foreground mb-4 capitalize">
            Buying {displayEntity} in Kenya
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about finding the best deals on {targetEntity} across Nairobi, Mombasa, and the rest of Kenya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Guide Section */}
          <section>
            <h3 className="text-xl font-bold mb-4 capitalize">Ultimate {displayEntity} Buying Guide</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                When searching for <strong>{targetEntity}</strong> on AdHub Kenya, it's important to compare prices and check the condition of the items. Our verified sellers offer a wide range of both new and used options to fit any budget.
              </p>
              <p>
                <strong>Pro Tip:</strong> Always insist on meeting in a safe, public place when finalizing a transaction. If an offer for {targetEntity} seems too good to be true, it probably is. Check seller ratings and reviews before buying.
              </p>
              <p>
                Whether you're looking in Nairobi, Kisumu, Nakuru, or Eldoret, our platform connects you with local sellers, eliminating middlemen and hidden fees.
              </p>
            </div>
          </section>

          {/* FAQ Section with Microdata/JSON-LD structure */}
          <section>
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-semibold text-foreground text-base mb-1 capitalize" itemProp="name">
                  Are {targetEntity} prices negotiable on AdHub?
                </h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-muted-foreground" itemProp="text">
                    Yes! Many sellers list their {targetEntity} as negotiable. Look for the "Negotiable" badge on listings and message the seller directly to make an offer.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-semibold text-foreground text-base mb-1 capitalize" itemProp="name">
                  How can I find cheap {targetEntity} in Kenya?
                </h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-muted-foreground" itemProp="text">
                    Use our advanced filters to sort by "Price: Low → High". You can also set a maximum budget to only see {targetEntity} that fit your exact price range.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-semibold text-foreground text-base mb-1 capitalize" itemProp="name">
                  Can I pay for {targetEntity} using M-PESA?
                </h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-muted-foreground" itemProp="text">
                    Most sellers in Kenya prefer M-PESA. However, AdHub Kenya does not process payments. You will arrange the payment directly with the seller upon inspection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
