import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folders';
import noteRoutes from './routes/notes';
import tagRoutes from './routes/tags';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/folders', folderRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
