import app from './app.js'
import express from 'express';
import cors from 'cors';

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
