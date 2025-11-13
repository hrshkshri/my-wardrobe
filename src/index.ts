import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import noteRoutes from './routes/note.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to My Wardrobe Notes API' });
});

app.use('/api/notes', noteRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
