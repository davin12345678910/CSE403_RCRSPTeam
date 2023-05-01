'use strict';

// These are the imports that we will require
import express from 'express'
import sqlite3 from 'sqlite3'

const verboseSqlite = sqlite3.verbose();

const app = express()


// This is how we will get the database that is within our system
async function getDBConnection() {
  const db = new verboseSqlite.Database("./registration.db", verboseSqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
  })
  return db;
}


async function makeTables() {
  var database = await getDBConnection();

  // here we will be inputting the tables we need into the database

  // 1. Students
  let queryStudents = 'CREATE TABLE students(net_id TEXT PRIMARY KEY, student_name TEXT, major TEXT, email TEXT);';
  //database.run(queryStudents);

  // 2. Professor
  let queryProfessors = 'CREATE TABLE professors(net_id TEXT PRIMARY KEY, professor_name TEXT, department TEXT, tenure INTEGER, email TEXT, rating INT);';
  //database.run(queryProfessors);

  // 3. Advisers
  let queryAdvisers = 'CREATE TABLE advisers(net_id TEXT PRIMARY KEY, adviser_name TEXT, department TEXT, email TEXT);';
  //database.run(queryAdvisers);

  // 4. Classes
  let queryClasses = 'CREATE TABLE classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT);';
  //database.run(queryClasses);

  // 5. Sections
  let querySections = 'CREATE TABLE sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';
  //database.run(querySections);

  database.close();
}

//makeTables();

app.use(express.json())
app.post('/getClasses', async (req, res) => {
  getClasses(res);
})

async function getClasses(res) {
  var database = await getDBConnection();

  let qry2 = "SELECT* FROM classes;";

  database.all(qry2, [], (err,rows) => {
    if(err) return console.error(err.message);
    var classes = []
    rows.forEach((row) => {
      classes.push(row)
    });
    //console.log(classes)
    res.send({"class" : classes})
  })
  database.close()
}

// testAdd();


app.post('/users', async (req, res) => {
  res.send({name : "happy"})
})

export default app