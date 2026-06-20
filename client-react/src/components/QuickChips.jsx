import { useNavigate } from 'react-router-dom';
import { QUICK_CHIPS } from '@/lib/filterConfig';

export default function QuickChips() {
  const navigate = useNavigate();

  const go = (params) => {
    const p = new URLSearchParams(params);
    navigate(`/browse?${p.toString()}`);
  };

  return (
    <div className="quick-chips-wrap">
      <div className="quick-chips">
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.label}
            className="quick-chip"
            onClick={() => go(chip.params)}
            type="button"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
