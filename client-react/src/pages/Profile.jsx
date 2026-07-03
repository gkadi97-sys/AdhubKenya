import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useSEO } from '@/lib/useSEO';
import { User, Phone, MapPin, CheckCircle, Save, ShieldAlert, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  useSEO({
    title: 'My Profile | AdHub Kenya',
    description: 'Manage your AdHub Kenya profile, personal details, and account settings.',
    canonicalPath: '/profile'
  });

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [county, setCounty] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setName(data.full_name || '');
      setPhone(data.phone || '');
      setBio(data.bio || '');
      setCounty(data.county || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          phone: phone,
          bio: bio,
          county: county,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      loadProfile(); // reload to get new updated_at
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-muted-foreground">Loading profile...</div>;
  }

  const isPhoneVerified = profile?.is_phone_verified;

  return (
    <div className="min-h-screen bg-background py-10 pb-24 md:pb-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <button 
            onClick={handleLogout}
            className="mt-4 sm:mt-0 flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-xl transition font-medium"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar and quick info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl font-bold uppercase">
                {name ? name.charAt(0) : user.email.charAt(0)}
              </div>
              <h2 className="text-xl font-bold truncate px-2" title={name || user.email}>
                {name || 'No Name Set'}
              </h2>
              <p className="text-muted-foreground text-sm mb-4 truncate px-2">{user.email}</p>
              
              <div className="flex justify-center mb-2">
                {isPhoneVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                    <ShieldAlert className="h-3.5 w-3.5" /> Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats (can connect to real DB later) */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Account Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">{new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium capitalize">{profile?.role || 'User'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                      placeholder="John Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                      placeholder="e.g. 0712345678" 
                    />
                  </div>
                  {!isPhoneVerified && phone && (
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> Please verify your phone number to get the Verified badge.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Location (County)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select 
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    >
                      <option value="">Select County</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kisumu">Kisumu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Eldoret">Eldoret</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Machakos">Machakos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Bio / About Me</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" 
                    placeholder="Tell buyers a bit about yourself or your business..."
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 transition disabled:opacity-70"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>

            {/* Password Reset Section could go here later */}
          </div>
        </div>
      </div>
    </div>
  );
}
