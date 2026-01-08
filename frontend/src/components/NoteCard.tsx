import React from 'react';
import '../styles/NoteCard.css';

interface Note {
  id: number;
  title: string;
  content: string;
  lastModified: string;
  color: string;
}

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode, onClick }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    // TODO: Open menu options (delete, duplicate, etc.)
    console.log('Menu clicked for note:', note.id);
  };

  return (
    <div 
      className={`note-card ${viewMode}`}
      onClick={onClick}
      style={{ backgroundColor: note.color }}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="note-card-header">
            <h3 className="note-title">{note.title}</h3>
            <button className="note-menu-btn" onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
          <p className="note-preview">{note.content}</p>
          <div className="note-footer">
            <span className="note-date">{formatDate(note.lastModified)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="note-list-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#5f6368" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
            </svg>
          </div>
          <div className="note-list-content">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-preview">{note.content}</p>
          </div>
          <div className="note-list-meta">
            <span className="note-date">{formatDate(note.lastModified)}</span>
            <button className="note-menu-btn" onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;