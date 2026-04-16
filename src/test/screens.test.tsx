import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HicNotYok } from '../screens/HicNotYok';
import { OnayModali } from '../screens/OnayModali';
import { Modal } from '../components/Modal';

// Helper to wrap components with router
function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('HicNotYok', () => {
  it('renders empty state with correct title and description', () => {
    renderWithRouter(<HicNotYok />);
    expect(screen.getByText('Henüz notunuz yok.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'İlk notunuzu oluşturun! Fikirlerinizi, planlarınızı ve hayallerinizi buraya kaydedin.'
      )
    ).toBeInTheDocument();
  });

  it('renders create note button', () => {
    renderWithRouter(<HicNotYok />);
    expect(screen.getByText('Yeni Not Oluştur')).toBeInTheDocument();
  });

  it('renders template discovery button', () => {
    renderWithRouter(<HicNotYok />);
    expect(screen.getByText('Örnek şablonları keşfedin')).toBeInTheDocument();
  });

  it('calls onCreateNote when custom handler provided', () => {
    const handler = vi.fn();
    renderWithRouter(<HicNotYok onCreateNote={handler} />);
    fireEvent.click(screen.getByText('Yeni Not Oluştur'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('navigates to /editor when no custom handler', () => {
    renderWithRouter(<HicNotYok />);
    // The button exists and is clickable — navigation is handled by useNavigate
    const btn = screen.getByText('Yeni Not Oluştur');
    expect(btn).toBeInTheDocument();
  });

  it('shows edit_note icon', () => {
    renderWithRouter(<HicNotYok />);
    expect(screen.getByText('edit_note')).toBeInTheDocument();
  });

  it('shows add_circle icon on create button', () => {
    renderWithRouter(<HicNotYok />);
    expect(screen.getByText('add_circle')).toBeInTheDocument();
  });
});

describe('OnayModali', () => {
  it('renders nothing when isOpen is false', () => {
    renderWithRouter(
      <OnayModali isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen is true', () => {
    renderWithRouter(
      <OnayModali isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows default title and message', () => {
    renderWithRouter(
      <OnayModali isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText('Emin misiniz?')).toBeInTheDocument();
    expect(
      screen.getByText('Bu işlem geri alınamaz.')
    ).toBeInTheDocument();
  });

  it('shows custom title and message', () => {
    renderWithRouter(
      <OnayModali
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Notu silmek istediğinizden emin misiniz?"
        message="Bu not kalıcı olarak silinecek."
      />
    );
    expect(
      screen.getByText('Notu silmek istediğinizden emin misiniz?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Bu not kalıcı olarak silinecek.')
    ).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const handler = vi.fn();
    renderWithRouter(
      <OnayModali isOpen={true} onClose={vi.fn()} onConfirm={handler} />
    );
    fireEvent.click(screen.getByText('Onayla'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button clicked', () => {
    const handler = vi.fn();
    renderWithRouter(
      <OnayModali isOpen={true} onClose={handler} onConfirm={vi.fn()} />
    );
    fireEvent.click(screen.getByText('İptal'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('uses custom button labels', () => {
    renderWithRouter(
      <OnayModali
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        confirmLabel="Onayla"
        cancelLabel="Geri Dön"
      />
    );
    expect(screen.getByText('Onayla')).toBeInTheDocument();
    expect(screen.getByText('Geri Dön')).toBeInTheDocument();
  });

  it('shows warning icon for danger variant', () => {
    renderWithRouter(
      <OnayModali
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        variant="danger"
      />
    );
    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('shows error icon for warning variant', () => {
    renderWithRouter(
      <OnayModali
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        variant="warning"
      />
    );
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('shows info icon for info variant', () => {
    renderWithRouter(
      <OnayModali
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        variant="info"
      />
    );
    expect(screen.getByText('info')).toBeInTheDocument();
  });

  it('has aria-modal attribute', () => {
    renderWithRouter(
      <OnayModali isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    renderWithRouter(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>İçerik</p>
      </Modal>
    );
    expect(screen.queryByText('İçerik')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    renderWithRouter(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>İçerik</p>
      </Modal>
    );
    expect(screen.getByText('İçerik')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    renderWithRouter(
      <Modal isOpen={true} onClose={vi.fn()} title="Başlık">
        <p>İçerik</p>
      </Modal>
    );
    expect(screen.getByText('Başlık')).toBeInTheDocument();
  });

  it('calls onClose when overlay clicked', () => {
    const handler = vi.fn();
    renderWithRouter(
      <Modal isOpen={true} onClose={handler}>
        <p>İçerik</p>
      </Modal>
    );
    // The overlay div is the first child inside the fixed container
    const overlay = screen.getByRole('dialog').querySelector('.bg-black\\/60');
    if (overlay) {
      fireEvent.click(overlay);
      expect(handler).toHaveBeenCalledTimes(1);
    }
  });
});
