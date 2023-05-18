'use strict';

// These are the imports that we will require
import express, { query } from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import cors from 'cors';
import { get } from 'http';

/*
* GLOBAL VARIABLES
*/
const MAX_HASH = 10 ** 14;
const MAX_SALT = 10 ** 6;
const SUCCESS = 200;
const FAILURE = 400;
const ERROR   = 500;

// we need these
const verboseSqlite = sqlite3.verbose();
const app = express();
app.use(cors());

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
async function makeTables(db) {
  // 1. People
  let queryPeople = "CREATE TABLE IF NOT EXISTS people(net_id TEXT PRIMARY KEY, email TEXT, hash_pass TEXT, salt TEXT, role TEXT)"

  // 2. Students
  let queryStudents = 'CREATE TABLE IF NOT EXISTS students(net_id TEXT PRIMARY KEY REFERENCES people(net_id), student_name TEXT, major TEXT);';

  // 3. Professor
  let queryProfessors = 'CREATE TABLE IF NOT EXISTS professors(net_id TEXT PRIMARY KEY REFERENCES people(net_id), professor_name TEXT, department TEXT, tenure INTEGER, rating INT);';

  // 4. Advisers
  let queryAdvisers = 'CREATE TABLE IF NOT EXISTS advisers(net_id TEXT PRIMARY KEY REFERENCES people(net_id), adviser_name TEXT, department TEXT);';

  // 5. Classes
  let queryClasses = 'CREATE TABLE IF NOT EXISTS classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT, quarter TEXT, class_name TEXT, sln INTEGER, add_code_required INTEGER);';

  // 6. Sections
  let querySections = 'CREATE TABLE IF NOT EXISTS sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';

  // 7. Registered Classes
  let queryRegisterClass = 'CREATE TABLE IF NOT EXISTS registration(net_id TEXT REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), CONSTRAINT PK_Registration PRIMARY KEY (net_id,class_id));';

  // 8. Waitlist
  let queryWaitlist = 'CREATE TABLE IF NOT EXISTS waitlist(net_id TEXT REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), position INTEGER);';

  // 9. Addcode
  let queryAddcode = 'CREATE TABLE IF NOT EXISTS addCode(add_id TEXT PRIMARY KEY, add_code_status TEXT, JobType TEXT, add_code INTEGER, class TEXT, net_id TEXT);';

  // 10. Messages
  let queryMessages = 'CREATE TABLE IF NOT EXISTS messages(net_id_sender TEXT, JobType_sender TEXT, net_id_reciever TEXT, JobType_reciever TEXT, message TEXT);';

  // TODO: Table for addCodes, version 2, which will be the class, add code, and a list of people who have the add codes

  await dbRun(db, queryPeople, []);
  await dbRun(db, queryStudents, []);
  await dbRun(db, queryProfessors, []);
  await dbRun(db, queryAdvisers, []);
  await dbRun(db, queryClasses, []);
  await dbRun(db, querySections, []);
  await dbRun(db, queryRegisterClass, []);
  await dbRun(db, queryWaitlist, []);
  await dbRun(db, queryAddcode, []);
  await dbRun(db, queryMessages, []);

  return true;
}

async function addStartupData(db) {
  // Add default class
  let hasDefaultClass = await getClass(db, '345');
  if (!hasDefaultClass) {
    await addClass(db, '345', null, null, null, 'x', null, null, null, null, null, null);
  }

  // Add default student
  let hasDefaultStudent = await getStudent(db, 'pokemon678');
  if (!hasDefaultStudent) {
    await addStudent(db, 'pokemon678', 'pokemon678@uw.edu', '123', 'azaan', 'electrical engineering');
  }

  // Add default professor
  let hasDefaultProfessor = await getProfessor(db, '123');
  if (!hasDefaultProfessor) {
    await addProfessor(db, '123', '123@uw.edu', 'pass123', 'x', 'math', '0', '4');
  }

  // Add default adviser
  let hasDefaultAdviser = await getAdviser(db, '456');
  if (!hasDefaultAdviser) {
    await addAdviser(db, '456', '456@uw.edu', 'pass456', 'x', 'math');
  }

  // Add default section
  let hasDefaultSection = await getSection(db, '331');
  if (!hasDefaultSection) {
    await addSection(db, '331', 'x', 'y', '11:30-12:20', '345');
  }

  // Add default registration
  let hasDefaultRegistration = await getRegistration(db, '123', '345');
  if (!hasDefaultRegistration) {
    await addRegistration(db, '123', '345');
  }

  // Add default waitlist
  let hasDefaultWaitlist = await getWaitlist(db, 'pokemon678', '345');
  if (!hasDefaultWaitlist) {
    await addWaitlist(db, 'pokemon678', '345')
  }

  // Add default addcode
  let hasDefaultAddcode = await getAddCodes(db, 'CSE 403');
  if (!hasDefaultAddcode[0]) {
    await addAddCode(db, '1', '0', 'Adviser', '123', 'CSE 403', 'pokemon678');
  }
}

app.use(express.json())

/* ######################################
*
*           INITIALIZE DATABASE
*
*  ###################################### */

async function init() {
  let db = getDBConnection();
  await makeTables(db);
  await addStartupData(db);
  db.close();
}
init();

/* ######################################
*
*               ENDPOINTS
*
*  ###################################### */

// This is a basic test for status checking
app.post('/users', async (req, res) => {
  let result = setResDefaults('/users', 200);
  res.send(result);
})

app.get('/getClasses', async (req, res) => {
  let db = getDBConnection();
  let classes = await getClasses(db);
  db.close();

  let status = classes ? SUCCESS : ERROR;
  let result = setResDefaults('/getClasses', status);
  result.class = classes;
  res.send(result);
})

app.get('/getProfessors', async (req, res) => {
  let db = getDBConnection();
  let professors = await getProfessors(db);
  db.close()

  let status = professors ? SUCCESS : ERROR;
  let result = setResDefaults('/getProfessors', status);
  result.professors = professors;
  res.send(result);
})

app.get('/getStudents', async (req, res) => {
  let db = getDBConnection();
  let students = await getStudents(db);
  db.close();

  let status = students ? SUCCESS : ERROR;
  let result = setResDefaults('/getStudents', status);
  result.students = students;
  res.send(result);
})

app.get('/getAdvisers', async (req, res) => {
  let db = getDBConnection();
  let advisers = await getAdvisers(db);
  db.close();

  let status = advisers ? SUCCESS : ERROR;
  let result = setResDefaults('/getAdvisers', status);
  result.advisers = advisers;
  res.send(result);
})

app.post('/getClass', async (req, res) => {
  let db = getDBConnection();
  let class_id = req.body.class_id;
  let class_ = await getClass(db, class_id);
  db.close();

  let status = class_ ? SUCCESS : ERROR;
  let result = setResDefaults('/getClass', status);
  result.class = class_;
  res.send(result);
})

app.post('/getProfessor', async (req,res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let professor = await getProfessor(db, net_id);
  db.close();

  let status = professor ? SUCCESS : ERROR;
  let result = setResDefaults('/getProfessor', status);
  result.professor = professor;
  res.send(result);
})

app.post('/getStudent', async (req,res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let student = await getStudent(db, net_id);
  db.close();

  let status = student ? SUCCESS : ERROR;
  let result = setResDefaults('/getStudent', status);
  result.student = student;
  res.send(result);
})

app.post('/getAdviser', async (req,res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let adviser = await getAdviser(db, net_id);
  db.close();

  let status = adviser ? SUCCESS : ERROR;
  let result = setResDefaults('/getAdviser', status);
  result.adviser = adviser;
  res.send(result);
})

app.post('/getSection', async (req,res) => {
  let db = getDBConnection();
  let section_id = req.body.section_id;
  let section = await getSection(db, section_id);
  db.close();

  let status = section ? SUCCESS : ERROR;
  let result = setResDefaults('/getSection', status);
  result.section = section;
  res.send(result);
})

app.post('/addClass', async (req, res) => {
  let db = getDBConnection()
  let class_id = req.body.class_id;
  let credits = req.body.credits;
  let rating = req.body.rating;
  let average_gpa = req.body.average_gpa;
  let professor = req.body.professor;
  let assistant_professor = req.body.assistant_professor;
  let class_times = req.body.class_times;
  let quarter = req.body.quarter;
  let class_name = req.body.class_name;
  let sln = req.body.sln;
  let add_code_required = req.body.add_code_required;
  let success = await addClass(db, class_id, credits, rating, average_gpa, professor,
    assistant_professor, class_times, quarter, class_name, sln, add_code_required);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addClass', status);
  res.send(result);
})

app.post('/addProfessor', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let professor_name = req.body.professor_name;
  let department = req.body.department;
  let tenure = req.body.tenure;
  let rating = req.body.rating;
  let success = await addProfessor(db, net_id, email, password, professor_name, department, tenure, rating);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addProfessor', status);
  res.send(result);
})

app.post('/addStudent', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let student_name = req.body.student_name;
  let major = req.body.major;
  let success = await addStudent(db, net_id, email, password, student_name, major);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addStudent', status);
  res.send(result);
})

app.post('/addAdviser', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let adviser_name = req.body.adviser_name;
  let department = req.body.department;
  let success = await addAdviser(db, net_id, email, password, adviser_name, department);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addAdviser', status);
  res.send(result);
})

app.post('/addSection', async (req, res) => {
  let db = getDBConnection()
  let section_id = req.body.section_id;
  let ta = req.body.ta;
  let co_ta = req.body.co_ta;
  let section_times = req.body.section_times;
  let class_id = req.body.class_id
  let success = await addSection(db, section_id, ta, co_ta, section_times, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addSection', status);
  res.send(result);
})

app.post('/updateClass', async (req, res) => {
  let db = getDBConnection()
  let class_id = req.body.class_id;
  let credits = req.body.credits;
  let rating = req.body.rating;
  let average_gpa = req.body.average_gpa;
  let professor = req.body.professor;
  let assistant_professor = req.body.assistant_professor;
  let class_times = req.body.class_times;
  let quarter = req.body.quarter;
  let class_name = req.body.class_name;
  let sln = req.body.sln;
  let add_code_required = req.body.add_code_required;
  let success = await updateClass(db, class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter, class_name, sln, add_code_required);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateClass', status);
  res.send(result);
})

app.post('/updateProfessor', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let professor_name = req.body.professor_name;
  let department = req.body.department;
  let tenure = req.body.tenure;
  let rating = req.body.rating;
  let success = await updateProfessor(db, net_id, email, password, professor_name, department, tenure, rating);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateProfessor', status);
  res.send(result);
})

app.post('/updateStudent', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let student_name = req.body.student_name;
  let major = req.body.major;
  let success = await updateStudent(db, net_id, email, password, student_name, major);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateStudent', status);
  res.send(result);
})

app.post('/updateAdviser', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let email = req.body.email;
  let password = req.body.password;
  let adviser_name = req.body.adviser_name;
  let department = req.body.department;
  let success = await updateAdviser(db, net_id, email, password, adviser_name, department);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateAdviser', status);
  res.send(result);
})

app.post('/updateSection', async (req, res) => {
  let db = getDBConnection()
  let section_id = req.body.section_id;
  let ta = req.body.ta;
  let co_ta = req.body.co_ta;
  let section_times = req.body.section_times;
  let class_id = req.body.class_id;
  let success = await updateSection(db, section_id, ta, co_ta, section_times, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateSection', status);
  res.send(result);
})

app.post('/removeClass', async (req, res) => {
  let db = getDBConnection()
  let class_id = req.body.class_id;
  let success = await removeClass(db, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeClass', status);
  res.send(result);
})

app.post('/removeProfessor', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeProfessor(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeProfessor', status);
  res.send(result);
})

app.post('/removeStudent', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeStudent(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeStudent', status);
  res.send(result);
})

app.post('/removeAdviser', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeAdviser(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeAdviser', status);
  res.send(result);
})

app.post('/removeSection', async (req, res) => {
  let db = getDBConnection()
  let section_id = req.body.section_id;
  let success = await removeSection(db, section_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeSection', status);
  res.send(result);
})

const logStream = fs.createWriteStream("login.log", { flags: "a" });

app.post("/log", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${email} logged in\n`;

  logStream.write(logEntry);

  res.status(SUCCESS).json({ message: "Login successful" });
})

app.post('/login', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let password = req.body.password;
  let status = await login(db, net_id, password);
  db.close();

  let result = setResDefaults('/login', status);
  if (status == 403) {
    result.message = "Could not log in: Invalid password"
  } else if (status == 404) {
    result.message = "Could not log in: Invalid net_id"
  }
  res.send(result);
})

app.post('/addRegistration', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;
  let success = await addRegistration(db, net_id, class_id)
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addRegistration', status);
  res.send(result);
})

app.post('/getStudentRegistration', async (req, res) =>{
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let registration = await getStudentRegistration(db, net_id);
  db.close();

  let status = registration ? SUCCESS : ERROR;
  let result = setResDefaults('/getStudentRegistration', status);
  result.registration = registration;
  res.send(result);
})

app.post('/getClassRegistration', async (req, res) =>{
  let db = getDBConnection();
  let class_id = req.body.class_id;
  let registration = await getClassRegistration(db, class_id);
  db.close();

  let status = registration ? SUCCESS : ERROR;
  let result = setResDefaults('/getClassRegistration', status);
  result.registration = registration;
  res.send(result);
})

app.post('/removeRegistration', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;
  let success = await removeRegistration(db, net_id, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeRegistration', status);
  res.send(result);
})

app.post('/addWaitlist', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;
  let success = await addWaitlist(db, net_id, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addWaitlist', status);
  res.send(result);
})

app.post('/removeStudentFromWaitlist', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let success = await removeStudentFromWaitlist(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeStudentFromWaitlist', status);
  res.send(result);
})

app.post('/removeClassFromWaitlist', async (req, res) => {
  let db = getDBConnection();
  let class_id = req.body.class_id;
  let success = await removeClassFromWaitlist(db, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeClassFromWaitlist', status);
  res.send(result);
})

app.post('/getAddCode', async (req, res) => {
  let db = getDBConnection();
  let class_name = req.body.class
  let addCodes = await getAddCodes(db, class_name);
  db.close();

  let status = addCodes ? SUCCESS : ERROR;
  let result = setResDefaults('/getAddCode', status);
  result.AddCodes = addCodes;
  res.send(result);
})

app.post('/addAddCode', async (req, res) => {
  let db = getDBConnection();
  let id = req.body.add_id;
  let add_code_status = req.body.add_code_status;
  let JobType = req.body.JobType;
  let add_code = req.body.add_code;
  let class_name = req.body.class;
  let net_id = req.body.net_id;
  let success = await addAddCode(db, id, add_code_status, JobType, add_code, class_name, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addAddCode', status);
  res.send(result);
})

app.post('/removeAddCode', async (req, res) => {
  let db = getDBConnection()
  let add_id = req.body.add_id;
  let success = await removeAddCode(db, add_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeAddCode', status);
  res.send(result);
})

// app.get('/updateAddCode', async (req, res) => {
//   let db = await getDBConnection()
//
//   let add_id = req.query.add_id;
//   let add_code_status = 1;
//
//   if(!add_id) {
//     return res.status(400).json({ message: 'Missing parameter add_id.', 'status': 400});
//   }
//
//   let updateClass = 'UPDATE addCode SET add_code_status = ? WHERE add_id = ?;';
//
//   db.run(updateClass, [add_code_status, add_id], function (err) {
//     if (err) {
//       console.error('Error updating AddCode:', err);
//       res.status(500).json({ message: 'Error updating AddCode', error: err, 'status': 500});
//     } else {
//       res.status(200).json({ message: 'AddCode updated successfully', 'status': 200});
//     }
//   });
//
//   db.close();
// })

app.post('/getMessages', async (req, res) => {
  let db = getDBConnection();
  let net_id_reciever = req.body.net_id_reciever;
  let net_id_sender = req.body.net_id_sender;
  let messages = await getMessages(db, net_id_reciever, net_id_sender);
  db.close();

  let status = messages ? SUCCESS : ERROR;
  let result = setResDefaults('/getMessages', status);
  result.Messages = messages;
  res.send(result);
})

app.post('/addMessages', async (req, res) => {
  let db = getDBConnection()
  let net_id_sender = req.body.net_id_sender;
  let JobType_sender = req.body.JobType_sender;
  let net_id_reciever = req.body.net_id_reciever;
  let JobType_reciever = req.body.JobType_reciever;
  let message = req.body.message;
  let success = await addMessage(db, net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addMessages', status);
  res.send(result);
})

app.post('/removeMessages', async (req, res) => {
  let db = getDBConnection()
  let sender = req.body.net_id_sender;
  let reciever = req.body.net_id_reciever;
  let success = await removeMessages(db, sender, reciever);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeMessages', status);
  res.send(result);
})

/* ######################################
*
*           UTILITY FUNCTIONS
*
*  ###################################### */

function dbGet(database, query, query_params) {
  return new Promise((resolve, reject) => {
    database.get(query, query_params, (err, result) => {
      if (err) {
        console.error('Error running database.get: ', err.message)
        reject(err);
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

function dbAll(database, query, query_params) {
  return new Promise((resolve, reject) => {
    database.all(query, query_params, (err, results) => {
      if (err) {
        console.error('Error running database.all: ', err.message);
        reject(err);
        throw err;
      } else {
        resolve(results);
      }
    });
  });
}

function dbRun(database, query, query_params) {
  return new Promise((resolve, reject) => {
    database.run(query, query_params, function (err) {
      if (err) {
        console.error('Error running database.run: ', err.message);
        reject(err);
        throw err;
      } else {
        resolve(true);
      }
    });
  })
}

function getClasses(db) {
  let query = "SELECT * FROM classes;";
  return dbAll(db, query, []);
}

function getProfessors(db) {
  let query = "SELECT * FROM professors;";
  return dbAll(db, query, []);
}

function getStudents(db) {
  let query = "SELECT * FROM students;";
  return dbAll(db, query, []);
}

function getAdvisers(db) {
  let query = "SELECT * FROM advisers;";
  return dbAll(db, query, []);
}

function getClass(db, class_id) {
  let query = "SELECT * FROM classes WHERE class_id = ?;";
  return dbGet(db, query, [class_id]);
}

function getProfessor(db, net_id) {
  let query = "SELECT * FROM professors WHERE net_id = ?;";
  return dbGet(db, query, [net_id]);
}

function getStudent(db, net_id) {
  let query = "SELECT * FROM students WHERE net_id = ?;";
  return dbGet(db, query, [net_id]);
}

function getAdviser(db, net_id) {
  let query = "SELECT * FROM advisers WHERE net_id = ?;";
  return dbGet(db, query, [net_id]);
}

function getSection(db, section_id) {
  let query = "SELECT * FROM sections WHERE section_id = ?;";
  return dbGet(db, query, [section_id]);
}

function getStudentRegistration(db, net_id) {
  let query = "SELECT class_id FROM registration WHERE net_id = ?;";
  return dbAll(db, query, [net_id]);
}

function getClassRegistration(db, class_id) {
  let query = "SELECT net_id FROM registration WHERE class_id = ?;";
  return dbAll(db, query, [class_id]);
}

function addPerson(db, net_id, email, password, role) {
  let query = "INSERT INTO people(net_id, email, hash_pass, salt, role) VALUES (?, ?, ?, ?, ?);";
  let salt = generateSalt();
  let hash_pass = hashStr(password + salt);
  return dbRun(db, query, [net_id, email, hash_pass, salt, role]);
}

function addClass(db, class_id, credits, rating, average_gpa, professor,
  assistant_professor, class_times, quarter, class_name, sln, add_code_required) {
    let query = "INSERT INTO classes(class_id, credits, rating, " +
      "average_gpa, professor, assistant_professor, class_times, " +
      "quarter, class_name, sln, add_code_required) VALUES " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      return dbRun(db, query, [class_id, credits, rating, average_gpa, professor,
        assistant_professor, class_times, quarter, class_name, sln, add_code_required]);
}

function addStudent(db, net_id, email, password, student_name, major) {
  addPerson(db, net_id, email, password, 'student');
  let query = "INSERT INTO students(net_id, student_name, major) VALUES (?, ?, ?);";
  return dbRun(db, query, [net_id, student_name, major]);
}

function addProfessor(db, net_id, email, password, professor_name, department, tenure, rating) {
  addPerson(db, net_id, email, password, 'professor');
  let query = "INSERT INTO professors(net_id, professor_name, department, tenure, rating) VALUES (?, ?, ?, ?, ?);";
  return dbRun(db, query, [net_id, professor_name, department, tenure, rating])
}

function addAdviser(db, net_id, email, password, adviser_name, department) {
  addPerson(db, net_id, email, password, 'adviser');
  let query = "INSERT INTO advisers(net_id, adviser_name, department) VALUES (?, ?, ?);";
  return dbRun(db, query, [net_id, adviser_name, department]);
}

function addSection(db, section_id, ta, co_ta, section_times, class_id) {
  let query = "INSERT INTO sections(section_id, ta, co_ta, section_times, class_id) VALUES (?, ?, ?, ?, ?);";
  return dbRun(db, query, [section_id, ta, co_ta, section_times, class_id]);
}

function updatePerson(db, net_id, email, password, role) {
  let salt = generateSalt();
  let hash_pass = hashStr(password + salt);
  let query = "UPDATE people SET email = ?, hash_pass = ?, salt = ?, role = ? WHERE net_id = ?;";
  return dbRun(db, query, [email, hash_pass, salt, role, net_id]);
}

async function updateClass(db, class_id, credits, rating, average_gpa, professor,
  assistant_professor, class_times, quarter, class_name, sln, add_code_required) {
  let query = "SELECT * FROM classes WHERE class_id=?;";
  let class_ = await dbGet(db, query, [class_id]);
  if (!class_) {
    return false;
  }

  let update_credits = credits ? credits : class_.credits;
  let update_rating = rating ? rating : class_.rating;
  let update_average_gpa = average_gpa ? average_gpa : class_.average_gpa;
  let update_professor = professor ? professor : class_.professor;
  let update_assistant_professor = assistant_professor ? assistant_professor : class_.assistant_professor;
  let update_class_times = class_times ? class_times : class_.class_times;
  let update_quarter = quarter ? quarter : class_.quarter;
  let update_class_name = class_name ? class_name : class_.class_name;
  let update_sln = sln ? sln : class_.sln;
  let update_add_code_required = add_code_required ? add_code_required : class_.add_code_required;
  query = "UPDATE classes SET credits = ?, rating = ?, average_gpa = ?, professor = ?, assistant_professor = ?, class_times = ?, quarter = ?, class_name = ?, sln = ?, add_code_required = ? WHERE class_id = ?;";
  return dbRun(db, query, [update_credits, update_rating, update_average_gpa, update_professor, update_assistant_professor, update_class_times, update_quarter, update_class_name, update_sln, update_add_code_required, class_id])
}

async function updateProfessor(db, net_id, email, password, professor_name, department, tenure, rating) {
  updatePerson(db, net_id, email, password, 'professor');
  let query = "SELECT * FROM professors WHERE net_id = ?;";
  let professor = await dbGet(db, query, [net_id]);
  if (!professor) {
    return false;
  }

  let update_professor_name = professor_name ? professor_name : professor.professor_name;
  let update_department = department ? department : professor.department;
  let update_tenure = tenure ? tenure : professor.tenure;
  let update_rating = rating ? rating : professor.rating;
  query = "UPDATE professors SET professor_name = ?, department = ?, tenure = ?, rating = ? WHERE net_id = ?;";
  return dbRun(db, query, [update_professor_name, update_department, update_tenure, update_rating, net_id]);
}

async function updateStudent(db, net_id, email, password, student_name, major) {
  updatePerson(db, net_id, email, password, 'student');
  let query = "SELECT * FROM students WHERE net_id = ?;";
  let student = await dbGet(db, query, [net_id]);
  if (!student) {
    return false;
  }

  let update_student_name = student_name ? student_name : student.student_name;
  let update_major = major ? major : student.major;
  query = "UPDATE students SET student_name = ?, major = ? WHERE net_id = ?;";
  return dbRun(db, query, [update_student_name, update_major, net_id]);
}

async function updateAdviser(db, net_id, email, password, adviser_name, department) {
  updatePerson(db, net_id, email, password, 'adviser');
  let query = "SELECT * FROM advisers WHERE net_id = ?;";
  let adviser = await dbGet(db, query, [net_id]);
  if (!adviser) {
    return false;
  }

  let update_adviser_name = adviser_name ? adviser_name : adviser.adviser_name;
  let update_department = department ? department : adviser.department;
  query = "UPDATE advisers SET adviser_name = ?, department = ? WHERE net_id = ?;";
  return dbRun(db, query, [update_adviser_name, update_department, net_id]);
}

async function updateSection(db, section_id, ta, co_ta, section_times, class_id) {
  let query = "SELECT * FROM sections WHERE section_id = ?;";
  let section = dbGet(db, query, [section_id]);
  if (!section) {
    return false;
  }

  let update_ta = ta ? ta : section.ta;
  let update_co_ta = co_ta ? co_ta : section.co_ta;
  let update_section_times = section_times ? section_times : section.section_times;
  let update_class_id = class_id ? class_id : section.class_id;
  query = "UPDATE sections SET ta = ?, co_ta = ?, section_times = ?, class_id = ? WHERE section_id = ?;";
  return dbRun(db, query, [update_ta, update_co_ta, update_section_times, update_class_id, section_id]);
}

function removePerson(db, net_id) {
  removeStudentFromWaitlist(db, net_id);
  removeStudentFromRegistration(db, net_id);
  let query = "DELETE FROM people WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
}

function removeClass(db, class_id) {
  let query = "DELETE FROM classes WHERE class_id = ?;";
  return dbRun(db, query, [class_id]);
}

function removeProfessor(db, net_id) {
  removePerson(db, net_id);
  let query = "DELETE FROM professors WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
}

function removeStudent(db, net_id) {
  removePerson(db, net_id);
  let query = "DELETE FROM students WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
}

function removeAdviser(db, net_id) {
  removePerson(db, net_id);
  let query = "DELETE FROM advisers WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
}

function removeSection(db, section_id) {
  let query = "DELETE FROM sections WHERE section_id = ?;";
  return dbRun(db, query, [section_id]);
}

async function login(db, net_id, password) {
  let query = "SELECT hash_pass, salt FROM people WHERE net_id = ?;";
  let person = await dbGet(db, query, [net_id]);
  if (!person) {
    return 404;
  }
  if (person.hash_pass != hashStr(password + person.salt)) {
    return 403;
  }

  console.log('Signed in with net_id ' + net_id)
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${net_id} logged in\n`;
  logStream.write(logEntry);
  return 200;
}

function getRegistration(db, net_id, class_id) {
  let query = "SELECT * FROM registration WHERE net_id = ? AND class_id = ?;";
  return dbGet(db, query, [net_id, class_id]);
}

function addRegistration(db, net_id, class_id) {
  let query = "INSERT INTO registration(net_id, class_id) VALUES (?, ?);";
  return dbRun(db, query, [net_id, class_id]);
}

async function removeRegistration(db, net_id, class_id) {
  let query = "DELETE FROM registration WHERE net_id = ? AND class_id = ?;";
  let success = await dbRun(db, query, [net_id, class_id]);
  if (!success) {
    return false;
  }

  return popWaitlist(db, [class_id]);
}

async function removeStudentFromRegistration(db, net_id) {
  let query = "SELECT class_id FROM registration WHERE net_id = ?;";
  let classes = await dbAll(db, query, [net_id]);

  query = "DELETE FROM registration WHERE net_id = ?;";
  let success = await dbRun(db, query, [net_id]);
  if (!success) {
    return false;
  }

  success = true;
  classes.forEach((class_id) => {
    success = success && popWaitlist(class_id);
  })
  return success;
}

function removeClassFromRegistration(db, class_id) {
  let query = "DELETE FROM registration WHERE class_id = ?;";
  return dbRun(db, query, [class_id]);
}

function getWaitlist(db, net_id, class_id) {
  let query = "SELECT * FROM waitlist WHERE net_id = ? AND class_id = ?;";
  return dbGet(db, query, [net_id, class_id]);
}

async function addWaitlist(db, net_id, class_id) {
  let query = "SELECT position FROM waitlist ORDER BY position DESC LIMIT 1;";
  let result = await dbGet(db, query, []);
  let position = result ? result.position + 1 : 0;
  query = "INSERT INTO waitlist(net_id, class_id, position) VALUES (?, ?, ?);";
  return dbRun(db, query, [net_id, class_id, position]);
}

function removeWaitlist(db, net_id, class_id) {
  let query = "DELETE FROM waitlist WHERE net_id = ? AND class_id = ?;";
  return dbRun(db, query, [net_id, class_id]);
}

function removeStudentFromWaitlist(db, net_id) {
  let query = "DELETE FROM waitlist WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
}

function removeClassFromWaitlist(db, class_id) {
  let query = "DELETE FROM waitlist WHERE net_id = ?;";
  return dbRun(db, query, [class_id]);
}

async function popWaitlist(db, class_id) {
  let query = "SELECT net_id FROM waitlist WHERE class_id = ? ORDER BY position ASC LIMIT 1;";
  let net_id = await dbGet(db, query, [class_id]);
  if (!net_id) {
    return false;
  }

  if (!addRegistration(db, net_id, class_id)) {
    return false;
  }
  return removeWaitlist(db, net_id, class_id);
}

function getAddCodes(db, class_name) {
  let query = "SELECT * FROM addCode WHERE class = ?;";
  return dbAll(db, query, [class_name]);
}

function addAddCode(db, add_id, add_code_status, JobType, add_code, class_name, net_id) {
  let query = "INSERT INTO addCode(add_id, add_code_status, JobType, add_code, class, net_id) VALUES (?, ?, ?, ?, ?, ?);";
  return dbRun(db, query, [add_id, add_code_status, JobType, add_code, class_name, net_id]);
}

function removeAddCode(db, add_id) {
  let query = "DELETE FROM addCode WHERE add_id = ?;";
  return dbRun(db, query, [add_id]);
}

function getMessages(db, net_id_reciever, net_id_sender) {
  let query = "SELECT * FROM messages WHERE net_id_reciever = ? AND net_id_sender = ?;"
  return dbAll(db, query, [net_id_reciever, net_id_sender]);
}

function addMessage(db, net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message) {
  let query = "INSERT INTO messages(net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message) VALUES (?, ?, ?, ?, ?);";
  return dbRun(db, query, [net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message]);
}

function removeMessages(db, sender, reciever) {
  let query = "DELETE FROM messages WHERE net_id_sender = ? AND net_id_reciever = ?;";
  return dbRun(db, query, [sender, reciever]);
}

// Constructs a basic object to be passed into res.send()
// Clients can append more headers/values to object before sending.
function setResDefaults(endpoint, status) {
  let message;
  if (Math.floor(status / 100) == ERROR / 100) {
    message = ' error.'
  } else if (Math.floor(status / 100) == FAILURE / 100) {
    message = ' failure.'
  } else if (Math.floor(status / 100) == SUCCESS / 100) {
    message = ' success.';
  } else {
    throw new Error("status should be in the 200s, 400s, or 500s");
  }
  return { message: endpoint + message, status: status };
}

// Hashing function for strings.
function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash * 31) + ((chr | 0) * 37); // bit-wise OR with 0 to convert to integer
  }
  return hash % MAX_HASH;
}

// Returns a random integer from 0 to MAX_SALT.
function generateSalt() {
  return Math.floor(Math.random() * MAX_SALT);
}

export default app

