import { useNavigate } from 'react-router-dom';

interface TagChipProps {
  tag: string;
  count?: number;
  active?: boolean;
  onClick?: (tag: string) => void;
}

export function TagChip({ tag, count, active = false, onClick }: TagChipProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    } else {
      navigate(`/search?q=${encodeURIComponent('#' + tag)}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 text-xs font-bold rounded-sm uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active
          ? 'bg-primary-container text-on-primary-container'
          : 'bg-slate-800 text-slate-400 hover:bg-secondary-container hover:text-on-secondary-container'
      }`}
      aria-label={`${tag} etiketi${count ? ` (${count} not)` : ''}`}
      aria-pressed={active}
    >
      #{tag}
      {count !== undefined && (
        <span className="ml-1 opacity-60">{count}</span>
      )}
    </button>
  );
}
