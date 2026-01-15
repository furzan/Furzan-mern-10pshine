import { axiosInstance } from './client/AxiosClient'
import type { NoteData } from './models';


export async function create_note(data: NoteData) {
  try {
    const response = await axiosInstance.post('/notes/create_note', data);
    console.log('note added successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
}

export async function get_note() {
  try {
    const response = await axiosInstance.get('/notes/get_notes');
    console.log('notes retrieved successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error retrieving notes:', error);
    throw error;
  }
}

export async function update_note(data: NoteData, note_id: number) {
  try {
    const response = await axiosInstance.put('/notes/update_note/' + note_id, data);
    console.log('note updated successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}


export async function delete_note(note_id: number) {
  try {
    const response = await axiosInstance.delete('/notes/delete_note/' + note_id);
    console.log('note deleted successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}