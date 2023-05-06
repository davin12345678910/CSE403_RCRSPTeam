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

/*
We only need this function when we need to first initialize the database with the tables we need
*/
async function makeTables() {
  var database = await getDBConnection();

  // here we will be inputting the tables we need into the database
  // 1. Students
  let queryStudents = 'CREATE TABLE students(net_id TEXT PRIMARY KEY, student_name TEXT, major TEXT, email TEXT, hash_pass TEXT, salt TEXT);';

  // 2. Professor
  let queryProfessors = 'CREATE TABLE professors(net_id TEXT PRIMARY KEY, professor_name TEXT, department TEXT, tenure INTEGER, email TEXT, rating INT);';

  // 3. Advisers
  let queryAdvisers = 'CREATE TABLE advisers(net_id TEXT PRIMARY KEY, adviser_name TEXT, department TEXT, email TEXT);';

  // 4. Classes
  let queryClasses = 'CREATE TABLE classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT, quarter TEXT);';

  // 5. Sections
  let querySections = 'CREATE TABLE sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';

  database.run(queryStudents);
  database.run(queryProfessors);
  database.run(queryAdvisers);
  database.run(queryClasses);
  database.run(querySections);

  database.close();
}

// makeTables();

app.use(express.json())
// this is a basic test for status checking
app.post('/users', async (req, res) => {
  res.send({name : "happy"})
})



app.get('/getClasses', async (req, res) => {
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
  let quarter = req.body.quarter;

  let addClass = 'INSERT INTO classes(class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
  db.run(addClass, [class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter], function (err) {
    if (err) {
      console.error('Error inserting class:', err);
      res.status(500).json({ message: 'Error inserting class', error: err });
    } else {
      res.status(201).json({ message: 'Class added successfully', class_id: class_id });
    }
  });
})

app.post('/removeClasses', async (req, res) => {
  let db = await getDBConnection()
  let class_id = req.body.class_id;

  let removeClass = 'DELETE FROM classes WHERE class_id =?;';

  db.run(removeClass, [class_id], function (err) {
    if (err) {
      console.error('Error removing class:', err);
      res.status(500).json({ message: 'Error removing class ' + class_id, error: err});
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




app.post('/login', async (req, res) => {
  const db = await getDBConnection();
  let query = 'SELECT email, hash_pass, salt FROM students WHERE student.email == email';

  const email = req.body.email;
  const password = req.body.password;

  try {
    db.all(query, [], (err, result) => {
      if (err) return console.error(err.message);
      const hash_pass = result[1]
    });
  } catch (error) {
    res.send({"login" : "error"})
  }

  db.close()
})

export default app

