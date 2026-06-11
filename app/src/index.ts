import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
const PORT = 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});