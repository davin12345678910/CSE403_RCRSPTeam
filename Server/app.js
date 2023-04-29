/*
 * Contributors: Ahmed Helow, Azaan Khalfe, Chairnet Tegegne Muche, Davin Win Kyi,
 * Foad Shariat, and Sol Zamora.
 */


"use strict";

const express = require('express');
const app = express();


// This is for the database
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


// This is the multer module
const multer = require("multer");
app.use(multer().none());
// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module


/**
 * This is how we make a db over here, and this is also
 * where we are going to get the database we are going to
 * be interacting with
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "registration.db",
    driver: sqlite3.Database
  });

  return db;
}


async function createTables() {
  /**
   * Initialize tables
   */
  var database = await getDBConnection();

  // here we will be inputting the tables we need into the database

  // 1. Students
  let queryStudents = 'CREATE TABLE students(net_id TEXT PRIMARY KEY, student_name TEXT, major TEXT, email TEXT);';
  //await database.run(queryStudents);

  // 2. Professor
  let queryProfessors = 'CREATE TABLE professors(net_id TEXT PRIMARY KEY, professor_name TEXT, department TEXT, tenure INTEGER, email TEXT, rating INT);';
  //await database.run(queryProfessors);

  // 3. Advisers
  let queryAdvisers = 'CREATE TABLE advisers(net_id TEXT PRIMARY KEY, adviser_name TEXT, department TEXT, email TEXT);';
  //await database.run(queryAdvisers);

  // 4. Classes
  let queryClasses = 'CREATE TABLE classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT);';
  //await database.run(queryClasses);

  // 5. Classes
  let querySections = 'CREATE TABLE sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';
  //await database.run(querySections);

  database.close();
}

//createTables();



async function testAdd() {
  var database = await getDBConnection();
  let qry = 'INSERT INTO classes ("class_id", "credits", "rating", "average_gpa", "professor", "assistant_professor", "class_times") VALUES ("123", 5, 3.5, 3.5, "nigiri", "pokimaine", "11:20-5:30");';
  //await database.run(qry);

  let qry2 = 'SELECT* FROM classes;';
  let classes = await database.all(qry2);
  console.log(classes);
}

testAdd();



app.get('/posts', function (req, res) {
  res.type("text").send("pussy");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);
