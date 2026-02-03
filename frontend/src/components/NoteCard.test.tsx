import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteCard from './NoteCard';

const mockNote = {
  id: 1,
  user_id: 1,
  title: 'Test Note',
  content: '<p>This is a test note content.</p>',
  createdAt: '2023-10-01T10:00:00Z',
  updatedAt: '2023-10-01T10:00:00Z',
};

describe('NoteCard', () => {
  const mockOnClick = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders in grid view', () => {
    render(
      <NoteCard
        note={mockNote}
        viewMode="grid"
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note content.')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // delete button
  });

  it('renders in list view', () => {
    render(
      <NoteCard
        note={mockNote}
        viewMode="list"
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note content.')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(
      <NoteCard
        note={mockNote}
        viewMode="grid"
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Test Note'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <NoteCard
        note={mockNote}
        viewMode="grid"
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});