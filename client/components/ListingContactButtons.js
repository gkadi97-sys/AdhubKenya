'use client';
import { useState, useEffect } from 'react';
import { logListingEvent } from '@/lib/api';

export default function ListingContactButtons({ listingId, whatsappMsg, waLink, phone }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  useEffect(() => {
    // Log view event
    logListingEvent(listingId, 'view').catch(console.error);
  }, [listingId]);

  const handleWhatsAppClick = () => {
    logListingEvent(listingId, 'whatsapp_click').catch(console.error);
  };

  const handlePhoneReveal = () => {
    setPhoneRevealed(true);
    logListingEvent(listingId, 'phone_reveal').catch(console.error);
  };

  return (
    <div className="contact-btns">
      {waLink && (
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary btn-full btn-lg"
          style={{background:'#25D366',boxShadow:'0 4px 15px rgba(37,211,102,0.3)'}}
          onClick={handleWhatsAppClick}
        >
          <span>💬</span> WhatsApp Seller
        </a>
      )}
      
      {!phoneRevealed ? (
        <button 
          className="btn btn-ghost btn-full btn-lg"
          onClick={handlePhoneReveal}
        >
          <span>📞</span> Show Phone Number
        </button>
      ) : (
        <a 
          href={`tel:${phone}`} 
          className="btn btn-ghost btn-full btn-lg"
        >
          <span>📞</span> Call: {phone}
        </a>
      )}
    </div>
  );
}
