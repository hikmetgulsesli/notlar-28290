import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditorPage } from './pages/EditorPage';
import { NoteDetail } from './components/NoteDetail';
import './index.css';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex pt-16">
          <Sidebar />
          <main className="ml-64 flex-grow p-8 bg-background">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/editor/:id" element={<EditorPage />} />
                <Route path="/note/:id" element={<NoteDetail />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
