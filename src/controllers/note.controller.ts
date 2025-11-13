import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Get all notes
export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.note.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
