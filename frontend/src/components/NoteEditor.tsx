import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import type { NoteData } from '../services/models'
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
  noteData?: NoteData;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId, onClose, onSave, noteData }) => {
  const editor = useRef(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Fixed warm vibrant color
  const noteColor = '#ffe7c9';

  // Jodit editor configuration
  const config = useMemo(
    () => ({
      readonly: false,
      // Hide placeholder when opening an existing note
      placeholder: noteId || noteData ? '' : 'Start typing your notes...',
      minHeight: 500,
      toolbar: true,
      spellcheck: true,
      language: 'en',
      toolbarButtonSize: 'small',
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
    [noteId, noteData]
  );


  // If caller passed `noteData` (existing note), initialize editor from it
  useEffect(() => {
    if (noteData) {
      if (noteData.title) setTitle(noteData.title);
      if (noteData.content) setContent(noteData.content);
      setHasChanges(false);
    }
  }, [noteData]);


  const handleSave = async (): Promise<void> => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setIsSaving(true);

    // TODO: Replace with actual API call
    // try {
    //   const noteData = {
    //     id: noteId,
    //     title: title.trim(),
    //     content,
    //     color: noteColor,
    //     lastModified: new Date().toISOString()
    //   };
    //
    //   const url = noteId ? `/api/notes/${noteId}` : '/api/notes';
    //   const method = noteId ? 'PUT' : 'POST';
    //
    //   const response = await fetch(url, {
    //     method,
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(noteData)
    //   });
    //
    //   if (response.ok) {
    //     const savedNote = await response.json();
    //     onSave(savedNote);
    //   }
    // } catch (error) {
    //   console.error('Error saving note:', error);
    //   alert('Failed to save note. Please try again.');
    // } finally {
    //   setIsSaving(false);
    // }

    // Mock save for demonstration
    setTimeout(() => {
      const savedNote: Partial<Note> = {
        id: noteId || Date.now(),
        title: title.trim(),
        content,
        color: noteColor,
        lastModified: new Date().toISOString()
      };
      onSave(savedNote);
      setIsSaving(false);
      setHasChanges(false);
    }, 500);
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
              config={config as any}
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