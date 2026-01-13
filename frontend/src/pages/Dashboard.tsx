import React, { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import '../styles/Dashboard.css';
import { get_note } from '../services/app_Apis';

interface Note {
  id: number;
  title: string;
  content: string;
  lastModified: string;
  color: string;
}

type ViewMode = 'grid' | 'list';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<number | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchNotes = async () => {
        try {
            console.log('Fetching notes...');
            const data = await get_note(); 
            setNotes(data.notes);               
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    fetchNotes();
  }, []);

  const handleDeleteClick = (noteId: number): void => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (noteToDelete) {
      // TODO: Call your delete API
      // await deleteNote(noteToDelete);
      
      // Remove from state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete));
      
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleCreateNote = (): void => {
    setCurrentNoteId(undefined);
    setIsEditorOpen(true);
  };

  const handleNoteClick = (noteId: number): void => {
    setCurrentNoteId(noteId);
    setIsEditorOpen(true);
  };

  const handleEditorClose = (): void => {
    setIsEditorOpen(false);
    setCurrentNoteId(undefined);
  };

  const handleNoteSave = (savedNote: Partial<Note>): void => {
    if (currentNoteId) {
      // Update existing note
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === currentNoteId ? { ...note, ...savedNote } as Note : note
        )
      );
    } else {
      // Add new note
      const newNote: Note = {
        id: savedNote.id || Date.now(),
        title: savedNote.title || 'Untitled',
        content: savedNote.content || '',
        lastModified: savedNote.lastModified || new Date().toISOString(),
        color: savedNote.color || '#ffffff'
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
    }
    setIsEditorOpen(false);
    setCurrentNoteId(undefined);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logo">
            <svg viewBox="0 0 24 24" width="40" height="40">
              <path fill="#FFC107" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
              <path fill="#FFECB3" d="M14 2v6h6"/>
            </svg>
            <span className="logo-text">Notes</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#5f6368" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <button 
            className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </button>
          <button 
            className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* New Note Section */}
        <section className="new-note-section">
          <h2>Start a new note</h2>
          <div className="new-note-templates">
            <button className="template-card blank" onClick={handleCreateNote}>
              <div className="template-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="#4285f4" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span className="template-name">Blank note</span>
            </button>
            {/* <button className="template-card" onClick={handleCreateNote}>
              <div className="template-preview meeting">
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
                <div className="preview-line"></div>
              </div>
              <span className="template-name">Meeting notes</span>
            </button>
            <button className="template-card" onClick={handleCreateNote}>
              <div className="template-preview todo">
                <div className="preview-checkbox"></div>
                <div className="preview-checkbox"></div>
                <div className="preview-checkbox"></div>
              </div>
              <span className="template-name">To-do list</span>
            </button> */}
          </div>
        </section>

        {/* Recent Notes Section */}
        <section className="recent-notes-section">
          <div className="section-header">
            <h2>Recent notes</h2>
            <div className="section-actions">
              <span className="note-count">{filteredNotes.length} notes</span>
            </div>
          </div>
          
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="#dadce0" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              <p>No notes found</p>
            </div>
          ) : (
            <div className={`notes-container ${viewMode}`}>
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  viewMode={viewMode}
                  onClick={() => handleNoteClick(note.id)}
                  onDelete={() => handleDeleteClick(note.id)} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          noteId={currentNoteId}
          onClose={handleEditorClose}
          onSave={handleNoteSave}
        />
      )}

      {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          noteTitle={notes.find(n => n.id === noteToDelete)?.title}
        />

    </div>
  );
};

export default Dashboard;