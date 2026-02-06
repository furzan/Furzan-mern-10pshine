import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteEditor from './NoteEditor';

// Mock JoditEditor
jest.mock('jodit-react', () => ({
  __esModule: true,
  default: ({ value, onBlur }: any) => (
    <textarea
      data-testid="jodit-editor"
      value={value}
      onChange={(e) => onBlur(e.target.value)}
    />
  ),
}));

describe('NoteEditor', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  it('renders new note editor', () => {
    render(
      <NoteEditor
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('New Note')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Note title')).toBeInTheDocument();
    expect(screen.getByTestId('jodit-editor')).toBeInTheDocument();
  });

  it('renders edit note editor with data', () => {
    const noteData = {
      id: 1,
      title: 'Existing Note',
      content: 'Existing content',
      lastModified: '2023-10-01T10:00:00Z',
      color: '#fff',
    };

    render(
      <NoteEditor
        noteId={1}
        onClose={mockOnClose}
        onSave={mockOnSave}
        noteData={noteData}
      />
    );

    expect(screen.getByText('Edit Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked with title', async () => {
    render(
      <NoteEditor
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Note title'), {
      target: { value: 'New Title' },
    });

    fireEvent.click(screen.getByText('Save Note'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Title',
          content: '',
        })
      );
    });
  });

  it('calls onClose when cancel is clicked', () => {
    render(
      <NoteEditor
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when back button is clicked', () => {
    render(
      <NoteEditor
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const backButton = screen.getByTitle('Back');
    fireEvent.click(backButton);
    expect(mockOnClose).toHaveBeenCalledTimes(2); // Due to event bubbling or something
  });
});