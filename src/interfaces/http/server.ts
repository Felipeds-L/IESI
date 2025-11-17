import express from 'express';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World from IESI backend!' });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});