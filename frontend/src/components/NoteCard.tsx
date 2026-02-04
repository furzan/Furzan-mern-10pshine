import React, { useState } from 'react';
import '../styles/NoteCard.css';

interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode, onClick, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit', 
      hour12: true,
    });

    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago, ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
      });
      return `${dateStr}, ${timeStr}`;
    }
  };


  const [bgColor] = useState(() => {
    const colors = [
        '#FFF1B8', // soft warm yellow
        '#FFD6C9', // light peach
        '#FFE3A3', // pastel gold
        '#FFF0C2', // creamy yellow
        '#FFD1CC', // light coral
        '#FFE4D9', // warm blush
        '#F3F8C2', // soft lime-warm
        '#FFE0EA'  // light warm pink
      ];


    return colors[Math.floor(Math.random() * colors.length)];
  });

  const stripHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div 
      className={`note-card ${viewMode}`}
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="note-card-header">
            <h3 className="note-title">{note.title}</h3>
            <button className="note-menu-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
          <div
            className="note-preview"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <div className="note-footer">
            <span className="note-date">{formatDate(note.updatedAt)}</span>
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
            <div
              className="note-preview"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
          <div className="note-list-meta">
            <span className="note-date">{formatDate(note.updatedAt)}</span>
            <button className="note-menu-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default NoteCard;