import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import '../styles/NoteEditor.css';

interface Note {
  id: number;
  title: string;
  content: string;
  lastModified: string;
  color: string;
}

interface NoteEditorProps {
  noteId?: number;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId, onClose, onSave }) => {
  const editor = useRef(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Fixed warm vibrant color
  const noteColor = '#fff4e6';

  // Jodit editor configuration
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing your notes...',
      minHeight: 500,
      toolbar: true,
      spellcheck: true,
      language: 'en',
      toolbarButtonSize: 'medium',
      toolbarAdaptive: true,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      statusbar: false,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'outdent',
        'indent',
        '|',
        'fontsize',
        'brush',
        '|',
        'align',
        '|',
        'link',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser'
      ],
      buttonsXS: [
        'bold',
        'italic',
        '|',
        'ul',
        'ol',
        '|',
        'fontsize',
        '|',
        'undo',
        'redo'
      ]
    }),
    []
  );

  // Fetch note data if editing existing note
  const fetchNote = async (id: number): Promise<void> => {
    
    setTimeout(() => {
      const mockNote: Note = {
        id,
        title: 'Sample Note Title',
        content: '<p>This is sample content for the note editor.</p>',
        lastModified: new Date().toISOString(),
        color: noteColor
      };
      setTitle(mockNote.title);
      setContent(mockNote.content);
    }, 300);
  };

  useEffect(() => {
    if (noteId) {
      fetchNote(noteId);
    }
  }, [noteId]);


  const handleSave = async (): Promise<void> => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setIsSaving(true);

  };

  const handleCancel = (): void => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (newContent: string): void => {
    setContent(newContent);
    setHasChanges(true);
  };

  return (
    <div className="note-editor-overlay">
      <div className="note-editor-modal">
        {/* Header */}
        <div className="note-editor-header">
          <div className="header-left">
            <button className="back-button" onClick={handleCancel} title="Back">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <h1 className="editor-title-label">
              {noteId ? 'Edit Note' : 'New Note'}
            </h1>
          </div>
          
          <div className="header-actions">
            <button 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
            >
              {isSaving ? (
                <>
                  <span className="spinner"></span>
                  <span className="button-text">Saving...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  <span className="button-text">Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="note-editor-content" style={{ backgroundColor: noteColor }}>
          <input
            type="text"
            className="note-title-input"
            placeholder="Note title"
            value={title}
            onChange={handleTitleChange}
            autoFocus
          />
          
          <div className="editor-wrapper">
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              onBlur={handleContentChange}
              onChange={() => {}} // Use onBlur for better performance
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;