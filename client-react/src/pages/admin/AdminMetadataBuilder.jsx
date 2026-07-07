import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, Save, Settings, GripVertical, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMetadataBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [groups, setGroups] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingAttr, setEditingAttr] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) fetchSchema();
  }, [id]);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      // 1. Fetch Category
      const { data: catData, error: catError } = await supabase.from('categories').select('*').eq('id', id).single();
      if (catError) throw catError;
      setCategory(catData);

      // 2. Fetch Groups
      const { data: groupData, error: groupError } = await supabase.from('attribute_groups').select('*').eq('category_id', id).order('order_index');
      if (groupError) throw groupError;
      setGroups(groupData || []);

      // 3. Fetch Attributes
      const { data: attrData, error: attrError } = await supabase.from('attributes').select('*').eq('category_id', id).order('display_order');
      if (attrError) throw attrError;
      setAttributes(attrData || []);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load schema');
    } finally {
      setLoading(false);
    }
  };

  const saveSchema = async () => {
    setIsSaving(true);
    try {
      // Upsert attributes
      const { error } = await supabase.from('attributes').upsert(
        attributes.map(a => ({
          id: a.id,
          category_id: category.id,
          group_id: a.group_id,
          name: a.name,
          label: a.label,
          field_type: a.field_type,
          is_required: a.is_required,
          is_searchable: a.is_searchable,
          is_listing_card: a.is_listing_card,
          display_order: a.display_order
        }))
      );
      
      if (error) throw error;
      toast.success('Schema saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save schema');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading Form Builder...</div>;
  if (!category) return <div className="p-8 text-center text-destructive">Category not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/metadata')} className="p-2 rounded-full hover:bg-secondary transition text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="text-3xl">{category.icon}</span> {category.name}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">{category.slug} • Form Builder</p>
          </div>
        </div>
        <button onClick={saveSchema} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 shadow-sm">
          <Save className="h-4 w-4" /> Save Schema
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
        
        {/* Main Editor Canvas */}
        <div className="space-y-6">
          {groups.map((group) => {
            const groupAttributes = attributes.filter(a => a.group_id === group.id);
            return (
              <div key={group.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                
                {/* Group Header */}
                <div className="bg-secondary/30 border-b border-border px-5 py-3 flex items-center justify-between group-hover:bg-secondary/50 transition">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-move" />
                    <h3 className="font-bold text-foreground">{group.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition" title="Edit Group">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Group Fields */}
                <div className="p-2 space-y-1 bg-background/50">
                  {groupAttributes.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl m-2">
                      No fields in this group.
                    </div>
                  ) : (
                    groupAttributes.map((attr) => (
                      <div key={attr.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl group/field hover:border-primary/30 transition">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-move" />
                          <div>
                            <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                              {attr.label}
                              {attr.is_required && <span className="text-destructive">*</span>}
                              {attr.is_searchable && <span className="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 rounded uppercase font-bold tracking-wider">Searchable</span>}
                              {attr.is_listing_card && <span className="text-[10px] bg-purple-500/10 text-purple-600 px-1.5 rounded uppercase font-bold tracking-wider">Card</span>}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground mt-0.5">{attr.name} • {attr.field_type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                          <button onClick={() => setEditingAttr(attr)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition" title="Edit Field">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            setAttributes(prev => prev.filter(a => a.id !== attr.id));
                            toast.success('Field removed (staged)');
                          }} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition" title="Remove Field">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Add Field Button */}
                  <div className="p-2">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition">
                      <Plus className="w-4 h-4" /> Add Field to {group.name}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition">
            <Plus className="w-5 h-5" /> Add New Group
          </button>
        </div>

        {/* Sidebar Settings Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sticky top-6">
             <h3 className="font-bold text-lg mb-4">Category Settings</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition" value={category.name || ''} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Slug</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed outline-none" value={category.slug || ''} readOnly />
                </div>
                
                <hr className="border-border my-2" />
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary focus:ring-primary/20 accent-primary" checked={category.allow_price || false} readOnly />
                  <span className="text-sm font-semibold text-foreground">Has Price Field</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary focus:ring-primary/20 accent-primary" checked={category.allow_condition || false} readOnly />
                  <span className="text-sm font-semibold text-foreground">Has Condition Field</span>
                </label>
             </div>
          </div>
        </div>

      </div>

      {/* Edit Attribute Modal */}
      {editingAttr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
              <h3 className="font-bold text-lg text-foreground">Edit Field: {editingAttr.name}</h3>
              <button onClick={() => setEditingAttr(null)} className="p-2 hover:bg-secondary rounded-full transition text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Field Label</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none" 
                    value={editingAttr.label || ''} 
                    onChange={e => setEditingAttr({...editingAttr, label: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Field Type</label>
                  <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none"
                    value={editingAttr.field_type || 'text'}
                    onChange={e => setEditingAttr({...editingAttr, field_type: e.target.value})}
                  >
                    <option value="text">Text (Short)</option>
                    <option value="number">Number</option>
                    <option value="select">Select (Dropdown)</option>
                    <option value="multiselect">Multi-select (Checkboxes)</option>
                    <option value="boolean">Boolean (Yes/No)</option>
                  </select>
                </div>
              </div>

              {/* Group Assignment */}
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Attribute Group</label>
                <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none"
                  value={editingAttr.group_id || ''}
                  onChange={e => setEditingAttr({...editingAttr, group_id: e.target.value})}
                >
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              {/* Advanced UI Flags */}
              <div className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                <h4 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wider">UI & Search Flags</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary focus:ring-primary/20" 
                    checked={editingAttr.is_required || false}
                    onChange={e => setEditingAttr({...editingAttr, is_required: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Required Field</div>
                    <div className="text-xs text-muted-foreground">User must fill this out to post an ad</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary focus:ring-primary/20" 
                    checked={editingAttr.is_searchable || false}
                    onChange={e => setEditingAttr({...editingAttr, is_searchable: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Searchable</div>
                    <div className="text-xs text-muted-foreground">Generate a filter for this field in Advanced Search</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary focus:ring-primary/20" 
                    checked={editingAttr.is_listing_card || false}
                    onChange={e => setEditingAttr({...editingAttr, is_listing_card: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Show on Listing Card</div>
                    <div className="text-xs text-muted-foreground">Display this attribute on search result preview cards</div>
                  </div>
                </label>
              </div>

            </div>

            <div className="border-t border-border p-4 bg-secondary/30 flex justify-end gap-3">
              <button onClick={() => setEditingAttr(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-secondary transition">
                Cancel
              </button>
              <button onClick={() => {
                setAttributes(prev => prev.map(a => a.id === editingAttr.id ? editingAttr : a));
                setEditingAttr(null);
                toast.success('Changes staged. Press "Save Schema" to commit.');
              }} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm">
                Apply Changes
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
