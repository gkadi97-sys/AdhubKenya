import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ value, onChange, options, placeholder, disabled, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  // Sync internal search term with external value if external value changes (e.g. form reset)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(value || '');
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // If they didn't select an exact match, reset to the current selected value
        setSearchTerm(value || '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-control"
        style={{ fontSize: '0.85rem', width: '100%', cursor: disabled ? 'not-allowed' : 'text' }}
        placeholder={placeholder || 'Search or select...'}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          // If the user clears the input, clear the parent value too
          if (e.target.value === '') {
            onChange('');
          }
        }}
        onFocus={() => {
          if (!disabled) setIsOpen(true);
        }}
        disabled={disabled}
        required={required && !value} // Only required if no value is set
      />
      
      {/* Dropdown arrow icon indicator */}
      <div 
        style={{ 
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: 'var(--text-muted)'
        }}
      >
        ▼
      </div>

      {isOpen && !disabled && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          maxHeight: '250px',
          overflowY: 'auto',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          listStyle: 'none',
          padding: '4px 0',
          margin: '4px 0 0 0'
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  setSearchTerm(opt);
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: value === opt ? 'var(--primary-light)' : 'transparent',
                  color: value === opt ? 'var(--primary)' : 'var(--text)'
                }}
                onMouseEnter={(e) => {
                  if (value !== opt) e.target.style.backgroundColor = 'var(--hover)';
                }}
                onMouseLeave={(e) => {
                  if (value !== opt) e.target.style.backgroundColor = 'transparent';
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
