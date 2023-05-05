'use strict';

// These are the imports that we will require
import express from 'express'
import sqlite3 from 'sqlite3'

// we need these
const verboseSqlite = sqlite3.verbose();
const app = express();


// This is how we will get the database that is within our system
function getDBConnection() {

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
app.get('/getClasses', async (req, res) => {
  getClasses(res);
})

app.post('/addClasses', async (req, res) => {
  let db = await getDBConnection()
  let class_id = req.body.class_id;
  let credits = req.body.credits;
  let rating = req.body.rating;
  let average_gpa = req.body.average_gpa;
  let professor = req.body.professor;
  let assistant_professor = req.body.assistant_professor;
  let class_times = req.body.class_times;

  let addClass = 'INSERT INTO classes(class_id, credits, rating, average_gpa, professor, assistant_professor, class_times) VALUES (?, ?, ?, ?, ?, ?, ?);';
  db.run(addClass, [class_id, credits, rating, average_gpa, professor, assistant_professor, class_times], function (err) {
    if (err) {
      console.error('Error inserting class:', err);
      res.status(500).json({ message: 'Error inserting class', error: err });
    } else {
      res.status(201).json({ message: 'Class added successfully', class_id: class_id });
    }
  });
})

app.post('removeClasses', async (req, res) => {
  let db = await getDBConnection()
  let class_id = req.body.class_id;

  let removeClass = 'DELETE FROM classes WHERE class_id=?'
  db.run(removeClass, [class_id], function (err) {
    if (err) {
      console.error('Error removing class:', err);
      res.status(500).json({ message: 'Error removing class ' + class_id, error: err });
    } else {
      res.status(201).json({ message: 'Class removed successfully', class_id: class_id });
    }
  });
})

// TODO: We don't have a table that stores which student is registered for which class.
// Do we want to CREATE TABLE registered(net_id TEXT REFERENCES students(net_id), class_id TEXT REFERENCES classes(class_id))
// or do we want to add this data to the already existing STUDENTS table (would have to add several columns, some of which could be null)?
app.post('registerClass', async(req, res) => {
  let db = await getDBConnection()
})

async function getClasses(res) {
  var database = await getDBConnection();

  let qry2 = "SELECT* FROM classes;";

  try {
    database.all(qry2, [], (err,rows) => {
      if(err) return console.error(err.message);
      var classes = []
      rows.forEach((row) => {
        classes.push(row)
      });
      //console.log(classes)
      res.send({"class" : classes})
    })

  } catch (error) {
    res.send({"class": "error"})
  }
  database.close()
}

// this is a basic test
app.post('/users', async (req, res) => {
  res.send({name : "happy"})
})

export default app

