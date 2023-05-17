'use strict';

// These are the imports that we will require
import express from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import cors from 'cors';


// we need these
const verboseSqlite = sqlite3.verbose();
const app = express();
app.use(cors());

// Hashing function for passwords
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash * 31) + ((chr | 0) * 37); // bit-wise OR with 0 to convert to integer
  }
  return hash % (10 ** 14);
}

// This is how we will get the database that is within our system
function getDBConnection() {

  const db = new verboseSqlite.Database("./src/registration.db", verboseSqlite.OPEN_READWRITE, (err) => {
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
  // 1. People
  let queryPeople = "CREATE TABLE people(net_id TEXT PRIMARY KEY, email TEXT, hash_pass TEXT, salt TEXT, role TEXT)"

  // 2. Students
  let queryStudents = 'CREATE TABLE students(net_id TEXT PRIMARY KEY REFERENCES people(net_id), student_name TEXT, major TEXT);';

  // 3. Professor
  let queryProfessors = 'CREATE TABLE professors(net_id TEXT PRIMARY KEY REFERENCES people(net_id), professor_name TEXT, department TEXT, tenure INTEGER, rating INT);';

  // 4. Advisers
  let queryAdvisers = 'CREATE TABLE advisers(net_id TEXT PRIMARY KEY REFERENCES people(net_id), adviser_name TEXT, department TEXT);';

  // 5. Classes
  let queryClasses = 'CREATE TABLE classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT, quarter TEXT, class_name TEXT, sln INTEGER);';

  // 6. Sections
  let querySections = 'CREATE TABLE sections(section_id TEXT PRIMARY KEY, ta TEXT, co_ta TEXT, section_times TEXT, class_id TEXT REFERENCES classes(class_id));';

  // 7. Registered Classes
  let queryRegisterClass = 'CREATE TABLE registration(net_id TEXT REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), CONSTRAINT PK_Registration PRIMARY KEY (net_id,class_id));';

  // 8. Waitlist
  let queryWaitlist = 'CREATE TABLE waitlist(net_id TEXT REFERENCES people(net_id), class_id TEXT REFERENCES classes(class_id), position INTEGER);';
  // TODO: Table for addCodes, version 2, which will be the class, add code, and a list of people who have the add codes

  database.run(queryPeople);
  database.run(queryStudents);
  database.run(queryProfessors);
  database.run(queryAdvisers);
  database.run(queryClasses);
  database.run(querySections);
  database.run(queryRegisterClass);
  database.run(queryWaitlist);

  database.close();
}



async function makeAddCodeTables() {
  var database = await getDBConnection();

  // let addCodeTable = 'CREATE TABLE addCode(add_id TEXT PRIMARY KEY, net_id TEXT, JobType TEXT, add_code INTEGER, class TEXT);';
  // let addCodeMessageTable = 'CREATE TABLE messages(net_id_sender TEXT, JobType_sender TEXT, net_id_reciever TEXT, JobType_reciever TEXT, message TEXT);';

  // database.run(addCodeTable);
  // database.run(addCodeMessageTable);

  //let removeMessages = 'DROP TABLE addCode;';
  //database.run(removeMessages);
  // let dropClass = 'DROP TABLE classes;';
  // database.run(dropClass);

  // let queryClasses = 'CREATE TABLE classes(class_id TEXT PRIMARY KEY, credits INTEGER, rating NUMBER, average_gpa NUMBER, professor TEXT, assistant_professor TEXT, class_times TEXT, quarter TEXT, class_name TEXT, sln INTEGER, add_code_required INTEGER);';
  // database.run(queryClasses);
  database.close();
}

makeAddCodeTables();




async function addStartupData() {
  // Add default class
  let db = await getDBConnection();
  let addClass = 'INSERT INTO classes(class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter, class_name, sln) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  db.run(addClass, ['345', null, null, null, 'x', null, null, null, null, null], function (err) {
    if (err) {
      console.error('Error inserting class: ', err);
    }
  });
  db.close();

  // Add default student
  addPerson('pokemon678', 'pokemon678@uw.edu', '123', 'student');
  db = await getDBConnection();
  let addStudent = 'INSERT INTO students(net_id, student_name, major) VALUES (?, ?, ?);';
  db.run(addStudent, ['pokemon678', 'azaan', 'electrical engineering'], function (err) {
    if (err) {
      console.error('Error inserting student: ', err);
    }
  });
  db.close();

  // Add default professor
  addPerson('123', '123@uw.edu', 'pass123', 'professor');
  db = await getDBConnection();
  let addProfessor = "INSERT INTO professors(net_id, professor_name, department, tenure, rating) VALUES (?, ?, ?, ?, ?);";
  db.run(addProfessor, ['123', 'x', 'math', '0', '4'], function (err) {
    if (err) {
      console.error('Error inserting professor: ', err);
    }
  })
  db.close()

  // Add default advisor
  addPerson('456', '456@uw.edu', 'pass456', 'adviser');
  db = await getDBConnection();
  let addAdvisor = "INSERT INTO advisers(net_id, adviser_name, department) VALUES (?, ?, ?);";
  db.run(addAdvisor, ['456', 'x', 'math'], function (err) {
    if (err) {
      console.error('Error inserting advisor: ', err);
    }
  })
  db.close();

  // Add default section
  db = await getDBConnection();
  let addSection = 'INSERT INTO sections(section_id, ta, co_ta, section_times, class_id) VALUES (?, ?, ?, ?, ?);';
  db.run(addSection, ['331', 'x', 'y', '11:30-12:20', '345'], function (err) {
    if (err) {
      console.error('Error inserting section: ', err);
    }
  })
  db.close();

  // Add default classRegistartion
  db = await getDBConnection();
  let addregistration = 'INSERT INTO registration(net_id, class_id) VALUES (?, ?);';
  db.run(addregistration, ['123', '345'], function(err){
    if (err) {
      console.error('Error inserting to registration: ', err);
    }
  })
  db.close();

  // Add default waitlist
  db = await getDBConnection();
  let addWaitlist = 'INSERT INTO waitlist(net_id, class_id, position) VALUES (?, ?, ?);';
  db.run(addWaitlist, ['pokemon678', '345', 0], function (err) {
    if (err) {
      console.error('Error inserting waitlist: ', err);
    }
  })
  db.close();
}

/* Must uncomment and run one at a time. */
 //makeTables();
 //addStartupData();

app.use(express.json())


/**********************************
 *
 * Add code endpoints
 *
 **********************************/
app.post('/getAddCode', async (req, res) => {
  var database = await getDBConnection();

  var class_name = req.body.class

  let qry2 = "SELECT* FROM addCode WHERE class = ?;";

  try {
    database.all(qry2, [class_name], (err,rows) => {
      if(err) return console.error(err.message);
      var addCodes = []
      rows.forEach((row) => {
        addCodes.push(row)
      });
      //console.log(classes)
      res.send({"AddCodes" : addCodes, 'status': 500})
    })

  } catch (error) {
    res.send({"AddCodes": "error", 'status': 201})
  }
  database.close()
})


app.post('/addAddCode', async (req, res) => {
  let db = await getDBConnection();

  if (req.body == undefined) {
    res.json({"message": "undefined req.body"});
  }
  let id = req.body.add_id;
  let net_id = req.body.net_id;
  let JobType = req.body.JobType;
  let add_code = req.body.add_code;
  let class_name = req.body.class;

  let addClass = 'INSERT INTO addCode(add_id, net_id, JobType, add_code, class) VALUES (?, ?, ?, ?, ?);';
  db.run(addClass, [id, net_id, JobType, add_code, class_name], function (err) {
    if (err) {
      console.error('Error inserting class:', err);
      res.status(500).json({ message: 'Error inserting AddCode', error: err, 'status': 500});
    } else {
      res.status(201).json({ message: 'AddCode added successfully', 'status': 201});
    }
  });
  db.close();
})





app.post('/removeAddCode', async (req, res) => {
  let db = await getDBConnection()
  let add_id = req.body.add_id;

  let removeClass = 'DELETE FROM addCode WHERE add_id = ?;';

  db.run(removeClass, [add_id], function (err) {
    if (err) {
      console.error('Error removing class:', err);
      res.status(500).json({ message: 'Error removing addCode ', error: err, 'status': 500});
    } else {
      res.status(201).json({ message: 'AddCode removed successfully', 'status': 201});
    }
  });
  db.close();
})




/**********************************
 *
 * Message endpoints
 *
 **********************************/
app.post('/getMessages', async (req, res) => {
  var database = await getDBConnection();

  var net_id_reciever = req.body.net_id_reciever;
  var net_id_sender = req.body.net_id_sender;

  let qry2 = "SELECT* FROM messages WHERE net_id_reciever = ? AND net_id_sender = ?;";

  try {
    database.all(qry2, [net_id_reciever, net_id_sender], (err,rows) => {
      if(err) return console.error(err.message);
      var messages = []
      rows.forEach((row) => {
        messages.push(row)
      });
      //console.log(classes)
      res.send({"Messages" : messages, 'status': 500})
    })

  } catch (error) {
    res.send({"Messages": "error", 'status': 201})
  }
  database.close()
})


app.post('/addMessages', async (req, res) => {
  let db = await getDBConnection()
  let net_id_sender = req.body.net_id_sender;
  let JobType_sender = req.body.JobType_sender;
  let net_id_reciever = req.body.net_id_reciever;
  let JobType_reciever = req.body.JobType_reciever;
  let message = req.body.message;

  let addMessage = 'INSERT INTO messages(net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message) VALUES (?, ?, ?, ?, ?);';
  db.run(addMessage, [net_id_sender, JobType_sender, net_id_reciever, JobType_reciever, message], function (err) {
    if (err) {
      console.error('Error inserting messages:', err);
      res.status(500).json({ message: 'Error inserting messages', error: err, 'status': 500});
    } else {
      res.status(201).json({ message: 'Message added successfully', 'status': 201});
    }
  });
  db.close();
})



app.post('/removeMessages', async (req, res) => {
  let db = await getDBConnection()
  let sender = req.body.net_id_sender;
  let reciever = req.body.net_id_reciever;

  let removeMessages = 'DELETE FROM messages WHERE net_id_sender = ? AND net_id_reciever = ?;';

  db.run(removeMessages, [sender, reciever], function (err) {
    if (err) {
      console.error('Error removing messages:', err);
      res.status(500).json({ message: 'Error removing messages', error: err, 'status': 500});
    } else {
      res.status(201).json({ message: 'Messages removed successfully', 'status': 201});
    }
  });
  db.close();
})




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


app.get('/getProfessors', async (req, res) => {
  var database = await getDBConnection();

  let qry2 = "SELECT* FROM professors;";

  try {
    database.all(qry2, [], (err,rows) => {
      if(err) return console.error(err.message);
      var professors = []
      rows.forEach((row) => {
        professors.push(row)
      });
      //console.log(professors)
      res.send({"professor" : professors})
    })

  } catch (error) {
    res.send({"professor": "error"})
  }
  database.close()
})

app.get('/getStudents', async (req, res) => {
  var database = await getDBConnection();

  let qry2 = "SELECT* FROM students;";

  try {
    database.all(qry2, [], (err,rows) => {
      if(err) return console.error(err.message);
      var classes = []
      rows.forEach((row) => {
        classes.push(row)
      });
      //console.log(classes)
      res.send({"students" : classes})
    })

  } catch (error) {
    res.send({"students": "error"})
  }
  database.close()
})

app.get('/getAdvisers', async (req, res) => {
  var database = await getDBConnection();

  let qry2 = "SELECT* FROM advisers;";

  try {
    database.all(qry2, [], (err,rows) => {
      if(err) return console.error(err.message);
      var classes = []
      rows.forEach((row) => {
        classes.push(row)
      });
      //console.log(classes)
      res.send({"advisers" : classes})
    })

  } catch (error) {
    res.send({"advisers": "error"})
  }
  database.close()
})


app.post('/getClass', async (req,res) => {
  let db = await getDBConnection();
  let qry = 'SELECT* FROM classes WHERE class_id=?;';
  db.get(qry, [req.body.class_id], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.send({'class' : row});
    }
  })
})


app.post('/getProfessor', async (req,res) => {
  let db = await getDBConnection();
  let qry = 'SELECT* FROM professors WHERE net_id=?;';
  db.get(qry, [req.body.net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.send({'Professor' : 'error'});
    } else {
      res.send({'Professor' : row});
    }
  })
})

app.post('/getStudent', async (req,res) => {
  let db = await getDBConnection();
  let qry = 'SELECT * FROM students WHERE net_id=?;';
  db.get(qry, [req.body.net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.send({'Student' : 'error'});
    } else {
      res.send({'Student' : row});
    }
  })
})


app.post('/getAdviser', async (req,res) => {
  let db = await getDBConnection();
  let qry = 'SELECT* FROM advisers WHERE net_id=?;';
  db.get(qry, [req.body.net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.send({'Adviser' : 'error'});
    } else {
      res.send({'Adviser' : row});
    }
  })
})

app.post('/getSection', async (req,res) => {
  let db = await getDBConnection();
  let qry = 'SELECT* FROM sections WHERE section_id=?;';
  db.get(qry, [req.body.section_id], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.send({'Section' : row});
    }
  })
})

async function addPerson(net_id, email, password, role) {
  let db = await getDBConnection()

  let salt = Math.floor(Math.random() * 999999);
  let hash_pass = hashCode(password + salt);

  let addPerson = 'INSERT INTO people(net_id, email, hash_pass, salt, role) VALUES (?, ?, ?, ?, ?);';
  db.run(addPerson, [net_id, email, hash_pass, salt, role], function (err) {
    if (err) {
      console.error('Error adding person:', err);
    }
  })
  db.close();
}


//addPerson('567', '123@uw.edu', 'pass123', 'student');

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
  let class_name = req.body.class_name;
  let sln = req.body.sln;
  let add_code_required = req.body.add_code_required;

  let addClass = 'INSERT INTO classes(class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter, class_name, sln, add_code_required) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  db.run(addClass, [class_id, credits, rating, average_gpa, professor, assistant_professor, class_times, quarter, class_name, sln, add_code_required], function (err) {
    if (err) {
      console.error('Error inserting class:', err);
      res.status(500).json({ message: 'Error inserting class', error: err });
    } else {
      res.status(201).json({ message: 'Class added successfully', class_id: class_id });
    }
  });
  db.close();
})

app.post('/addProfessor', async (req, res) => {
  let net_id = req.body.net_id;
  let professor_name = req.body.professor_name;
  let department = req.body.department;
  let tenure = req.body.tenure;
  let email = req.body.email;
  let password = req.body.password;
  let rating = req.body.rating;
  addPerson(net_id, email, password);
  let db = await getDBConnection()

  let addProfessor = 'INSERT INTO professors(net_id, professor_name, department, tenure, rating) VALUES (?, ?, ?, ?, ?);';
  db.run(addProfessor, [net_id, professor_name, department, tenure, rating], function (err) {
    if (err) {
      console.error('Error inserting Professor:', err);
      res.status(500).json({ message: 'Error inserting Professor', error: err });
    } else {
      res.status(201).json({ message: 'Professor added successfully'});
    }
  });
  db.close();
})


app.post('/addStudent', async (req, res) => {
  let net_id = req.body.net_id;
  let student_name = req.body.student_name;
  let major = req.body.major;
  let email = req.body.email;
  let password = req.body.password;
  addPerson(net_id, email, password);
  let db = await getDBConnection()

  let addStudent = 'INSERT INTO students(net_id, student_name, major) VALUES (?, ?, ?);';
  db.run(addStudent, [net_id, student_name, major], function (err) {
    if (err) {
      console.error('Error inserting student:', err);
      res.status(500).json({ message: 'Error inserting student', error: err });
    } else {
      res.status(201).json({ message: 'Student added successfully', net_id: student_name });
    }
  });
  db.close();
})


app.post('/addAdviser', async (req, res) => {
  let net_id = req.body.net_id;
  let adviser_name = req.body.adviser_name;
  let department = req.body.department;
  let email = req.body.email;
  let password = req.body.password;
  addPerson(net_id, email, password);
  let db = await getDBConnection()

  let addAdviser = 'INSERT INTO advisers(net_id, adviser_name, department) VALUES (?, ?, ?);';
  db.run(addAdviser, [net_id, adviser_name, department], function (err) {
    if (err) {
      console.error('Error inserting Adviser:', err);
      res.status(500).json({ message: 'Error inserting Adviser', error: err });
    } else {
      res.status(201).json({ message: 'Adviser added successfully', net_id: adviser_name });
    }
  });
  db.close();
})

app.post('/addSection', async (req, res) => {
  let db = await getDBConnection()
  let section_id = req.body.section_id;
  let ta = req.body.ta;
  let co_ta = req.body.co_ta;
  let section_times = req.body.section_times;
  let class_id = req.body.class_id

  let addSection = 'INSERT INTO sections(section_id, ta, co_ta, section_times, class_id) VALUES (?, ?, ?, ?, ?);';
  db.run(addSection, [section_id, ta, co_ta, section_times, class_id ], function (err) {
    if (err) {
      console.error('Error inserting Section:', err);
      res.status(500).json({ message: 'Error inserting Section', error: err });
    } else {
      res.status(201).json({ message: 'Section added successfully', section_id: ta });
    }
  });
  db.close();
})

async function updatePerson(net_id, new_email, new_password, new_role) {
  let db = await getDBConnection()

  let query = 'SELECT * FROM people WHERE net_id = ?'
  db.get(query, [net_id], (err, res) => {
    if (err) {
      console.log(err)
      res.json({ 'people' : 'error'})
    } else {
      let new_salt = Math.floor(Math.random() * 999999);
      let new_hash_pass = hashCode(new_password + new_salt);

      let updatePerson = 'UPDATE people SET net_id = ?, email = ?, hash_pass = ?, salt = ?, role = ? WHERE net_id = ?';
      db.run(updatePerson, [net_id, new_email, new_hash_pass, new_salt, new_role, net_id], function (err) {
        if (err) {
          console.error('Error inserting person')
        }
      })
    }
  })
  db.close();
}


// This is the update endpoint for classes
app.post('/updateClass', async (req, res) => {
  let db = await getDBConnection()
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

  let qry = 'SELECT* FROM classes WHERE class_id=?;';

  db.get(qry, [req.body.class_id], (err, row) => {
    if (err) {
      console.log(err)
      res.json({'class' : 'error'})
    } else {
      var update_class_id = row.class_id;
      var update_credits = row.credits;
      var update_rating = row.rating;
      let update_average_gpa = row.average_gpa;
      let update_professor = row.professor;
      let update_assistant_professor = row.assistant_professor;
      let update_class_times = row.class_times;
      let update_quarter = row.quarter;
      let update_class_name = row.class_name;
      let update_sln = row.sln;
      let update_add_code_required = row.add_code_required;


      // update
      if (class_id != undefined) {
        update_class_id = class_id
      }

      if (credits != undefined) {
        update_credits = credits
      }

      if (rating != undefined) {
        update_rating = rating
      }

      if (average_gpa != undefined) {
        update_average_gpa = average_gpa
      }

      if (professor != undefined) {
        update_professor = professor
      }

      if (assistant_professor != undefined) {
        update_assistant_professor = assistant_professor
      }

      if (class_times != undefined) {
        update_class_times = class_times
      }

      if (quarter != undefined) {
        update_quarter = quarter
      }

      if (class_name != undefined) {
        update_class_name = class_name
      }

      if (quarter != undefined) {
        update_quarter = quarter
      }

      if (add_code_required != undefined) {
        update_add_code_required = add_code_required
      }

      // now we will update
      let updateClass = 'UPDATE classes SET class_id=?, credits=?, rating=?, average_gpa=?, professor=?, assistant_professor=?, class_times=?, quarter=?, class_name = ?, sln = ?, add_code_required = ? WHERE class_id=?;';
      db.run(updateClass, [update_class_id, update_credits, update_rating, update_average_gpa, update_professor, update_assistant_professor, update_class_times, update_quarter, update_class_name, update_sln, update_add_code_required, class_id], function (err) {
        if (err) {
          console.error('Error inserting class:', err);
          res.status(500).json({'class': err });
        } else {
          res.status(201).json({'class' : [update_class_id, update_credits, update_rating, update_average_gpa, update_professor, update_assistant_professor, update_class_times, update_quarter, update_class_name, update_sln, add_code_required]});
        }
      });
    }
  })
})

// This is the update endpoint for professor
app.post('/updateProfessor', async (req, res) => {
  let net_id = req.body.net_id;
  let professor_name = req.body.professor_name;
  let department = req.body.department;
  let tenure = req.body.tenure;
  let rating = req.body.rating;
  let email = req.body.email;
  let password = req.body.password;
  updatePerson(net_id, email, password, 'professor');
  let db = await getDBConnection()

  let qry = 'SELECT* FROM professors WHERE net_id = ?;';

  db.get(qry, [net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.json({'Professor' : 'error'})
    } else {
      var update_professor_name = row.professor_name;
      var update_department = row.department;
      let update_tenure = row.tenure;
      let update_rating = row.rating;


      // update
      if (professor_name != undefined) {
        update_professor_name = professor_name
      }

      if (department != undefined) {
        update_department = department
      }

      if (tenure != undefined) {
        update_tenure = tenure
      }

      if (rating != undefined) {
        update_rating = rating
      }

      // now we will update
      let updateProf = 'UPDATE professors SET net_id=?, professor_name=?, department=?, tenure=?, rating=? WHERE net_id=?;';
      db.run(updateProf, [net_id, update_professor_name, update_department, update_tenure, update_rating, net_id], function (err) {
        if (err) {
          console.error('Error inserting professor:', err);
          res.status(500).json({'Professor': err });
        } else {
          res.status(201).json({'Professor' : [net_id, update_professor_name, update_department, update_tenure, update_rating]});
        }
      });
    }
  })
})



// This is the update endpoint for classes
app.post('/updateStudent', async (req, res) => {
  let net_id = req.body.net_id;
  let student_name = req.body.student_name;
  let major = req.body.major;
  let email = req.body.email;
  let password = req.body.password;
  updatePerson(net_id, email, password, 'student');
  let db = await getDBConnection()

  let qry = 'SELECT* FROM students WHERE net_id=?;';

  db.get(qry, [net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.json({'Student' : 'error'})
    } else {

      let update_net_id = row.net_id;
      let update_student_name = row.student_name;
      let update_major = row.major;


      // update
      if (student_name != undefined) {
        update_student_name = student_name
      }

      if (major != undefined) {
        update_major = major
      }

      // now we will update
      let updateStudent = 'UPDATE students SET net_id=?, student_name=?, major=? WHERE net_id=?;';
      db.run(updateStudent, [net_id, update_student_name, update_major, net_id], function (err) {
        if (err) {
          console.error('Error updating Student:', err);
          res.status(500).json({'Student': err });
        } else {
          res.status(201).json({'Student' : [net_id, update_major, update_net_id]});
        }
      });

    }
  })
})


app.post('/updateAdviser', async (req, res) => {
  let net_id = req.body.net_id;
  let adviser_name = req.body.adviser_name;
  let department = req.body.department;
  let email = req.body.email;
  let password = req.body.password;
  updatePerson(net_id, email, password, 'adviser');
  let db = await getDBConnection()

  let qry = 'SELECT* FROM advisers WHERE net_id = ?;';

  db.get(qry, [net_id], (err, row) => {
    if (err) {
      console.log(err)
      res.json({'Adviser' : 'error'})
    } else {
      var update_adviser_name = row.adviser_name;
      var update_department = row.department;


      // update
      if (adviser_name != undefined) {
        update_adviser_name = adviser_name
      }

      if (department != undefined) {
        update_department = department
      }

      // now we will update
      let updateAdviser = 'UPDATE advisers SET net_id=?, adviser_name=?, department=? WHERE net_id=?;';
      db.run(updateAdviser, [net_id, update_adviser_name, update_department, net_id], function (err) {
        if (err) {
          console.error('Error inserting adviser:', err);
          res.status(500).json({'Adviser': err });
        } else {
          res.status(201).json({'Adviser' : [net_id, update_adviser_name, update_department]});
        }
      });
    }
  })
})

app.post('/updateSection', async (req, res) => {
  let db = await getDBConnection()
  let section_id = req.body.section_id;
  let ta = req.body.ta;
  let co_ta = req.body.co_ta;
  let section_times = req.body.section_times;
  let class_id = req.body.class_id;

  let qry = 'SELECT* FROM sections WHERE section_id = ?;';

  db.get(qry, [req.body.section_id], (err, row) => {
    if (err) {
      console.log(err)
      res.json({'Section' : 'error'})
    } else {
      var update_section_id = row.section_id;
      var update_ta = row.ta;
      var update_co_ta = row.co_ta;
      let update_section_times = row.section_times;
      let update_class_id = row.class_id;


      // update
      if (section_id != undefined) {
        update_section_id = section_id
      }

      if (ta != undefined) {
        update_ta = ta
      }

      if (co_ta != undefined) {
        update_co_ta = co_ta
      }

      if (section_times != undefined) {
        update_section_times = section_times
      }

      if (class_id != undefined) {
        update_class_id = class_id
      }

      // now we will update
      let updateSection = 'UPDATE sections SET section_id=?, ta=?, co_ta=?, section_times=?, class_id=? WHERE section_id=?;';
      db.run(updateSection, [update_section_id, update_ta, update_co_ta, update_section_times, update_class_id, section_id], function (err) {
        if (err) {
          console.error('Error inserting section:', err);
          res.status(500).json({'Section': err });
        } else {
          res.status(201).json({'Section' : [update_section_id, update_ta, update_co_ta, update_section_times, update_class_id]});
        }
      });
    }
  })
})

async function removePerson(net_id) {
  let db = await getDBConnection()

  let removeFromRegistration = 'DELETE FROM registration WHERE net_id=?;';
  let removeFromWaitlist = 'DELETE FROM waitlist WHERE net_id=?;';
  let removePerson = 'DELETE FROM people WHERE net_id = ?';

  db.run(removeFromRegistration, [net_id], function (err) {
    if (err) {
      console.error('Error removing person from waitlist:', err)
    }
  });

  db.run(removeFromWaitlist, [net_id], function (err) {
    if (err) {
      console.error('Error removing person from waitlist:', err)
    }
  });

  db.run(removePerson, [net_id], function (err) {
    if (err) {
      console.error('Error removing person:', err)
    }
  });
  db.close();
}

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
  db.close();
})

app.post('/removeProfessor', async (req, res) => {
  let db = await getDBConnection()
  let net_id = req.body.net_id;

  let removeClass = 'DELETE FROM professors WHERE net_id =?;';

  db.run(removeClass, [net_id], function (err) {
    if (err) {
      console.error('Error removing class:', err);
      res.status(500).json({ message: 'Error removing class ' + net_id, error: err});
    } else {
      res.status(201).json({ message: 'Class removed successfully', net_id : net_id });
    }
  });
  db.close();
  removePerson(net_id);
})


app.post('/removeStudent', async (req, res) => {
  let db = await getDBConnection()
  let net_id = req.body.net_id;

  let removeStudent = 'DELETE FROM students WHERE net_id =?;';

  db.run(removeStudent, [net_id], function (err) {
    if (err) {
      console.error('Error removing student:', err);
      res.status(500).json({ message: 'Error removing student ' + net_id, error: err});
    } else {
      res.status(201).json({ message: 'Student removed successfully', net_id : net_id });
    }
  });
  db.close();
  removePerson(net_id);
})


app.post('/removeAdviser', async (req, res) => {
  let db = await getDBConnection()
  let net_id = req.body.net_id;

  let removeAdviser = 'DELETE FROM advisers WHERE net_id =?;';

  db.run(removeAdviser, [net_id], function (err) {
    if (err) {
      console.error('Error removing adviser:', err);
      res.status(500).json({ message: 'Error removing adviser ' + net_id, error: err});
    } else {
      res.status(201).json({ message: 'Adviser removed successfully', net_id : net_id });
    }
  });
  db.close();
  removePerson(net_id);
})

app.post('/removeSection', async (req, res) => {
  let db = await getDBConnection()
  let section_id = req.body.section_id;

  let removeSection= 'DELETE FROM sections WHERE section_id =?;';

  db.run(removeSection, [section_id], function (err) {
    if (err) {
      console.error('Error removing section:', err);
      res.status(500).json({ message: 'Error removing section ' + section_id, error: err});
    } else {
      res.status(201).json({ message: 'Section removed successfully', section_id : section_id });
    }
  });
  db.close();
})

const logStream = fs.createWriteStream("login.log", { flags: "a" });

app.post("/log", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp}: ${email} logged in\n`;

  logStream.write(logEntry);

  res.status(200).json({ message: "Login successful" });
});




app.post('/login', async (req, res) => {
  const db = await getDBConnection();
  let query = 'SELECT hash_pass, salt FROM people WHERE net_id = ?';

  const net_id = req.body.net_id;
  const password = req.body.password;

  db.get(query, [net_id], (err, result) => {
    if (err) {
      console.error("Error logging in: ", err.message);
      res.status(500).json({ message: 'Error logging in: ', error: err.message, status: 500 })
      db.close();
      return
    }

    if (!result) {
      console.log("Could not log in: " + net_id + " not found in database")
      res.status(404).json({ message: 'Could not log in: Invalid net_id', status: 404 })
      return;
    }

    const hash_pass = result.hash_pass;
    const salt = result.salt;
    if (hashCode(password + salt) == hash_pass) {
      console.log('Signed in with net_id ' + net_id)
      const timestamp = new Date().toLocaleString();
      const logEntry = `${timestamp}: ${net_id} logged in\n`;
      logStream.write(logEntry);
      res.status(200).json({ message: 'Logged in successfully', status: 200 })
    } else {
      console.log('Invalid password')
      res.status(404).json({ message: 'Could not log in: Invalid password', status: 404});
    }
  });

  db.close()
})

app.post('/addRegistration', async (req, res) => {
  const db = await getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;
  let query = 'INSERT INTO registration(net_id, class_id) VALUES (?, ?);';

  db.run(query, [net_id, class_id], function (err) {
    if (err) {
      console.error('Error inserting into registration:', err.message);
      res.status(500).json({ message: 'Error inserting into registration', error: err, status: 500});
      return;
    }
    console.log('Successfully added to registration');
    res.status(200).json({ message: 'Successfully added to registration', status: 200});
  })
  db.close();
})

app.post('/getStudentRegistration', async (req, res) =>{
  const db = await getDBConnection();
  let net_id = req.body.net_id;
  let query = 'SELECT CLASS_ID FROM REGISTRATION WHERE NET_ID = ?;';
  db.all(query, [net_id], (err, rows) => {
    var registration = [];
    if (err) {
      console.error('Error getting registartion:', err.message);
      res.status(500).json({ message: 'Error getting registration', error: err, status: 500});
      return;
    }
    rows.forEach((row) => {
      registration.push(row);
    });
    console.log('Successfully got registration');
    //res.status(200).json({ message: 'Successfully got student registration', status: 200});
    res.send({"Registration" : registration});
  })
  db.close();
})

app.post('/getClassRegistration', async (req, res) =>{
  const db = await getDBConnection();
  let class_id = req.body.class_id;
  let query = 'SELECT CLASS_ID FROM REGISTRATION WHERE class_id = ?;';
  db.all(query, [class_id], (err, rows) => {
    var registration = [];
    if (err) {
      console.error('Error getting registartion:', err.message);
      res.status(500).json({ message: 'Error getting registration', error: err, status: 500});
      return;
    }
    rows.forEach((row) => {
      registration.push(row);
    });
    console.log('Successfully got registration');
    //res.status(200).json({ message: 'Successfully got class registration', status: 200});
    res.send({"Registration" : registration});
  })
  db.close();
})

app.post('/removeRegistration', async (req, res) => {
  const db = await getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;
  let removeFromRegistration = 'DELETE FROM registration WHERE net_id=? AND class_id=?;';
  let getFromWaitlist = 'SELECT TOP 1 net_id, class_id FROM waitlist WHERE class_id=? ORDER BY position ASC;';
  let removeFromWaitlist = 'DELETE FROM waitlist WHERE net_id=? AND class_id=?;';
  let insertToRegistration = 'INSERT INTO registration(net_id, class) VALUES (?, ?);';

  db.run(removeFromRegistration, [net_id, class_id], function (err) {
    if (err) {
      console.error('Error removing from registration:', err.message);
      res.status(500).json({ message: 'Error removing from registration', error: err, status: 500});
      return;
    }
    console.log('Successfully removed from registration');
  });
  db.run(getFromWaitlist, [class_id], function (err, result) {
    if (err) {
      console.error('Error getting from waitlist:', err.message);
      res.status(500).json({ message: 'Error getting from waitlist', error: err, status: 500});
      return;
    }
    console.log('Successfully got from waitlist');
    if (!result) {
      res.status(200).json({ message: 'Successfully removed from registration', status: 200});
      return;
    }

    net_id = result.net_id;
    db.run(removeFromWaitlist, [net_id, class_id], function (err) {
      if (err) {
        console.error('Error removing from waitlist:', err.message);
        res.status(500).json({ message: 'Error removing from waitlist', error: err, status: 500});
        return;
      }
      console.log('Successfully removed from waitlist');
    });
    db.run(insertToRegistration, [net_id, class_id], function (err) {
      if (err) {
        console.error('Error inserting into registration from waitlist:', err.message);
        res.status(500).json({ message: 'Error inserting into registration from waitlist', error: err, status: 500});
        return;
      }
      console.log('Successfully registered from waitlist');
      res.status(200).json({ message: 'Successfully removed from registration and added from waitlist', status: 200});
    });
  });
  db.close();
})

app.post('/addWaitlist', async (req, res) => {
  const db = await getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.class_id;

  let queryGetPosition = 'SELECT TOP 1 position FROM waitlist ORDER BY position DESC;';
  let queryAddWaitlist = 'INSERT INTO waitlist(net_id, class_id, position) VALUES (?, ?, ?);';

  db.get(queryGetPosition, [], (err, result) => {
    if (err) {
      console.error('Error getting from waitlist: ', err.message);
      res.status(500).json({ message: 'Error getting from waitlist', error: err.message, status: 500});
      return;
    }

    let position = result ? result.position : 0;
    db.run(queryAddWaitlist, [net_id, class_id, position], function (err) {
      if (err) {
        console.error('Error adding to waitlist: ', err.message);
        res.status(500).json({ message: 'Error adding to waitlist', error: err.message, status: 500});
        return;
      }
      res.status(200).json({ message: 'Successfully added to waitlist', status: 200});
    });
  });
  db.close();
})

app.post('/removeWaitlist', async (req, res) => {
  const db = await getDBConnection();
  let net_id = req.body.net_id;
  let class_id = req.body.net_id;

  let queryRemove = 'DELETE FROM waitlist WHERE net_id=? AND class_id=?;';
  db.run(queryRemove, [net_id, class_id], function (err) {
    if (err) {
      console.error('Error removing from waitlist: ', err.message);
      res.status(500).json({ message: 'Error removing from waitlist', error: err.message, status: 500});
      return;
    }
    res.status(200).json({ message: 'Successfully removed from waitlist', status: 200});
  });
  db.close();
})

export default app

