import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { CreateNoteData, UpdateNoteData } from '../types/note.types';

const noteService = {
  // Get all notes
  getAllNotes: async () => {
    try {
      const notes = await prisma.note.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return notes;
    } catch (error) {
      throw error;
    }
  },

  // Get note by ID
  getNoteById: async (id: string) => {
    try {
      const note = await prisma.note.findUnique({
        where: { id },
      });

      if (!note) {
        throw new AppError('Note not found', 404);
      }

      return note;
    } catch (error) {
      throw error;
    }
  },

  // Create new note
  createNote: async (noteData: CreateNoteData) => {
    try {
      const note = await prisma.note.create({
        data: {
          title: noteData.title,
          content: noteData.content,
        },
      });

      return note;
    } catch (error) {
      throw error;
    }
  },

  // Update note
  updateNote: async (id: string, noteData: UpdateNoteData) => {
    try {
      // Check if note exists
      const existingNote = await prisma.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        throw new AppError('Note not found', 404);
      }

      // Update note
      const note = await prisma.note.update({
        where: { id },
        data: {
          ...(noteData.title && { title: noteData.title }),
          ...(noteData.content && { content: noteData.content }),
        },
      });

      return note;
    } catch (error) {
      throw error;
    }
  },

  // Delete note
  deleteNote: async (id: string) => {
    try {
      // Check if note exists
      const existingNote = await prisma.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        throw new AppError('Note not found', 404);
      }

      await prisma.note.delete({
        where: { id },
      });

      return { message: 'Note deleted successfully' };
    } catch (error) {
      throw error;
    }
  },
};

export default noteService;
