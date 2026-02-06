import React, { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import { get_note, delete_note, update_note, create_note } from '../services/app_Apis';
import { logout } from '../services/auth_Apis';

interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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

  const storeduserData = sessionStorage.getItem('user');
  let userData = {
        id: 0,
        f_name: '',
        l_name: '',
        email: '',
        created_at: '',
         
  };
  if (storeduserData) {
    userData = JSON.parse(storeduserData);
  }

  const navigate = useNavigate();
  
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

  const handleLogout = async (): Promise<void> => {
    try {
      await logout(userData.email);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const handleDeleteClick = (noteId: number): void => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (noteToDelete) {
      try{
        await delete_note(noteToDelete);
      }
      catch (error) {
        console.error('Error deleting note:', error);
      }
      
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

  const handleNoteSave = async (savedNote: Partial<Note>): Promise<void> => {
    if (currentNoteId) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === currentNoteId ? { ...note, ...savedNote, updatedAt: new Date().toISOString() } as Note : note
        )
      );

      await update_note({title: savedNote?.title || '', content: savedNote?.content || ''}, currentNoteId);

    } else {
      // Add new note
      const newNote: Note = {
        id: savedNote.id || Date.now(),
        user_id: userData.id,
        title: savedNote.title || 'Untitled',
        content: savedNote.content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const res_createnote = await create_note({title: newNote.title, content: newNote.content});
      
      newNote.id = res_createnote.note.id
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
         
          <div className="menu-icon" onClick={handleLogout} title="Logout" >
            <svg 
              viewBox="0 0 24 24" 
              width="22" 
              height="22" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          
          <div className="logo">
            <svg viewBox="0 0 24 24" width="44" height="44">
              <defs>
                <linearGradient id="noteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path fill="url(#noteGradient)" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
              <path fill="#ffffff" opacity="0.9" d="M14 2v6h6"/>
            </svg>
            <span className="logo-text">Notes</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#667eea" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search your notes..."
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


        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-badge">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Dashboard</span>
            </div>
            
            <h1 className="welcome-title">
              Welcome back, <span className="user-name">{userData.f_name}</span> 👋
            </h1>
            
            <p className="welcome-subtitle">
              Let's organize your thoughts and make today productive
            </p>
            
            <div className="welcome-stats">
              <div className="stat-card">
                <div className="stat-icon notes-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <p className="stat-number">{notes.length}</p>
                  <p className="stat-label">Total Notes</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon recent-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <p className="stat-number">{notes.filter(n => {
                    const noteDate = new Date(n.updatedAt);
                    const today = new Date();
                    return noteDate.toDateString() === today.toDateString();
                  }).length}</p>
                  <p className="stat-label">Today</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon time-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <p className="stat-number">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="stat-label">Current Time</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="welcome-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </section>



        {/* New Note Section */}
        <section className="new-note-section">
          <h2>Start a new note</h2>
          <div className="new-note-templates">
            <button className="template-card blank" onClick={handleCreateNote}>
              <div className="template-icon">
                <svg viewBox="0 0 24 24" width="52" height="52">
                  <defs>
                    <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path fill="url(#plusGradient)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span className="template-name">Create Note</span>
            </button>
          </div>
        </section>

        {/* Recent Notes Section */}
        <section className="recent-notes-section">
          <div className="section-header">
            <h2>Your Notes</h2>
            <div className="section-actions">
              <span className="note-count">{filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}</span>
            </div>
          </div>
          
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" width="80" height="80">
                <defs>
                  <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 0.3}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 0.3}} />
                  </linearGradient>
                </defs>
                <path fill="url(#emptyGradient)" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              <p className="empty-title">No notes yet</p>
              <p className="empty-subtitle">Start creating your first note to get organized</p>
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
          noteData={notes.find(n => n.id === currentNoteId)}
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