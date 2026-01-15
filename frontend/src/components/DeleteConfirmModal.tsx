import React from 'react';
import '../styles/DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  noteTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  noteTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path
              fill="#f44336"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>
        
        <h2 className="delete-modal-title">Delete Note?</h2>
        
        <p className="delete-modal-message">
          {noteTitle ? (
            <>
              Are you sure you want to delete "<strong>{noteTitle}</strong>"?
            </>
          ) : (
            'Are you sure you want to delete this note?'
          )}
          <br />
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button className="delete-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;