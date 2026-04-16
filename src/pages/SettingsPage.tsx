import { useState } from 'react';

export function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('tr');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-extrabold tracking-tighter text-on-background mb-8">
        Ayarlar
      </h1>

      <div className="space-y-8">
        {/* Theme Settings */}
        <section className="bg-surface-container-low rounded-xl p-6">
          <h2 className="text-xl font-bold text-on-surface mb-4">Görünüm</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Tema
              </label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
              >
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
                <option value="system">Sistem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Dil
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-surface-container-low rounded-xl p-6">
          <h2 className="text-xl font-bold text-on-surface mb-4">Bildirimler</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-on-surface">Bildirimleri etkinleştir</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-primary' : 'bg-surface-variant'
              }`}
              aria-pressed={notifications}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </label>
        </section>

        {/* Privacy Settings */}
        <section className="bg-surface-container-low rounded-xl p-6">
          <h2 className="text-xl font-bold text-on-surface mb-4">Gizlilik</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-surface border border-outline rounded-lg text-on-surface hover:bg-surface-container transition-colors">
              Verileri dişa aktar
            </button>
            <button className="w-full text-left px-4 py-3 bg-error-container text-on-error-container rounded-lg hover:opacity-80 transition-opacity">
              Tüm verileri sil
            </button>
          </div>
        </section>

        {/* About */}
        <section className="bg-surface-container-low rounded-xl p-6">
          <h2 className="text-xl font-bold text-on-surface mb-4">Hakkında</h2>
          <div className="text-sm text-on-surface-variant space-y-1">
            <p>Notlar v1.0.0</p>
            <p>Dijital atölyeniz için not uygulaması</p>
          </div>
        </section>
      </div>
    </div>
  );
}
