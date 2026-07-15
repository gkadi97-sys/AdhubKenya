'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CascadingLocationSelect({ value = null, onChange, required = false, showLabel = true }) {
  // `value` is expected to be a location object or ID
  const [hierarchy, setHierarchy] = useState([]); // Array of { levelName: string, selected: obj|null, options: [] }
  const [isLoading, setIsLoading] = useState(true);

  // Load root level (Country)
  useEffect(() => {
    async function loadRoot() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .is('parent_id', null)
        .order('name');
      
      if (!error && data) {
        setHierarchy([{ levelName: 'Country', selected: null, options: data }]);
      }
      setIsLoading(false);
    }
    loadRoot();
  }, []);

  const handleSelect = async (levelIndex, selectedNodeId) => {
    const newHierarchy = [...hierarchy].slice(0, levelIndex + 1);
    
    if (!selectedNodeId) {
      newHierarchy[levelIndex].selected = null;
      setHierarchy(newHierarchy);
      // If they unselect, the deepest selected node is the parent
      const parentNode = levelIndex > 0 ? newHierarchy[levelIndex - 1].selected : null;
      onChange(parentNode);
      return;
    }

    const selectedNode = newHierarchy[levelIndex].options.find(o => o.id === selectedNodeId);
    newHierarchy[levelIndex].selected = selectedNode;
    
    // Emit the change
    onChange(selectedNode);

    // Fetch children
    setIsLoading(true);
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('parent_id', selectedNodeId)
      .order('name');
      
    if (!error && data && data.length > 0) {
      // Determine next level name based on first child's type
      const nextTypeName = data[0].type || 'Location';
      newHierarchy.push({ levelName: nextTypeName, selected: null, options: data });
    }
    
    setHierarchy(newHierarchy);
    setIsLoading(false);
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 inline-block capitalize";

  return (
    <div className="flex flex-col gap-4">
      {hierarchy.map((level, index) => (
        <div key={index} className="animate-in fade-in duration-300">
          {showLabel && <label className={labelClass}>{level.levelName} {index === 0 && required ? '*' : ''}</label>}
          <select
            className={inputClass}
            value={level.selected?.id || ''}
            onChange={(e) => handleSelect(index, e.target.value)}
            required={index === 0 ? required : false} // Only root might be strictly required, though usually we want at least County
          >
            <option value="">Select {level.levelName}</option>
            {level.options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      ))}
      
      {isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">Loading locations...</div>
      )}
    </div>
  );
}
