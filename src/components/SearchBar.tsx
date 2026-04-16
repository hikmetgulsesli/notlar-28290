import { useState, useCallback } from 'react';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Notlarda ara...',
  initialValue = '',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(query);
    },
    [query, onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
        search
      </span>
      <input
        className="w-full bg-slate-900/50 border-none rounded-lg py-2 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
        placeholder={placeholder}
        type="text"
        value={query}
        onChange={handleChange}
        aria-label={placeholder}
      />
    </form>
  );
}
