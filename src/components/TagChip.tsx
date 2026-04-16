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
      navigate(`/?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium 
        transition-colors cursor-pointer hover:opacity-80 active:scale-95
        ${active 
          ? 'bg-primary-container text-on-primary-container' 
          : 'bg-surface-variant/50 text-on-surface-variant hover:bg-secondary-container'
        }
      `}
    >
      <span>#{tag}</span>
      {count !== undefined && (
        <span className="opacity-60">({count})</span>
      )}
    </button>
  );
}
