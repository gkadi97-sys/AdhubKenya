import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// eslint-disable-next-line no-unused-vars
import { Settings, Edit, Plus, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminMetadata() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('level', { ascending: true })
      .order('order_index', { ascending: true });
      
    if (error) {
      toast.error('Failed to fetch categories');
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Category updated');
      setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Metadata Engine</h2>
          <p className="text-sm text-muted-foreground">Manage category schemas, forms, and validation rules</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-3 bg-secondary/50 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            <div>Category</div>
            <div>Status</div>
            <div>Type</div>
            <div className="text-right">Actions</div>
          </div>
          {categories.map(cat => (
            <div key={cat.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-6 py-4 transition hover:bg-secondary/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon || '📁'}</span>
                <div>
                  <div className="font-bold text-foreground">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{cat.slug}</div>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={() => toggleStatus(cat.id, cat.is_active)}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${cat.is_active ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all duration-200 ${cat.is_active ? 'left-5' : 'left-0.5'}`}></span>
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {cat.level === 0 ? 'Root Category' : 'Subcategory'}
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => navigate(`/admin/metadata/builder/${cat.id}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
                >
                  <Settings className="h-3.5 w-3.5" /> Schema Builder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
