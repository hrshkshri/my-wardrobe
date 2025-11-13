import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import noteService from '../services/note.service';
import { AppError } from '../utils/AppError';

const noteController = {
  // Get all notes
  getAllNotes: expressAsyncHandler(async (req: Request, res: Response) => {
    const notes = await noteService.getAllNotes();

    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
    });
  }),

  // Get a single note by ID
  getNoteById: expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const note = await noteService.getNoteById(id);

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note,
    });
  }),

  // Create a new note
  createNote: expressAsyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      throw new AppError('Title and content are required', 400);
    }

    const note = await noteService.createNote({ title, content });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  }),

  // Update a note
  updateNote: expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validation - at least one field should be provided
    if (!title && !content) {
      throw new AppError(
        'At least one field (title or content) must be provided',
        400
      );
    }

    const note = await noteService.updateNote(id, { title, content });

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  }),

  // Delete a note
  deleteNote: expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await noteService.deleteNote(id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  }),
};

export default noteController;
