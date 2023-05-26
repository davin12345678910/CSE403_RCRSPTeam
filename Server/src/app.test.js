import request from 'supertest'
import app from './app.js'

const TIMEOUT = 5000;


// This is going to be out testing automation for the backend
describe("This is the registration automated testing", () => {

  // This is going to be the intergration testing
  describe("Intergration Testing", () => {

    // This will be testing if our endpoints are able to give
    // us 200 ok status code
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send()
      expect(response.statusCode).toBe(200)
    })

    // **********These are the tests for the classes endpoints***************
    // This check to see if the getClass endpoint properly works
    test("Test getClass", async () => {

      // Here we will be getting a class that is already in the database
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      expect(professor).toBe('x')
    }, TIMEOUT)


    // Here we will be getting all of the classes that are in the database
    test("Test getClasses", async () => {
      const addResponse = await request(app).get("/getClasses").send()
      var classes = addResponse.body.class

      // Here we will check if a class that is already in the database is returned
      // from getClasses
      var found = false
      classes.forEach(element => {
        if (element.class_id == '345') {
          found = true
        }
      })
      expect(found).toBe(true)
    }, TIMEOUT)

    /* test adding a class
    creates a file with the following information:
    and adds the class to the database
    then see if the correct class is in the database
    then delete the class from the database
    */
    test("Test addClass", async () => {

      const req = {
        class_id: '8910',
        credits: '4',
        rating: '10',
        average_gpa: '3',
        professor: 'x',
        assistant_professor: 'y',
        class_times: 'mon-fri',
        quarter: 'spring',
        class_name: 'gynecology',
        sln: '789',
        add_code_required: '1'
      };
      const addResponse = await request(app).post("/addClass").send(req);
      const getResponse = await request(app).get("/getClasses").send();
      var classes = getResponse.body.class
      var found = false
      classes.forEach(element => {
        if (element.class_id == '8910') {
          found = true
        }
      })
      expect(found).toBe(true)

      // remove the class once we are done testing
      await request(app).post("/removeClass").send({'class_id' : req.class_id});
    }, TIMEOUT)

    /** tests updating a class where a field is updated and then test if the field is correctly updated */
    test("Test updateClass", async () => {
      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'cat'});
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor

      // check to see if the change happened
      expect(professor).toBe('cat')

      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'x'});
    }, TIMEOUT)


    // ********These are the tests for the student endpoints******
    // This will check to see if we are able to get a student that we already
    // added into the database
    test("Test getStudent", async () => {
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var net_id = getStudent.body.student.net_id
      expect(net_id).toBe('pokemon678')
    }, TIMEOUT)

    // This will check to see if we are able to add a students into the database
    test("Test addStudent", async () => {
      const req = {
        net_id: 'pokemon8910',
        student_name: 'pickachu',
        major: 'electrical engineering',
        email: 'pika@uw.edu',
        password: '123',
      };
      await request(app).post("/addStudent").send(req);
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon8910'});

      // Here we will remove, because if we tests again and don't have this
      // we will get a unique key error since net_id is a primary key
      await request(app).post("/removeStudent").send({'net_id' : req.net_id});
      
      var net_id = getStudent.body.student.net_id
      expect(net_id).toBe('pokemon8910')

      // Here we will remove, because if we tests again and don't have this
      // we will get a unique key error since net_id is a primary key
    }, TIMEOUT)


    // This will update the fields of a student that we passed in, and will check
    // to see if the fields properly updated or not
    test("Test updateStudent", async () => {
      await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'major' : 'computer engineering'});

      const addResponse = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var major = addResponse.body.student.major

      expect(major).toBe('computer engineering')

      await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'email' : 'pokemon678@uw.edu', 'student_name' : 'azaan', 'password' : '123', 'major' : 'electrical engineering'});
    }, TIMEOUT)


    // **********These are the tests for the professor endpoints***************
    // This is where we will be testing if we are able to properly add in a professor
    test("Test addProfessor", async () => {
      const req = {
        net_id: '678',
        professor_name: 'x',
        department: 'y',
        tenure: '10',
        email: 'z',
        rating: '10'
      };

      const addResponse = await request(app).post("/addProfessor").send(req);
      //console.log(addResponse.body.message)
      const getResponse = await request(app).post("/getProfessor").send({'net_id' : '678'});
      var professors = getResponse.body.professor.professor_name
      //console.log('This is the professors name: ' + professors)
      expect(professors).toBe('x')

      // We need to remove professor so that we can test add when we test again later
      await request(app).post("/removeProfessor").send({'net_id' : '678'});
    }, TIMEOUT)



    // Here we will be testing updateProfessor, to see if we are able to properly update the fields
    // in which we pass into to this endpoint
    test("Test updateProfessor", async () => {
      const updateResponse = await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'cat'});
      //console.log(updateResponse.body.professor);
      const addResponse = await request(app).post("/getProfessor").send({'net_id' : '123'});
      var professor = addResponse.body.professor.professor_name
      //console.log(professor)

      expect(professor).toBe('cat');

      await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'x', 'email' : '123@uw.edu', 'password' : 'pass123', 'department' : 'math', 'tenure' : '0', 'rating' : '4'});
    }, TIMEOUT)


    // **********These are the tests for the adviser endpoints***************
    // Here we will see if we are able to properly add in an adviser
    test("Test addAdviser", async () => {
      const req = {
        net_id: '345',
        adviser_name: 'x',
        department: 'y',
        email: 'z'
      };
      const addResponse = await request(app).post("/addAdviser").send(req);
      //console.log(addResponse.body.message)

      const getResponse = await request(app).post("/getAdviser").send({'net_id' : '345'});
      var adviser = getResponse.body.adviser.adviser_name
      //console.log('This is the Adviser name: ' + adviser)
      expect(adviser).toBe('x')

      await request(app).post("/removeAdviser").send({'net_id' : '345'});
    }, TIMEOUT)


    // Here we will test to see if we are able to properly update the fields of an adviser
    // specfically the fields in which we pass to the endnpoint which we want to update
    test("Test updateAdviser", async () => {
      const updateResponse = await request(app).post("/updateAdviser").send({'net_id' : '456', 'adviser_name' : 'cat'});
      //console.log(updateResponse.body.adviser);
      const addResponse = await request(app).post("/getAdviser").send({'net_id' : '456'});
      var adviser = addResponse.body.adviser.adviser_name
      //console.log(adviser)
      expect(adviser).toBe('cat');

      await request(app).post("/updateAdviser").send({'net_id' : '456', 'adviser_name' : 'x', 'email' : '456@uw.edu', 'password' : 'pass456', 'department' : 'math'});
    }, TIMEOUT)


    // **********These are the tests for the section endpoints***************
    // these are the endpoint tests for the sections
    // they follow the same format as the professor and student and advisers endpoints
    test("Test addSection", async () => {
      const req = {
        section_id: '157',
        ta: 'x',
        co_ta: 'y',
        section_times: 'z',
        class_id: 'w'
      };
      const addSection = await request(app).post("/addSection").send(req);
      //console.log(addSection.body.message)

      const getResponse = await request(app).post("/getSection").send({'section_id' : '157'});
      //console.log(getResponse.body.message)
      var ta = getResponse.body.section.ta
      //console.log('This is the ta name: ' + ta)
      expect(ta).toBe('x')

      var removeResponse = await request(app).post("/removeSection").send({'section_id' : '157'});
    }, TIMEOUT)


    // Here we will test to see if we are able to update the fields in which we pass to the endpoint
    // for the sections
    test("Test updateSection", async () => {
      const updateResponse = await request(app).post("/updateSection").send({'section_id' : 'section0', 'ta' : 'cat'});
      //console.log(updateResponse.body.section);
      const getResponse = await request(app).post("/getSection").send({'section_id' : 'section0'});
      var ta = getResponse.body.section.ta
      //console.log(ta)
      expect(ta).toBe('cat');

      await request(app).post("/updateSection").send({'section_id' : 'section0', 'ta' : 'x'});
    }, TIMEOUT)


    // **********These are the tests for the registration endpoints***************
    // Here we will test to see if we are able to add to the registration table
    test("Test addRegistration", async () => {
      const req = {
        net_id: 'pokemon678',
        class_id: 'cse331',
      }
      
      const addResponse = await request(app).post("/addRegistration").send(req);
      //console.log(addResponse.body.message);
      const getResponseStudent = await request(app).post("/getStudentRegistration").send({'net_id' : 'pokemon678'});
      const getResponseClass = await request(app).post("/getClassRegistration").send({'class_id' : 'cse331'});
      await request(app).post('/removeRegistration').send({ net_id: 'pokemon678', class_id: 'cse331' });
      //console.log(getResponseStudent.body.message);
      //console.log(getResponseClass.body.message);
      var classes = getResponseStudent.body.registration;
      var students = getResponseClass.body.registration;
      //console.log('This is the class: ' + classes);
      var found = false
      classes.forEach(function(element) {
        if (element.class_id == 'cse331') {
          found = true
        }
      });
      expect(found).toBe(true)

      //console.log('This is the student: ' + students);
      found = false;
      students.forEach(function(element) {
        if (element.net_id == 'pokemon678') {
          found = true
        }
      });
      expect(found).toBe(true);
    }, TIMEOUT);

    test("Test addRegistration full course", async () => {
      const req = {
        net_id: "pokemon678",
        class_id: "cse332"
      }
      const addResponse = await request(app).post('/addRegistration').send(req);
      expect(addResponse.body.status).toBe(500);
    }, TIMEOUT);

    test("Test addRegistration schedule conflict", async () => {
      const req = {
        net_id: "pokemon678",
        class_id: "cse333"
      }
      const addResponse = await request(app).post('/addRegistration').send(req);
      await request(app).post('/removeRegistration').send(req);
      expect(addResponse.body.status).toBe(500);
    }, TIMEOUT);


    // Here we will check to see if we are able to login successfully
    test("Test login successful", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon678', 'password' : '123'});
      //console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('/login success.')
    }, TIMEOUT)


    // Here we will test to see if we are able to see if we get a invalid password message if we put in teh wrong password
    test("Test login wrong password", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon678', 'password' : 'pass123'});
      //console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('Could not log in: Invalid password')
    }, TIMEOUT)

    // Here we will test to see if we are going to get an error message if we put in the wrong net_id
    test("Test login wrong net_id", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon789', 'password' : '123'});
      //console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('Could not log in: Invalid net_id')
    }, TIMEOUT)


    // **********These are the tests for the addCode endpoints***************

    // This will test to see if we are able to get the addCode for a class
    test("Test getAddCode", async () => {
      const getAddCode = await request(app).post("/getAddCode").send({'class' : 'CSE 403'});
      //console.log(getAddCode.body.AddCodes);

      // We should probably be testing a bit more than just the job type
      // it might be best to get something such as the addCode or the class for example,
      // class would make sense since you would want to make sure that the class that you got
      // is the class that you wanted
      var add_code = getAddCode.body.AddCodes[0].JobType
      expect(add_code).toBe('Adviser');
    }, TIMEOUT)

    // This will test to see if we are able to add an add code to the table properly
    test("Test addAddCode", async () => {
      const req = {
        add_id: '2',
        add_code_status: '0',
        JobType: 'Adviser',
        add_code: '123',
        class: 'CSE 403',
        net_id: '123'
      };
      //console.log(req);
      const addAddCode = await request(app).post("/addAddCode").send(req);
      //console.log(addAddCode.body.message)

      const getAddCode = await request(app).post("/getAddCode").send({'class' : 'CSE 403'});

      var found = false
      getAddCode.body.AddCodes.forEach(element => {
        if (element.add_id == '2') {
          found = true
        }
      })
      expect(found).toBe(true);
      await request(app).post("/removeAddCode").send({'add_id' : '2'});
    }, TIMEOUT)

    // **********These are the tests for the message endpoints***************
    // This will let you test to see if you are able to get a message that was added into the database
    test("Test getMessages", async () => {
      const req = {
        net_id_sender: 'sender',
        JobType_sender: 'professor',
        net_id_receiver: 'receiver',
        JobType_receiver: 'student',
        message: 'Add code is 12345'
      };
      //console.log(req);
      const addMessages = await request(app).post("/addMessages").send(req);
      //console.log(addMessages.body.message)

      const getMessages = await request(app).post("/getMessages").send({'net_id_sender' : 'sender', 'net_id_receiver': 'receiver'});
      //console.log(getMessages.body.Messages);

      await request(app).post('/removeMessages').send({ net_id_sender: 'sender', net_id_receiver: 'receiver' });

      expect(getMessages.body.Messages[0].net_id_sender).toBe('sender');
      expect(getMessages.body.Messages[0].message).toBe('Add code is 12345');
    }, TIMEOUT);


    // Here we will test to see if we are able to add in a message into the message table
    test("Test addMessages", async () => {
      const req = {
        net_id_sender: 'sender',
        JobType_sender: 'professor',
        net_id_receiver: 'receiver',
        JobType_receiver: 'student',
        message: 'Add code is 12345'
      };
      //console.log(req);
      const addMessage = await request(app).post("/addMessages").send(req);
      //console.log(addMessage.body.message)

      const getMessages = await request(app).post("/getMessages").send({'net_id_sender' : 'sender', 'net_id_receiver': 'receiver'});
      //console.log(getMessages.body.Messages);

      await request(app).post("/removeMessages").send({'net_id_sender' : 'sender', 'net_id_receiver': 'receiver'});

      let found = false;
      getMessages.body.Messages.forEach(element => {
        if (element.message == 'Add code is 12345') {
          found = true
        }
      })
      expect(found).toBe(true);
    }, TIMEOUT);
  });

  // These are the tests to see if the database is functioning properly
  describe("Unit Testing", () => {
    describe("Database works", () => {
      test('database works properly', async () => {
        try {
          await app.getDBConnection
          expect(true).toBe(true);
        } catch (error) {
          console.error("This is the error: " + error)
          expect("pokemon").toBe("dog");
        }
      })
    });
  });
})




