import { prisma } from '../lib/prisma';

export class NoteService {
  async getAllNotes() {
    return await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getNoteById(id: string) {
    return await prisma.note.findUnique({
      where: { id },
    });
  }

  async createNote(title: string, content: string) {
    return await prisma.note.create({
      data: {
        title,
        content,
      },
    });
  }

  async updateNote(id: string, title?: string, content?: string) {
    return await prisma.note.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });
  }

  async deleteNote(id: string) {
    return await prisma.note.delete({
      where: { id },
    });
  }
}

export const noteService = new NoteService();
