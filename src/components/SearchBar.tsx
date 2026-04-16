import { useState, useCallback, useRef, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  /** If true, shows a wider layout with border styling (for search page header) */
  variant?: 'header' | 'standalone';
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Notlarda ara...',
  initialValue = '',
  onSearch,
  onClear,
  variant = 'standalone',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

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

  const handleClear = useCallback(() => {
    setQuery('');
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  if (variant === 'header') {
    return (
      <form className="flex-grow max-w-xl relative" onSubmit={handleSubmit}>
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          search
        </span>
        <input
          ref={inputRef}
          className="w-full bg-slate-900/50 border-none rounded-lg py-2 pl-10 pr-10 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={handleChange}
          aria-label={placeholder}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
            aria-label="Aramayı temizle"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
          </button>
        )}
      </form>
    );
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2.5 rounded-lg text-slate-400 font-sans tracking-tight border border-transparent focus-within:border-blue-500/30 transition-all duration-200">
        <span className="material-symbols-outlined text-sm">search</span>
        <input
          ref={inputRef}
          className="bg-transparent border-none focus:ring-0 p-0 text-slate-100 placeholder-slate-500 w-full outline-none"
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={handleChange}
          aria-label={placeholder}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="material-symbols-outlined text-sm cursor-pointer hover:text-blue-400 transition-colors"
            aria-label="Aramayı temizle"
          >
            cancel
          </button>
        )}
      </div>
    </form>
  );
}
