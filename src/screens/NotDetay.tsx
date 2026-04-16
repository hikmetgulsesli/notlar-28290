import { useNavigate } from 'react-router-dom';

interface NotDetayProps {
  title?: string;
  content?: string;
}

export function NotDetay({ title = 'Not Detay', content = '' }: NotDetayProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-slate-500">description</span>
      </div>
      <h2 className="text-xl font-bold text-on-surface mb-2">{title}</h2>
      {content && (
        <p className="text-sm text-on-surface-variant max-w-md">{content}</p>
      )}
    </div>
  );
}
