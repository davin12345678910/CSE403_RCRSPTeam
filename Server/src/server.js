import app from './app.js'
import fs from 'fs'
import express from 'express';
import cors from 'cors';

app.use(express.json());
app.use(cors());

const logStream = fs.createWriteStream("login.log", { flags: "a" });

app.post("/log", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${email} logged in\n`;

  logStream.write(logEntry);

  res.status(200).json({ message: "Login successful" });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
