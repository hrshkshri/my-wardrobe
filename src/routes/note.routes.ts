import { Router } from 'express';
import noteController from '../controllers/note.controller';

const router = Router();

// GET /api/notes - Get all notes
router.get('/', noteController.getAllNotes);

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', noteController.getNoteById);

// POST /api/notes - Create a new note
router.post('/', noteController.createNote);

// PUT /api/notes/:id - Update a note
router.put('/:id', noteController.updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', noteController.deleteNote);

export default router;
