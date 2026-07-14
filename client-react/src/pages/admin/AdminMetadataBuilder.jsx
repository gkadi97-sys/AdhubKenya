import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, Save, Settings, GripVertical, Trash2, X, Image, Video, FileText, RotateCw, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const slugify = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '_').replace(/[^\w_]+/g, '').replace(/__+/g, '_');



export default function AdminMetadataBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [groups, setGroups] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fields');
  
  // Edit State
  const [editingAttr, setEditingAttr] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Media Rules local state (mirrors category fields)
  const [mediaRules, setMediaRules] = useState({
    min_photos: 1,
    max_photos: 10,
    allow_video: false,
    allow_pdf: false,
    allow_360: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (id) fetchSchema();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      // 1. Fetch Category
      const { data: catData, error: catError } = await supabase.from('categories').select('*').eq('id', id).single();
      if (catError) throw catError;
      setCategory(catData);
      // Hydrate media rules from fetched category
      setMediaRules({
        min_photos: catData.min_photos ?? 1,
        max_photos: catData.max_photos ?? 10,
        allow_video: catData.allow_video ?? false,
        allow_pdf: catData.allow_pdf ?? false,
        allow_360: catData.allow_360 ?? false,
      });

      // 2. Fetch Groups
      const { data: groupData, error: groupError } = await supabase.from('attribute_groups').select('*').eq('category_id', id).order('order_index');
      if (groupError) throw groupError;
      setGroups(groupData || []);

      // 3. Fetch Attributes
      const { data: attrData, error: attrError } = await supabase.from('attributes').select('*').eq('category_id', id).order('display_order');
      if (attrError) throw attrError;
      setAttributes(attrData || []);

      // 4. Fetch Dependencies
      if (attrData && attrData.length > 0) {
        const attrIds = attrData.map(a => a.id);
        const { data: depData, error: depError } = await supabase.from('attribute_dependencies').select('*').in('attribute_id', attrIds);
        if (depError) throw depError;
        setDependencies(depData || []);
      }

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
      // 0. Client-side duplicate key validation
      const keys = attributes.map(a => a.name);
      const duplicates = keys.filter((item, index) => keys.indexOf(item) !== index);
      if (duplicates.length > 0) {
        throw new Error(`Duplicate Field Keys detected: ${[...new Set(duplicates)].join(', ')}. Keys must be unique within a category.`);
      }

      // 1.5 Upsert groups
      const { error: groupErrorUpsert } = await supabase.from('attribute_groups').upsert(
        groups.map(g => ({
          id: g.id,
          category_id: category.id,
          name: g.name,
          icon: g.icon || 'info',
          order_index: g.order_index
        }))
      );
      if (groupErrorUpsert) throw groupErrorUpsert;

      // 1. Upsert attributes
      const { error: attrError } = await supabase.from('attributes').upsert(
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
      if (attrError) throw attrError;

      // 2. Save media rules to categories table
      const { error: mediaError } = await supabase
        .from('categories')
        .update({
          min_photos: mediaRules.min_photos,
          max_photos: mediaRules.max_photos,
          allow_video: mediaRules.allow_video,
          allow_pdf: mediaRules.allow_pdf,
          allow_360: mediaRules.allow_360,
          updated_at: new Date().toISOString(),
        })
        .eq('id', category.id);
      if (mediaError) throw mediaError;

      // 3. Save dependencies (replace all for simplicity)
      if (attributes.length > 0) {
        const attrIds = attributes.map(a => a.id);
        await supabase.from('attribute_dependencies').delete().in('attribute_id', attrIds);
        if (dependencies.length > 0) {
          const { error: depError } = await supabase.from('attribute_dependencies').insert(
            dependencies.map(d => ({
              id: d.id || crypto.randomUUID(),
              attribute_id: d.attribute_id,
              depends_on_attribute_id: d.depends_on_attribute_id,
              operator: d.operator || 'exists',
              effect: d.effect || 'show'
            }))
          );
          if (depError) throw depError;
        }
      }

      toast.success('Schema & media rules saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save: ' + err.message);
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
        <button onClick={saveSchema} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 shadow-sm disabled:opacity-60">
          <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Schema'}
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl bg-secondary/50 p-1 w-fit">
        {[{ id: 'fields', label: 'Form Fields' }, { id: 'media', label: 'Media Rules' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MEDIA RULES TAB ── */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          <div className="space-y-6">

            {/* Photos Card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="bg-secondary/30 border-b border-border px-5 py-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">Photo Requirements</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Min Photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-foreground">Minimum Photos Required</label>
                    <span className="text-sm font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-1">{mediaRules.min_photos}</span>
                  </div>
                  <input
                    type="range" min={0} max={10} step={1}
                    value={mediaRules.min_photos}
                    onChange={e => setMediaRules(r => ({ ...r, min_photos: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 (optional)</span><span>10</span>
                  </div>
                </div>

                {/* Max Photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-foreground">Maximum Photos Allowed</label>
                    <span className="text-sm font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-1">{mediaRules.max_photos}</span>
                  </div>
                  <input
                    type="range" min={1} max={20} step={1}
                    value={mediaRules.max_photos}
                    onChange={e => setMediaRules(r => ({ ...r, max_photos: Math.max(parseInt(e.target.value), r.min_photos) }))}
                    className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1</span><span>20</span>
                  </div>
                </div>

                {/* Visual Indicator */}
                <div className="rounded-xl bg-secondary/40 border border-border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview — Photo Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: mediaRules.max_photos }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition ${
                          i < mediaRules.min_photos
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-dashed border-border text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    <span className="text-primary font-bold">{mediaRules.min_photos} required</span> + {mediaRules.max_photos - mediaRules.min_photos} optional slots
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Media Card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="bg-secondary/30 border-b border-border px-5 py-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground">Additional Media Types</h3>
              </div>
              <div className="divide-y divide-border">

                {/* Video Toggle */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ mediaRules.allow_video ? 'bg-blue-500/10' : 'bg-secondary' }`}>
                      <Video className={`w-5 h-5 ${ mediaRules.allow_video ? 'text-blue-500' : 'text-muted-foreground' }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Allow Video Upload</p>
                      <p className="text-xs text-muted-foreground">Sellers can attach an MP4 or YouTube link to the listing</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMediaRules(r => ({ ...r, allow_video: !r.allow_video }))}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${ mediaRules.allow_video ? 'bg-primary' : 'bg-border' }`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${ mediaRules.allow_video ? 'left-5' : 'left-0.5' }`} />
                  </button>
                </div>

                {/* PDF Toggle */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ mediaRules.allow_pdf ? 'bg-orange-500/10' : 'bg-secondary' }`}>
                      <FileText className={`w-5 h-5 ${ mediaRules.allow_pdf ? 'text-orange-500' : 'text-muted-foreground' }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Allow PDF Attachment</p>
                      <p className="text-xs text-muted-foreground">Useful for property brochures, machinery spec sheets, or CVs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMediaRules(r => ({ ...r, allow_pdf: !r.allow_pdf }))}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${ mediaRules.allow_pdf ? 'bg-primary' : 'bg-border' }`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${ mediaRules.allow_pdf ? 'left-5' : 'left-0.5' }`} />
                  </button>
                </div>

                {/* 360 Toggle */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ mediaRules.allow_360 ? 'bg-purple-500/10' : 'bg-secondary' }`}>
                      <RotateCw className={`w-5 h-5 ${ mediaRules.allow_360 ? 'text-purple-500' : 'text-muted-foreground' }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Allow 360° Tour</p>
                      <p className="text-xs text-muted-foreground">Enable embedding a Matterport or similar 360° virtual tour link</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMediaRules(r => ({ ...r, allow_360: !r.allow_360 }))}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${ mediaRules.allow_360 ? 'bg-primary' : 'bg-border' }`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${ mediaRules.allow_360 ? 'left-5' : 'left-0.5' }`} />
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Right sidebar summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Current Rules</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min Photos</span>
                  <span className="font-bold text-foreground">{mediaRules.min_photos}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Max Photos</span>
                  <span className="font-bold text-foreground">{mediaRules.max_photos}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Video className="w-3.5 h-3.5" /> Video</span>
                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${ mediaRules.allow_video ? 'text-green-600 bg-green-500/10' : 'text-muted-foreground bg-secondary' }`}>
                    {mediaRules.allow_video ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> PDF</span>
                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${ mediaRules.allow_pdf ? 'text-green-600 bg-green-500/10' : 'text-muted-foreground bg-secondary' }`}>
                    {mediaRules.allow_pdf ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><RotateCw className="w-3.5 h-3.5" /> 360°</span>
                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${ mediaRules.allow_360 ? 'text-green-600 bg-green-500/10' : 'text-muted-foreground bg-secondary' }`}>
                    {mediaRules.allow_360 ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <button onClick={saveSchema} disabled={isSaving} className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 shadow-sm disabled:opacity-60">
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Media Rules'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FIELDS TAB ── */}
      {activeTab === 'fields' && (
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
                    <button onClick={() => setEditingGroup(group)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition" title="Edit Group">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      if (window.confirm('Remove this group and all its fields?')) {
                        setAttributes(prev => prev.filter(a => a.group_id !== group.id));
                        setGroups(prev => prev.filter(g => g.id !== group.id));
                      }
                    }} className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition" title="Delete Group">
                      <Trash2 className="w-4 h-4" />
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
                    <button 
                      onClick={() => {
                        const newAttr = {
                          id: crypto.randomUUID(),
                          name: `new_field_${Math.floor(Math.random() * 10000)}`,
                          label: 'New Field',
                          field_type: 'text',
                          group_id: group.id,
                          is_required: false,
                          is_searchable: false,
                          is_listing_card: false,
                          display_order: groupAttributes.length + 1
                        };
                        setAttributes([...attributes, newAttr]);
                        setEditingAttr(newAttr);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition"
                    >
                      <Plus className="w-4 h-4" /> Add Field to {group.name}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          <button 
            onClick={() => {
              const newGroup = {
                id: crypto.randomUUID(),
                name: 'New Group',
                category_id: category.id,
                icon: 'info',
                order_index: groups.length + 1
              };
              setGroups([...groups, newGroup]);
              setEditingGroup(newGroup);
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition"
          >
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
      )}

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
                    onChange={e => {
                      const newLabel = e.target.value;
                      // Auto-slugify if name matches old label slugification or is empty/default
                      const currentSlug = slugify(editingAttr.label || '');
                      const shouldAutoUpdateName = !editingAttr.name || editingAttr.name === currentSlug || editingAttr.name.startsWith('new_field_');
                      
                      setEditingAttr({
                        ...editingAttr, 
                        label: newLabel,
                        name: shouldAutoUpdateName ? slugify(newLabel) : editingAttr.name
                      });
                    }} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Field Key (Database Column)</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none font-mono text-xs" 
                    value={editingAttr.name || ''} 
                    onChange={e => setEditingAttr({...editingAttr, name: slugify(e.target.value)})} 
                  />
                </div>
                <div className="col-span-2">
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
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary accent-primary" 
                    checked={editingAttr.is_required || false}
                    onChange={e => setEditingAttr({...editingAttr, is_required: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Required Field</div>
                    <div className="text-xs text-muted-foreground">User must fill this out to post an ad</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary accent-primary" 
                    checked={editingAttr.is_searchable || false}
                    onChange={e => setEditingAttr({...editingAttr, is_searchable: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Searchable</div>
                    <div className="text-xs text-muted-foreground">Generate a filter for this field in Advanced Search</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 rounded border-2 border-border text-primary accent-primary" 
                    checked={editingAttr.is_listing_card || false}
                    onChange={e => setEditingAttr({...editingAttr, is_listing_card: e.target.checked})}
                  />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Show on Listing Card</div>
                    <div className="text-xs text-muted-foreground">Display this attribute on search result preview cards</div>
                  </div>
                </label>
              </div>


              {/* Dependencies UI inside Edit Modal */}
              <div className="p-4 rounded-xl border border-border bg-orange-500/5 space-y-3">
                <h4 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wider">Field Dependencies</h4>
                {dependencies.filter(d => d.attribute_id === editingAttr.id).map(dep => {
                  const targetAttr = attributes.find(a => a.id === dep.depends_on_attribute_id);
                  return (
                    <div key={dep.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-2 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">{editingAttr.label}</span> {dep.effect}s when <span className="font-semibold text-primary">{targetAttr?.label || 'Unknown'}</span> {dep.operator}
                      </div>
                      <button onClick={() => setDependencies(prev => prev.filter(d => d.id !== dep.id))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                <button onClick={() => {
                  const otherAttrs = attributes.filter(a => a.id !== editingAttr.id);
                  if (otherAttrs.length === 0) return toast.error('Create other fields first.');
                  setDependencies([...dependencies, {
                    id: crypto.randomUUID(),
                    attribute_id: editingAttr.id,
                    depends_on_attribute_id: otherAttrs[0].id,
                    operator: 'exists',
                    effect: 'show'
                  }]);
                }} className="text-xs font-bold text-primary hover:underline">
                  + Add Dependency Rule
                </button>
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
      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
              <h3 className="font-bold text-lg text-foreground">Edit Group: {editingGroup.name}</h3>
              <button onClick={() => setEditingGroup(null)} className="p-2 hover:bg-secondary rounded-full transition text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Group Name</label>
                <input type="text" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none" 
                  value={editingGroup.name || ''} 
                  onChange={e => setEditingGroup({...editingGroup, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Display Icon (Lucide string)</label>
                <input type="text" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/50 focus:ring-2 outline-none" 
                  value={editingGroup.icon || ''} 
                  onChange={e => setEditingGroup({...editingGroup, icon: e.target.value})} 
                  placeholder="e.g. settings, box, info"
                />
              </div>
            </div>

            <div className="border-t border-border p-4 bg-secondary/30 flex justify-end gap-3">
              <button onClick={() => setEditingGroup(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-secondary transition">
                Cancel
              </button>
              <button onClick={() => {
                setGroups(prev => prev.map(g => g.id === editingGroup.id ? editingGroup : g));
                setEditingGroup(null);
                toast.success('Group updated (staged)');
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
