import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Hello from TixGenius Backend!' });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
}); 