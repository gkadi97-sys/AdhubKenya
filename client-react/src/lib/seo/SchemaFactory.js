/**
 * SchemaFactory.js
 * Central factory for generating JSON-LD Schema.org structured data.
 */

const BASE_URL = 'https://adhubkenya.co.ke';

class SchemaFactory {
  static generate(type, data) {
    if (!data) return null;

    const baseContext = { '@context': 'https://schema.org' };

    switch (type) {
      case 'Product':
        return { ...baseContext, ...this._buildProduct(data) };
      case 'Vehicle':
        return { ...baseContext, ...this._buildVehicle(data) };
      case 'Residence':
      case 'Apartment':
      case 'House':
        return { ...baseContext, ...this._buildProperty(type, data) };
      case 'JobPosting':
        return { ...baseContext, ...this._buildJobPosting(data) };
      case 'BreadcrumbList':
        return { ...baseContext, ...this._buildBreadcrumbList(data) };
      case 'FAQPage':
        return { ...baseContext, ...this._buildFAQPage(data) };
      case 'Person':
        return { ...baseContext, ...this._buildPerson(data) };
      case 'Organization':
      case 'LocalBusiness':
        return { ...baseContext, ...this._buildOrganization(type, data) };
      case 'Offer':
        return this._buildOffer(data); 
      case 'AggregateRating':
        return this._buildAggregateRating(data); 
      case 'Review':
        return { ...baseContext, ...this._buildReview(data) };
      case 'CollectionPage':
        return { ...baseContext, '@type': 'CollectionPage', ...data };
      case 'SearchResultsPage':
        return { ...baseContext, '@type': 'SearchResultsPage', ...data };
      case 'WebSite':
        return { ...baseContext, '@type': 'WebSite', ...data };
      case 'WebPage':
        return { ...baseContext, '@type': 'WebPage', ...data };
      case 'ItemList':
        return {
          ...baseContext,
          '@type': 'ItemList',
          itemListElement: (data.items || []).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://adhubkenya.co.ke/listing/${item.slug || item.id}`
          }))
        };
      case 'OfferCatalog':
        return {
          ...baseContext,
          '@type': 'OfferCatalog',
          name: data.name,
          itemListElement: (data.items || []).map((item) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: item.title,
            }
          }))
        };
      case 'ImageObject':
        return {
          ...baseContext,
          '@type': 'ImageObject',
          contentUrl: data.url ? `${BASE_URL}${data.url}` : undefined,
          name: data.name,
          description: data.description
        };
      default:
        console.warn(`[SchemaFactory] Unsupported schema type: ${type}`);
        return { ...baseContext, '@type': type, ...data };
    }
  }

  static _buildProduct(data) {
    return {
      '@type': 'Product',
      name: data.name || data.title,
      description: data.description,
      image: data.image || data.images,
      brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
      offers: data.offers ? this._buildOffer(data.offers) : undefined,
      aggregateRating: data.rating ? this._buildAggregateRating(data.rating) : undefined,
    };
  }

  static _buildVehicle(data) {
    const product = this._buildProduct(data);
    return {
      ...product,
      '@type': 'Vehicle',
      vehicleConfiguration: data.trim,
      vehicleModelDate: data.year,
      mileageFromOdometer: data.mileage ? {
        '@type': 'QuantitativeValue',
        value: data.mileage,
        unitCode: 'KMT'
      } : undefined,
      vehicleTransmission: data.transmission,
      fuelType: data.fuelType
    };
  }

  static _buildProperty(type, data) {
    return {
      '@type': type,
      name: data.name || data.title,
      description: data.description,
      image: data.image || data.images,
      numberOfBedrooms: data.bedrooms,
      numberOfBathrooms: data.bathrooms,
      floorSize: data.size ? {
        '@type': 'QuantitativeValue',
        value: data.size,
        unitCode: 'SQM'
      } : undefined,
      address: data.location ? {
        '@type': 'PostalAddress',
        addressLocality: data.location,
        addressCountry: 'KE'
      } : undefined,
      offers: data.offers ? this._buildOffer(data.offers) : undefined,
    };
  }

  static _buildJobPosting(data) {
    return {
      '@type': 'JobPosting',
      title: data.title,
      description: data.description,
      datePosted: data.datePosted,
      validThrough: data.validThrough,
      employmentType: data.employmentType,
      hiringOrganization: data.company ? this._buildOrganization('Organization', data.company) : undefined,
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.location,
          addressCountry: 'KE'
        }
      },
      baseSalary: data.salary ? {
        '@type': 'MonetaryAmount',
        currency: 'KES',
        value: {
          '@type': 'QuantitativeValue',
          value: data.salary,
          unitText: 'MONTH'
        }
      } : undefined
    };
  }

  static _buildBreadcrumbList(items) {
    if (!Array.isArray(items)) return {};
    return {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${BASE_URL}${item.url}` : undefined
      }))
    };
  }

  static _buildFAQPage(faqs) {
    if (!Array.isArray(faqs)) return {};
    return {
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  static _buildPerson(data) {
    return {
      '@type': 'Person',
      name: data.name,
      url: data.url ? `${BASE_URL}${data.url}` : undefined,
      image: data.image
    };
  }

  static _buildOrganization(type, data) {
    return {
      '@type': type,
      name: data.name,
      url: data.url ? `${BASE_URL}${data.url}` : undefined,
      logo: data.logo || data.image,
      address: data.location ? {
        '@type': 'PostalAddress',
        addressLocality: data.location,
        addressCountry: 'KE'
      } : undefined
    };
  }

  static _buildOffer(data) {
    return {
      '@type': 'Offer',
      priceCurrency: data.currency || 'KES',
      price: data.price,
      itemCondition: data.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: data.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: data.url ? `${BASE_URL}${data.url}` : undefined,
      seller: data.seller ? this._buildPerson(data.seller) : undefined
    };
  }

  static _buildAggregateRating(data) {
    return {
      '@type': 'AggregateRating',
      ratingValue: data.value,
      reviewCount: data.count,
      bestRating: data.best || 5,
      worstRating: data.worst || 1
    };
  }

  static _buildReview(data) {
    return {
      '@type': 'Review',
      author: data.author ? this._buildPerson(data.author) : undefined,
      datePublished: data.date,
      reviewBody: data.text,
      reviewRating: data.rating ? {
        '@type': 'Rating',
        ratingValue: data.rating,
        bestRating: 5,
        worstRating: 1
      } : undefined
    };
  }
}

export default SchemaFactory;
