/*
 * Contributors: Ahmed Helow, Azaan Khalfe, Chairnet Tegegne Muche, Davin Win Kyi,
 * Foad Shariat, and Sol Zamora.
 */


"use strict";

const express = require('express');
const app = express();

app.get('/posts', function (req, res) {
  res.type("text").send("pussy");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);
