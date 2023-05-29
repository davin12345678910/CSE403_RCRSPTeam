'use strict';

// These are the imports that we will require
import express, { query } from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import cors from 'cors';

/*
* GLOBAL VARIABLES
*/

// These are for passwords
const MAX_HASH = 10 ** 14;
const MAX_SALT = 10 ** 6;

// These are for network results
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
  let queryClasses = 'CREATE TABLE IF NOT EXISTS classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, quarter TEXT, class_name TEXT, sln INTEGER, add_code_required INTEGER, enrolled INTEGER, capacity INTEGER, startM INTEGER, endM INTEGER, startT INTEGER, endT INTEGER, startW INTEGER, endW INTEGER, startTH INTEGER, endTH INTEGER, startF INTEGER, endF INTEGER, startSAT INTEGER, endSAT INTEGER, startSUN INTEGER, endSUN INTEGER);';

  // 6. Sections
  let querySections = 'CREATE TABLE IF NOT EXISTS sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';

  // 7. Registered Classes
  let queryRegisterClass = 'CREATE TABLE IF NOT EXISTS registration(net_id TEXT REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), CONSTRAINT PK_Registration PRIMARY KEY (net_id,class_id));';

  // 8. Waitlist
  let queryWaitlist = 'CREATE TABLE IF NOT EXISTS waitlist(net_id TEXT PRIMARY KEY REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), position INTEGER);';

  // 9. Addcode
  let queryAddcode = 'CREATE TABLE IF NOT EXISTS addCode(add_id TEXT PRIMARY KEY, add_code_status TEXT, JobType TEXT, add_code INTEGER, class TEXT, net_id TEXT);';

  // 10. Messages
  let queryMessages = 'CREATE TABLE IF NOT EXISTS messages(net_id_sender TEXT, JobType_sender TEXT, net_id_receiver TEXT, JobType_receiver TEXT, message TEXT);';

  // TODO: Table for addCodes, version 2, which will be the class, add code, and a list of people who have the add codes

  // These will be runned in order to create the tables that we wrote above
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

async function addStartupClasses(db) {
  let hasDefaultClass = await getClass(db, '345');
  if (!hasDefaultClass) {
    await addClass(db, '345', null, null, null, 'x',
      null, null, null, null, null,
      0, 100, 1030, 1120, 1130, 1220, 1030, 1120, 1330, 1420,
      1030, 1120, null, null, null, null);
  }

  hasDefaultClass = await getClass(db, 'cse331');
  if (!hasDefaultClass) {
    await addClass(db, 'cse331', null, null, null, 'Perkins',
      null, null, null, null, null,
      0, 100, 1130, 1220, null, null, 1130, 1220, null, null,
      1130, 1220, null, null, null, null);
  }

  hasDefaultClass = await getClass(db, 'cse332');
  if (!hasDefaultClass) {
    await addClass(db, 'cse332', null, null, null, 'Anderson',
      null, null, null, null, null,
      100, 100, 830, 920, null, null, 830, 920, 930, 1020,
      830, 920, null, null, null, null);
  }

  hasDefaultClass = await getClass(db, 'cse344');
  if (!hasDefaultClass) {
    await addClass(db, 'cse344', null, null, null, 'Tang',
      null, null, null, null, null,
      99, 100, 1130, 1320, null, null, 1330, 1520, null, null,
      null, null, null, null, null, null);
  }

  hasDefaultClass = await getClass(db, 'cse333');
  if (!hasDefaultClass) {
    await addClass(db, 'cse333', null, null, null, 'Perkins',
      null, null, null, null, null,
      98, 100, 1030, 1120, 1130, 1220, 1030, 1120, 1330, 1420,
      1030, 1120, null, null, null, null);
  }

  hasDefaultClass = await getClass(db, 'cse403');
  if (!hasDefaultClass) {
    await addClass(db, 'cse403', null, null, null, 'Nigini',
      null, null, null, null, null,
      277, 280, 1230, 1320, 1330, 1420, 1230, 1320, 1330, 1420,
      1230, 1320, null, null, null, null);
  }
}

async function addStartupStudents(db) {
  let hasDefaultStudent = await getStudent(db, 'pokemon678');
  if (!hasDefaultStudent) {
    await addStudent(db, 'pokemon678', 'pokemon678@uw.edu', '123', 'pokemon', 'electrical engineering');
  }

  hasDefaultStudent = await getStudent(db, 'student0');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student0', 'student0@uw.edu', 'pass0', 'Ahmed', 'Computer Science');
  }

  hasDefaultStudent = await getStudent(db, 'student1');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student1', 'student1@uw.edu', 'pass1', 'Azaan', 'Computer Science');
  }

  hasDefaultStudent = await getStudent(db, 'student2');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student2', 'student2@uw.edu', 'pass2', 'Chairnet', 'Political Science');
  }

  hasDefaultStudent = await getStudent(db, 'student3');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student3', 'student3@uw.edu', 'pass3', 'Davin', 'Electrical Engineering');
  }

  hasDefaultStudent = await getStudent(db, 'student4');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student4', 'student4@uw.edu', 'pass4', 'Foad', 'Psychology');
  }

  hasDefaultStudent = await getStudent(db, 'student5');
  if (!hasDefaultStudent) {
    await addStudent(db, 'student5', 'student5@uw.edu', 'pass5', 'Sol', 'Physics');
  }
}

async function addStartupProfessors(db) {
  let hasDefaultProfessor = await getProfessor(db, '123');
  if (!hasDefaultProfessor) {
    await addProfessor(db, '123', '123@uw.edu', 'pass123', 'x', 'math', '0', '4');
  }
}

async function addStartupAdvisers(db) {
  let hasDefaultAdviser = await getAdviser(db, '456');
  if (!hasDefaultAdviser) {
    await addAdviser(db, '456', '456@uw.edu', 'pass456', 'x', 'math');
  }
}

async function addStartupSections(db) {
  let hasDefaultSection = await getSection(db, 'section0');
  if (!hasDefaultSection) {
    await addSection(db, 'section0', 'x', 'y', '11:30-12:20', 'section0');
  }
}

async function addStartupRegistration(db) {
  let hasDefaultRegistration = await getRegistration(db, 'pokemon678', '345');
  if (!hasDefaultRegistration) {
    await addRegistration(db, 'pokemon678', '345');
  }
}

async function addStartupWaitlist(db) {
  let waitlist = await getFullWaitlist(db);
  let hasDefaultWaitlist = false;
  waitlist.forEach((entry) => {
    if (entry.net_id == "pokemon678" && entry.class_id == "345") {
      hasDefaultWaitlist = true;
    }
  });

  if (!hasDefaultWaitlist) {
    await addWaitlist(db, "pokemon678", "345");
  }
}

async function addStartupAddCodes(db) {
  let hasDefaultAddcode = await getAddCodes(db, 'CSE 403');
  if (!hasDefaultAddcode[0]) {
    await addAddCode(db, '1', '0', 'Adviser', '123', 'CSE 403', 'pokemon678');
  }
}


// This is where we will be making some starting data which we will be using for
// tests as well as the website/demos
async function addStartupData(db) {
  await addStartupClasses(db);
  await addStartupStudents(db);
  await addStartupProfessors(db);
  await addStartupAdvisers(db);
  await addStartupSections(db);
  await addStartupRegistration(db);
  await addStartupWaitlist(db);
  await addStartupAddCodes(db);
}


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

// This is needed in order to be able to call the endpoints in which we make
app.use(express.json())

// This is the endpoint that we will later test to see if the status of the
// endpoints give a ok message
app.post('/users', async (req, res) => {
  let result = setResDefaults('/users', 200);
  res.send(result);
})

// This endpoint allows you to get all the classes
app.get('/getClasses', async (req, res) => {
  let db = getDBConnection();
  let classes = await getClasses(db);
  db.close();

  let status = classes ? SUCCESS : ERROR;
  let result = setResDefaults('/getClasses', status);
  result.class = classes;
  res.send(result);
})

// This endpoint allows you to get all professors
app.get('/getProfessors', async (req, res) => {
  let db = getDBConnection();
  let professors = await getProfessors(db);
  db.close()

  let status = professors ? SUCCESS : ERROR;
  let result = setResDefaults('/getProfessors', status);
  result.professors = professors;
  res.send(result);
})

// This endpoint allows you to get all students
app.get('/getStudents', async (req, res) => {
  let db = getDBConnection();
  let students = await getStudents(db);
  db.close();

  let status = students ? SUCCESS : ERROR;
  let result = setResDefaults('/getStudents', status);
  result.students = students;
  res.send(result);
})


// This endpoint allows you to get all advisers
app.get('/getAdvisers', async (req, res) => {
  let db = getDBConnection();
  let advisers = await getAdvisers(db);
  db.close();

  let status = advisers ? SUCCESS : ERROR;
  let result = setResDefaults('/getAdvisers', status);
  result.advisers = advisers;
  res.send(result);
})


// This endpoint allows you to get a class
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

// This endpoint allows you to get a professor
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

// This endpoint allows you to get a student
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

// This endpoint allows you to get a adviser
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

// This endpoint allows you to get a section
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

// This endpoint allows you to add a class
app.post('/addClass', async (req, res) => {
  let db = getDBConnection()

  // These are variables in which we need for a class
  let class_id = req.body.class_id;
  let credits = req.body.credits;
  let rating = req.body.rating;
  let average_gpa = req.body.average_gpa;
  let professor = req.body.professor;
  let assistant_professor = req.body.assistant_professor;
  let quarter = req.body.quarter;
  let class_name = req.body.class_name;
  let sln = req.body.sln;
  let add_code_required = req.body.add_code_required;
  let enrolled = req.body.enrolled;
  let capacity = req.body.capacity;

  // These variables are needed for a class and are also needed
  // in order to check for scheduleing conflicts
  let startM = req.body.startM;
  let endM = req.body.endM;
  let startT = req.body.startT;
  let endT = req.body.endT;
  let startW = req.body.startW;
  let endW = req.body.endW;
  let startTH = req.body.startTH;
  let endTH = req.body.endTH;
  let startF = req.body.startF;
  let endF = req.body.endF;
  let startSAT = req.body.startSAT;
  let endSAT = req.body.endSAT;
  let startSUN = req.body.startSUN;
  let endSUN = req.body.endSUN;
  let success = await addClass(db, class_id, credits, rating, average_gpa, professor,
    assistant_professor, quarter, class_name, sln, add_code_required, enrolled, capacity,
    startM, endM, startT, endT, startW, endW, startTH, endTH, startF, endF, startSAT, endSAT,
    startSUN, endSUN);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addClass', status);
  res.send(result);
})


app.post('/addClassesToRegistration', async (req, res) => {
  let db = getDBConnection();

  // These are the classes that we will be adding in
  let classes = req.body.classes;

  classes.forEach(async (currentClass) => {

    let net_id = currentClass.net_id;
    let class_id = currentClass.class_id

    // Here we will need to check to see if the course if not already in the database
    let hasConflict = hasClassConflict(db, net_id, class_id);

    if (!hasConflict) {
      let success = await addRegistration(db, net_id, class_id);

      let status = success ? SUCCESS : ERROR;

      // This is the case if there is an added class that fails
      if (status == ERROR) {
        db.close()
        let result = setResDefaults('/addClasses', status);
        res.send(result);
        return
      }
    }
  })

  db.close();

  // This is the case if all of the added classes pass
  let result = setResDefaults('/addClasses', SUCCESS);
  res.send({'status' : classes});
});



// This endpoint allows you to add a professor
app.post('/addProfessor', async (req, res) => {
  let db = getDBConnection()

  // These is the information that are needed for a professor
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


// This endpoint allows you to add a student
app.post('/addStudent', async (req, res) => {
  let db = getDBConnection()

  // These is the information that are needed for a student
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


// This endpoint allows you to add a adviser
app.post('/addAdviser', async (req, res) => {
  let db = getDBConnection()

  // These is the information that are needed for an adviser
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


// This endpoint allows you to add a section
app.post('/addSection', async (req, res) => {
  let db = getDBConnection()

  // These is the information that are needed for a section
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


// This endpoint update a class
app.post('/updateClass', async (req, res) => {
  let db = getDBConnection()

  // These are all the variables of a class, and all potential variables
  // that you could update
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
  let enrolled = req.body.enrolled;
  let capacity = req.body.capacity;
  let startM = req.body.startM;
  let endM = req.body.endM;
  let startT = req.body.startT;
  let endT = req.body.endT;
  let startW = req.body.startW;
  let endW = req.body.endW;
  let startTH = req.body.startTH;
  let endTH = req.body.endTH;
  let startF = req.body.startF;
  let endF = req.body.endF;
  let startSAT = req.body.startSAT;
  let endSAT = req.body.endSAT;
  let startSUN = req.body.startSUN;
  let endSUN = req.body.endSUN;
  let success = await updateClass(db, class_id, credits, rating, average_gpa, professor,
    assistant_professor, quarter, class_name, sln, add_code_required,
    enrolled, capacity, startM, endM, startT, endT, startW, endW, startTH, endTH,
    startF, endF, startSAT, endSAT, startSUN, endSUN);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/updateClass', status);
  res.send(result);
})

// This endpoint will allow you to update the information about a professor
app.post('/updateProfessor', async (req, res) => {
  let db = getDBConnection()

  // These are all of the potential variables that you could update for a professor
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


// This endpoint will allow you to update the information about a student
app.post('/updateStudent', async (req, res) => {
  let db = getDBConnection()

  // These are all of the potential variables that you could update for a student
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


// This endpoint will allow you to update the information of the adviser
app.post('/updateAdviser', async (req, res) => {
  let db = getDBConnection()

  // these are all of the potential variables that you could update for an adviser
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


// This endpoint will allow you to update the information of the section
app.post('/updateSection', async (req, res) => {
  let db = getDBConnection()

  // These are all of the potential variables that you could update for a section
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


// This endpoint will allow you to remove a class
app.post('/removeClass', async (req, res) => {
  let db = getDBConnection()
  let class_id = req.body.class_id;
  let success = await removeClass(db, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeClass', status);
  res.send(result);
})

// This endpoint will allow you to remove a professor
app.post('/removeProfessor', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeProfessor(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeProfessor', status);
  res.send(result);
})


// This endpoint will allow you to remove a student
app.post('/removeStudent', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeStudent(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeStudent', status);
  res.send(result);
})

// This endpoint will allow you to remove an adviser
app.post('/removeAdviser', async (req, res) => {
  let db = getDBConnection()
  let net_id = req.body.net_id;
  let success = await removeAdviser(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeAdviser', status);
  res.send(result);
})


// This endpoint will allow you to remove a section
app.post('/removeSection', async (req, res) => {
  let db = getDBConnection()
  let section_id = req.body.section_id;
  let success = await removeSection(db, section_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeSection', status);
  res.send(result);
})


/*****
 * These are the login endpoints
 */
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
  let addRegistrationResponse = await addRegistration(db, net_id, class_id)
  // db.close();

  if (addRegistrationResponse != "Class successfully added!") {
    res.send({'status' : ERROR, 'error' : addRegistrationResponse});
  } else {
    res.send({'status' : SUCCESS, 'error' : 'N/A'});
  }
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

app.post('/removeStudentFromRegistration', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let success = await removeStudentFromRegistration(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeStudentFromRegistration', status);
  res.send(result);
})

app.post('/removeClassFromRegistration', async (req, res) => {
  let db = getDBConnection();
  let class_id = req.body.class_id;
  let success = await removeClassFromRegistration(db, class_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeClassFromRegistration', status);
  res.send(result);
})

app.post('/getWaitlist', async (req, res) => {
  let db = getDBConnection();
  let class_id = req.body.class_id;
  let waitlist = await getWaitlist(db, class_id);
  db.close();

  let status = waitlist ? SUCCESS : ERROR;
  let result = setResDefaults('/getWaitlist', status);
  result.waitlist = waitlist;
  res.send(result);
})

app.post('/getFullWaitlist', async (req, res) => {
  let db = getDBConnection();
  let fullWaitlist = await getFullWaitlist(db);
  db.close();

  let status = fullWaitlist ? SUCCESS : ERROR;
  let result = setResDefaults('/getFullWaitlist', status);
  result.waitlist = fullWaitlist;
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

app.post('/removeWaitlist', async (req, res) => {
  let db = getDBConnection();
  let net_id = req.body.net_id;
  let success = await removeWaitlist(db, net_id);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/removeWaitlist', status);
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

app.post('/getMessages', async (req, res) => {
  let db = getDBConnection();
  let net_id_receiver = req.body.net_id_receiver;
  let net_id_sender = req.body.net_id_sender;
  let messages = await getMessages(db, net_id_receiver, net_id_sender);
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
  let net_id_receiver = req.body.net_id_receiver;
  let JobType_receiver = req.body.JobType_receiver;
  let message = req.body.message;
  let success = await addMessage(db, net_id_sender, JobType_sender, net_id_receiver, JobType_receiver, message);
  db.close();

  let status = success ? SUCCESS : ERROR;
  let result = setResDefaults('/addMessages', status);
  res.send(result);
})

app.post('/removeMessages', async (req, res) => {
  let db = getDBConnection()
  let sender = req.body.net_id_sender;
  let receiver = req.body.net_id_receiver;
  let success = await removeMessages(db, sender, receiver);
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


// This function will allow the users to get the database that we are
// going to use
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

// This will allow users to run database.all if needed
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

// This will allow users to run database.run() if needed
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


/******
 * Below are methods that each have queries which will be able to get the
 * information that they need for each of the endpoints
 */
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
  assistant_professor, quarter, class_name, sln, add_code_required,
  enrolled, capacity, startM, endM, startT, endT, startW, endW, startTH, endTH,
  startF, endF, startSAT, endSAT, startSUN, endSUN) {

  if ((startM   && !endM)   || (!startM   && endM)   ||
      (startT   && !endT)   || (!startT   && endT)   ||
      (startW   && !endW)   || (!startW   && endW)   ||
      (startTH  && !endTH)  || (!startTH  && endTH)  ||
      (startF   && !endF)   || (!startF   && endF)   ||
      (startSAT && !endSAT) || (!startSAT && endSAT) ||
      (startSUN && !endSUN) || (!startSUN && endSUN)) {
        return false;
  }

  let query = "INSERT INTO classes(class_id, credits, rating, average_gpa, professor, " +
    "assistant_professor, quarter, class_name, sln, add_code_required, " +
    "enrolled, capacity, startM, endM, startT, endT, startW, endW, startTH, endTH, " +
    "startF, endF, startSAT, endSAT, startSUN, endSUN) VALUES " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  return dbRun(db, query, [class_id, credits, rating, average_gpa, professor,
    assistant_professor, quarter, class_name, sln, add_code_required,
    enrolled, capacity, startM, endM, startT, endT, startW, endW, startTH, endTH,
    startF, endF, startSAT, endSAT, startSUN, endSUN]);
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
  assistant_professor, quarter, class_name, sln, add_code_required,
  enrolled, capacity, startM, endM, startT, endT, startW, endW, startTH, endTH,
  startF, endF, startSAT, endSAT, startSUN, endSUN) {
  let query = "SELECT * FROM classes WHERE class_id = ?;";
  let class_ = await dbGet(db, query, [class_id]);
  if (!class_) {
    return false;
  }

  let update_credits = credits ? credits : class_.credits;
  let update_rating = rating ? rating : class_.rating;
  let update_average_gpa = average_gpa ? average_gpa : class_.average_gpa;
  let update_professor = professor ? professor : class_.professor;
  let update_assistant_professor = assistant_professor ? assistant_professor : class_.assistant_professor;
  let update_quarter = quarter ? quarter : class_.quarter;
  let update_class_name = class_name ? class_name : class_.class_name;
  let update_sln = sln ? sln : class_.sln;
  let update_add_code_required = add_code_required ? add_code_required : class_.add_code_required;
  let update_enrolled = enrolled ? enrolled : class_.enrolled;
  let update_capacity = capacity ? capacity : class_.capacity;
  let update_startM = startM ? startM : class_.startM;
  let update_endM = endM ? endM : class_.endM;
  let update_startT = startT ? startT : class_.startT;
  let update_endT = endT ? endT : class_.endT;
  let update_startW = startW ? startW : class_.startW;
  let update_endW = endW ? endW : class_.endW;
  let update_startTH = startTH ? startTH : class_.startTH;
  let update_endTH = endTH ? endTH : class_.endTH;
  let update_startF = startF ? startF : class_.startF;
  let update_endF = endF ? endF : class_.endF;
  let update_startSAT = startSAT ? startSAT : class_.startSAT;
  let update_endSAT = endSAT ? endSAT : class_.endSAT;
  let update_startSUN = startSUN ? startSUN : class_.startSUN;
  let update_endSUN = endSUN ? endSUN : class_.endSUN;
  query = "UPDATE classes SET credits = ?, rating = ?, average_gpa = ?, professor = ?, assistant_professor = ?, quarter = ?, class_name = ?, sln = ?, add_code_required = ?, enrolled = ?, capacity = ?, startM = ?, endM = ?, startT = ?, endT = ?, startW = ?, endW = ?, startTH = ?, endTH = ?, startF = ?, endF = ?, startSAT = ?, endSAT =?, startSUN = ?, endSUN = ? WHERE class_id = ?;";
  return dbRun(db, query, [update_credits, update_rating, update_average_gpa, update_professor,
    update_assistant_professor, update_quarter, update_class_name, update_sln,
    update_add_code_required, update_enrolled, update_capacity, update_startM, update_endM,
    update_startT, update_endT, update_startW, update_endW, update_startTH, update_endTH,
    update_startF, update_endF, update_startSAT, update_endSAT, update_startSUN, update_endSUN, class_id])
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
  return SUCCESS;
}

function getRegistration(db, net_id, class_id) {
  let query = "SELECT * FROM registration WHERE net_id = ? AND class_id = ?;";
  return dbGet(db, query, [net_id, class_id]);
}

async function addRegistration(db, net_id, class_id) {
  let checkConflict = await hasClassConflict(db, net_id, class_id);

  if (checkConflict != "No conflict!") {
    return checkConflict;
  }

  if (await classIsFull(db, class_id)) {
    return "Class is full, cannot add class to schedule :(";
  }

  let query = "INSERT INTO registration(net_id, class_id) VALUES (?, ?);";
  if (!(await dbRun(db, query, [net_id, class_id]))) {
    return "Issue inserting into database!";
  }

  incrementClassEnrollment(db, class_id);

  return "Class successfully added!"
}

async function removeRegistration(db, net_id, class_id) {
  let query = "DELETE FROM registration WHERE net_id = ? AND class_id = ?;";
  let success = await dbRun(db, query, [net_id, class_id]);
  if (!success) {
    return false;
  }
  if (!(await decrementClassEnrollment(db, class_id))) {
    return false;
  }

  return popWaitlist(db, class_id);
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

function getWaitlist(db, class_id) {
  let query = "SELECT * FROM waitlist WHERE class_id = ?;";
  return dbGet(db, query, [class_id]);
}

function getFullWaitlist(db) {
  let query = "SELECT * FROM waitlist;";
  return dbAll(db, query, []);
}

async function addWaitlist(db, net_id, class_id) {
  let query = "SELECT position FROM waitlist ORDER BY position DESC LIMIT 1;";
  let result = await dbGet(db, query, []);
  let position = result ? result.position + 1 : 0;
  query = "INSERT INTO waitlist(net_id, class_id, position) VALUES (?, ?, ?);";
  return dbRun(db, query, [net_id, class_id, position]);
}

function removeWaitlist(db, net_id) {
  let query = "DELETE FROM waitlist WHERE net_id = ?;";
  return dbRun(db, query, [net_id]);
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
  let student = await dbGet(db, query, [class_id]);
  if (!student) {
    return true;
  }

  if (!(await addRegistration(db, student.net_id, class_id))) {
    return false;
  }
  return removeWaitlist(db, student.net_id);
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

function getMessages(db, net_id_receiver, net_id_sender) {
  let query = "SELECT * FROM messages WHERE net_id_receiver = ? AND net_id_sender = ?;"
  return dbAll(db, query, [net_id_receiver, net_id_sender]);
}

function addMessage(db, net_id_sender, JobType_sender, net_id_receiver, JobType_receiver, message) {
  let query = "INSERT INTO messages(net_id_sender, JobType_sender, net_id_receiver, JobType_receiver, message) VALUES (?, ?, ?, ?, ?);";
  return dbRun(db, query, [net_id_sender, JobType_sender, net_id_receiver, JobType_receiver, message]);
}

function removeMessages(db, sender, receiver) {
  let query = "DELETE FROM messages WHERE net_id_sender = ? AND net_id_receiver = ?;";
  return dbRun(db, query, [sender, receiver]);
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

// Returns true iff class1 and class2 have a scheduling conflict.
function classesConflict(class1, class2) {
  if (class1.startM != null && class2.startM != null) {
    if ((class1.startM <= class2.startM && class2.startM <= class1.endM) ||
        (class1.startM <= class2.endM && class2.endM <= class1.endM)) {
          return true;
    }
  }

  if (class1.startT != null && class2.startT != null) {
    if ((class1.startT <= class2.startT && class2.startT <= class1.endT) ||
        (class1.startT <= class2.endT && class2.endT <= class1.endT)) {
          return true;
    }
  }

  if (class1.startW != null && class2.startW != null) {
    if ((class1.startW <= class2.startW && class2.startW <= class1.endW) ||
        (class1.startW <= class2.endW && class2.endW <= class1.endW)) {
          return true;
    }
  }

  if (class1.startTH != null && class2.startTH != null) {
    if ((class1.startTH <= class2.startTH && class2.startTH <= class1.endTH) ||
        (class1.startTH <= class2.endTH && class2.endTH <= class1.endTH)) {
          return true;
    }
  }

  if (class1.startF != null && class2.startF != null) {
    if ((class1.startF <= class2.startF && class2.startF <= class1.endF) ||
        (class1.startF <= class2.endF && class2.endF <= class1.endF)) {
          return true;
    }
  }

  if (class1.startSAT != null && class2.startSAT != null) {
    if ((class1.startSAT <= class2.startSAT && class2.startSAT <= class1.endSAT) ||
        (class1.startSAT <= class2.endSAT && class2.endSAT <= class1.endSAT)) {
          return true;
    }
  }

  if (class1.startSUN != null && class2.startSUN != null) {
    if ((class1.startSUN <= class2.startSUN && class2.startSUN <= class1.endSUN) ||
        (class1.startSUN <= class2.endSUN && class2.endSUN <= class1.endSUN)) {
          return true;
    }
  }

  return false;
}

async function classIsFull(db, class_id) {
  let query = "SELECT * FROM classes WHERE class_id = ?;";
  let class_ = await dbGet(db, query, [class_id]);
  if (!class_) {
    return true;
  }

  return class_.enrolled == class_.capacity;
}

async function incrementClassEnrollment(db, class_id) {
  let query = "SELECT * FROM classes WHERE class_id = ?;";
  let class_ = await dbGet(db, query, [class_id]);
  if (!class_) {
    return false;
  }

  let enrolled = class_.enrolled;
  query = "UPDATE classes SET enrolled = ? WHERE class_id = ?;";
  return dbRun(db, query, [enrolled + 1, class_id]);
}

async function decrementClassEnrollment(db, class_id) {
  let query = "SELECT * FROM classes WHERE class_id = ?;";
  let class_ = await dbGet(db, query, [class_id]);
  if (!class_) {
    return false;
  }

  let enrolled = class_.enrolled;
  query = "UPDATE classes SET enrolled = ? WHERE class_id = ?;";
  return dbRun(db, query, [enrolled - 1, class_id]);
}

async function hasClassConflict(db, net_id, class_id) {
  var class_to_check = await getClass(db, class_id);
  if (!class_to_check) {
    return "Class already added!"
  }

  let query = "SELECT class_id FROM registration WHERE net_id = ?;";
  let classes = await dbAll(db, query, [net_id]);
  let hasClassConflict = false;

  for (let c of classes) {
    let id = c.class_id;
    let class_ = await getClass(db, id);
    if (classesConflict(class_to_check, class_)) {
      return "Conflict between " + class_to_check.class_id + " and " + class_.class_id;
    }
  }

  return "No conflict!";
}

export default app

