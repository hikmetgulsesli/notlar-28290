export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isTrash: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  archiveNote: (id: string) => void;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  searchNotes: (query: string) => Note[];
  filterByTag: (tag: string) => Note[];
}
