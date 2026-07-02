import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageButton({ listing, className, variant = 'primary' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleMessageClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/listing/${listing.id}` } });
      return;
    }

    if (user.id === listing.seller_id) {
      toast('You cannot message yourself', { icon: 'ℹ️' });
      return;
    }

    setLoading(true);
    try {
      // 1. Check if conversation already exists
      const { data: existing, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existing) {
        // Navigate to existing conversation
        navigate(`/messages/${existing.id}`);
        return;
      }

      // 2. Create new conversation
      const { data: newConv, error: insertError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.seller_id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Navigate to new conversation
      navigate(`/messages/${newConv.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Could not start conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = "flex items-center justify-center gap-2 rounded-xl py-[13px] px-4 font-bold text-sm transition-all shadow-sm";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 bg-background",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
  };

  return (
    <button 
      onClick={handleMessageClick}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} ${className || 'w-full'}`}
    >
      <MessageSquare className="w-5 h-5" />
      {loading ? 'Starting chat...' : 'Message on AdHub'}
    </button>
  );
}
