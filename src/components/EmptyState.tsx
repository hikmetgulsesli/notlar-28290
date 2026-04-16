import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  type: 'all' | 'favorites' | 'archive' | 'trash' | 'search' | 'tag';
  searchQuery?: string;
  tag?: string;
}

export function EmptyState({ type, searchQuery, tag }: EmptyStateProps) {
  const navigate = useNavigate();

  const getMessage = () => {
    switch (type) {
      case 'favorites':
        return {
          title: 'Henüz favorin yok',
          description: 'Sevdiğin notları yıldız işaretiyle favorilere ekle',
          action: null,
        };
      case 'archive':
        return {
          title: 'Arşiv boş',
          description: 'Arşivlenen notlar burada görünür',
          action: null,
        };
      case 'trash':
        return {
          title: 'Çöp kutusu boş',
          description: 'Silinen notlar 30 gün boyunca burada saklanır',
          action: null,
        };
      case 'search':
        return {
          title: 'Sonuç bulunamadı',
          description: `"${searchQuery}" için arama sonuçları yok`,
          action: {
            label: 'Yeni not oluştur',
            onClick: () => navigate('/editor'),
          },
        };
      case 'tag':
        return {
          title: 'Bu etikette not yok',
          description: `#${tag} etiketiyle henüz not oluşturulmamış`,
          action: {
            label: 'Yeni not oluştur',
            onClick: () => navigate('/editor'),
          },
        };
      default:
        return {
          title: 'Henüz not yok',
          description: 'İlk notunu oluşturmak için butona tıkla',
          action: {
            label: 'İlk notu oluştur',
            onClick: () => navigate('/editor'),
          },
        };
    }
  };

  const { title, description, action } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-8 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-slate-500">edit_note</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface mb-2">{title}</h2>
      <p className="text-slate-400 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="primary-gradient text-on-primary font-semibold px-6 py-3 rounded-lg flex items-center gap-2 text-sm transition-transform active:scale-95 duration-100"
        >
          <span className="material-symbols-outlined">add</span>
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}
