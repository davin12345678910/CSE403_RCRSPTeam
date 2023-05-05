import app from './app.js'
import fs from 'fs'
import express from 'express';

// const express = require("express");
// const fs = require("fs");


app.use(express.json());

const logStream = fs.createWriteStream("login.log", { flags: "a" });

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${email} logged in\n`;

  logStream.write(logEntry);

  res.status(200).json({ message: "Login successful" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});