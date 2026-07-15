import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, ChevronRight, ToggleLeft, ToggleRight, Trash2, Edit3, Check, X, Car, Loader2, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = ['Passenger/Commercial', 'Motorcycle', 'Commercial/Industrial'];

async function fetchMakes(search = '') {
  let q = supabase.from('vehicle_makes').select('*').order('name');
  if (search) q = q.ilike('name', `%${search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

async function fetchModels(makeId) {
  const { data, error } = await supabase
    .from('vehicle_models')
    .select('*')
    .eq('make_id', makeId)
    .order('name');
  if (error) throw error;
  return data || [];
}

async function toggleActive(table, id, currentValue) {
  const { error } = await supabase.from(table).update({ is_active: !currentValue }).eq('id', id);
  if (error) throw error;
}

async function deleteRecord(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

// ─── InlineEdit ───────────────────────────────────────────────────────────────

function InlineEdit({ value, onSave, onCancel }) {
  const [val, setVal] = useState(value);
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSave(val); if (e.key === 'Escape') onCancel(); }}
        className="flex-1 rounded-lg border border-primary/50 bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button onClick={() => onSave(val)} className="p-1 rounded text-green-500 hover:bg-green-500/10 transition">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="p-1 rounded text-muted-foreground hover:bg-secondary transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── ModelRow ─────────────────────────────────────────────────────────────────

function ModelRow({ model, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (newName) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('vehicle_models').update({ name: newName }).eq('id', model.id);
      if (error) throw error;
      toast.success('Model updated');
      setEditing(false);
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleActive('vehicle_models', model.id, model.is_active);
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete model "${model.name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteRecord('vehicle_models', model.id);
      toast.success('Model deleted');
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${model.is_active ? 'hover:bg-secondary/50' : 'opacity-50 hover:bg-secondary/30'}`}>
      {editing ? (
        <InlineEdit value={model.name} onSave={handleSave} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <span className="flex-1 text-sm text-foreground">{model.name}</span>
          <div className="flex items-center gap-1">
            {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToggle}
              className={`p-1.5 rounded-lg transition ${model.is_active ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-secondary'}`}
              title={model.is_active ? 'Deactivate' : 'Activate'}
            >
              {model.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MakeCard ─────────────────────────────────────────────────────────────────

function MakeCard({ make, isSelected, onSelect, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (newName) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('vehicle_makes').update({ name: newName }).eq('id', make.id);
      if (error) throw error;
      toast.success('Make updated');
      setEditing(false);
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleActive('vehicle_makes', make.id, make.is_active);
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${make.name}" and all its models? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteRecord('vehicle_makes', make.id);
      toast.success('Make deleted');
      onRefresh();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div
      onClick={() => !editing && onSelect(make)}
      className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
          : 'border-border bg-card hover:border-primary/30 hover:bg-secondary/30'
      } ${!make.is_active ? 'opacity-50' : ''}`}
    >
      {editing ? (
        <div onClick={e => e.stopPropagation()}>
          <InlineEdit value={make.name} onSave={handleSave} onCancel={() => setEditing(false)} />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{make.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{make.vehicle_type}</p>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${isSelected ? 'text-primary rotate-90' : 'group-hover:translate-x-0.5'}`} />
          </div>

          <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition" title="Edit">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleToggle} className={`p-1.5 rounded-lg transition ${make.is_active ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-secondary'}`} title={make.is_active ? 'Deactivate' : 'Activate'}>
              {make.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
            <button onClick={handleDelete} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition" title="Delete Make">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main AdminVehicles ────────────────────────────────────────────────────────

export default function AdminVehicles() {
  // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
  const { user } = useAuth();
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [search, setSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  // New Make form
  const [newMakeName, setNewMakeName] = useState('');
  const [newMakeType, setNewMakeType] = useState(VEHICLE_TYPES[0]);
  const [addingMake, setAddingMake] = useState(false);

  // New Model form
  const [newModelName, setNewModelName] = useState('');
  const [addingModel, setAddingModel] = useState(false);

  const [showAddMake, setShowAddMake] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);

  // Stats
  const [stats, setStats] = useState({ makes: 0, models: 0 });

  const loadMakes = useCallback(async () => {
    setLoadingMakes(true);
    try {
      const data = await fetchMakes(search);
      setMakes(data);
      // Refresh stats
      const { count: makeCount } = await supabase.from('vehicle_makes').select('*', { count: 'exact', head: true });
      const { count: modelCount } = await supabase.from('vehicle_models').select('*', { count: 'exact', head: true });
      setStats({ makes: makeCount || 0, models: modelCount || 0 });
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (e) {
      toast.error('Failed to load makes');
    }
    setLoadingMakes(false);
  }, [search]);

  const loadModels = useCallback(async (makeId) => {
    setLoadingModels(true);
    try {
      const data = await fetchModels(makeId);
      setModels(data);
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (e) {
      toast.error('Failed to load models');
    }
    setLoadingModels(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
    loadMakes();
  }, [loadMakes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional derived state cascade
    if (selectedMake) loadModels(selectedMake.id);
    else setModels([]);
  }, [selectedMake, loadModels]);

  const handleAddMake = async () => {
    if (!newMakeName.trim()) return toast.error('Enter a make name');
    setAddingMake(true);
    try {
      const { error } = await supabase.from('vehicle_makes').insert({ name: newMakeName.trim(), vehicle_type: newMakeType, is_active: true });
      if (error) throw error;
      toast.success(`${newMakeName} added!`);
      setNewMakeName('');
      setShowAddMake(false);
      loadMakes();
    } catch (e) {
      toast.error(e.message);
    }
    setAddingMake(false);
  };

  const handleAddModel = async () => {
    if (!newModelName.trim()) return toast.error('Enter a model name');
    if (!selectedMake) return toast.error('Select a make first');
    setAddingModel(true);
    try {
      const { error } = await supabase.from('vehicle_models').insert({ make_id: selectedMake.id, name: newModelName.trim(), is_active: true, metadata: {} });
      if (error) throw error;
      toast.success(`${newModelName} added!`);
      setNewModelName('');
      setShowAddModel(false);
      loadModels(selectedMake.id);
    } catch (e) {
      toast.error(e.message);
    }
    setAddingModel(false);
  };

  const filteredModels = models.filter(m => !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase()));

  const handleExport = async () => {
    toast.loading('Preparing export...');
    try {
      const { data: allMakes } = await supabase.from('vehicle_makes').select('*').order('name');
      const { data: allModels } = await supabase.from('vehicle_models').select('*, vehicle_makes(name)').order('name');
      const csv = ['Make,Vehicle Type,Model,Active']
        .concat(allModels.map(m => `"${m.vehicle_makes?.name}","${allMakes.find(mk => mk.id === m.make_id)?.vehicle_type}","${m.name}",${m.is_active}`))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adhub_vehicle_taxonomy.csv';
      a.click();
      toast.dismiss();
      toast.success('Exported!');
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (e) {
      toast.dismiss();
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            Vehicle Taxonomy
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the Make → Model database powering vehicle listings across AdHub.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddMake(v => !v)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Make
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Makes', value: stats.makes, color: 'text-primary' },
          { label: 'Total Models', value: stats.models, color: 'text-blue-500' },
          { label: 'Active Makes', value: makes.filter(m => m.is_active).length, color: 'text-green-500' },
          { label: 'Vehicle Types', value: VEHICLE_TYPES.length, color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Make Form */}
      {showAddMake && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
          <h3 className="font-bold text-foreground">Add New Make</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={newMakeName}
              onChange={e => setNewMakeName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMake()}
              placeholder="e.g. Renault"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <select
              value={newMakeType}
              onChange={e => setNewMakeType(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={handleAddMake}
              disabled={addingMake}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
            >
              {addingMake ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
            <button onClick={() => setShowAddMake(false)} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Makes Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">Makes <span className="text-muted-foreground font-normal text-sm">({makes.length})</span></h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search makes..."
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="max-h-[calc(100vh-440px)] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {loadingMakes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : makes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No makes found
              </div>
            ) : (
              makes.map(make => (
                <MakeCard
                  key={make.id}
                  make={make}
                  isSelected={selectedMake?.id === make.id}
                  onSelect={m => setSelectedMake(prev => prev?.id === m.id ? null : m)}
                  onRefresh={() => { loadMakes(); if (selectedMake?.id === make.id) setSelectedMake(null); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Models Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">
              {selectedMake ? (
                <>Models for <span className="text-primary">{selectedMake.name}</span> <span className="text-muted-foreground font-normal text-sm">({models.length})</span></>
              ) : (
                'Models'
              )}
            </h2>
            {selectedMake && (
              <button
                onClick={() => setShowAddModel(v => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/20 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Model
              </button>
            )}
          </div>

          {!selectedMake ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-center">
              <Car className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-semibold text-muted-foreground">Select a Make</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Click any make on the left to view and manage its models.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Add Model Form */}
              {showAddModel && (
                <div className="border-b border-border bg-secondary/20 p-4 flex gap-2">
                  <input
                    autoFocus
                    value={newModelName}
                    onChange={e => setNewModelName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddModel()}
                    placeholder={`Add model to ${selectedMake.name}...`}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAddModel}
                    disabled={addingModel}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {addingModel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                  </button>
                  <button onClick={() => setShowAddModel(false)} className="p-2 rounded-xl border border-border hover:bg-secondary transition">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Model Search */}
              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={modelSearch}
                    onChange={e => setModelSearch(e.target.value)}
                    placeholder="Filter models..."
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Model List */}
              <div className="max-h-[calc(100vh-480px)] overflow-y-auto divide-y divide-border/50 p-2 custom-scrollbar">
                {loadingModels ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {modelSearch ? 'No models match your search.' : 'No models yet. Click "Add Model" to add the first one.'}
                  </div>
                ) : (
                  filteredModels.map(model => (
                    <ModelRow
                      key={model.id}
                      model={model}
                      onRefresh={() => loadModels(selectedMake.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
