'use strict';

// These are the imports that we will require
import express from 'express'
import sqlite3 from 'sqlite3'
const app = express()


// This is how we will get the database that is within our system
async function getDBConnection() {
  const db = new sqlite3.Database("./registration.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
  })
  return db;
}

async function makeTables() {

}



getDBConnection();

app.use(express.json())
app.post('/users', async (req, res) => {
  res.send({name : "happy"})
})

export default app