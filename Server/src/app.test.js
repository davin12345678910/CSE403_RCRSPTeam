import request from 'supertest'
import app from './app.js'
import { response } from 'express'

const TIMEOUT = 5000;

describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send()
      expect(response.statusCode).toBe(200)
    })

    test("Test getClass", async () => {
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      expect(professor).toBe('x')
    }, TIMEOUT)

    // We are always going to have 345 in the database, so we are going to check
    // if 345 is still in the database
    test("Test getClasses", async () => {
      const addResponse = await request(app).get("/getClasses").send()
      var classes = addResponse.body.class

      var found = false
      classes.forEach(element => {
        if (element.class_id == '345') {
          found = true
        }
      })
      expect(found).toBe(true)
    }, TIMEOUT)

    test("Test addClasses", async () => {

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
      const addResponse = await request(app).post("/addClasses").send(req);
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
      var removeResponse = await request(app).post("/removeClasses").send({'class_id' : req.class_id});
    }, TIMEOUT)

    test("Test updateClass", async () => {
      const updateResponse = await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'cat'});
      console.log(updateResponse.body.class);
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      console.log(professor)

      expect(professor).toBe('cat')

      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'x'});
    }, TIMEOUT)


    // These are the tests for the student endpoints
    test("Test getStudent", async () => {
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var net_id = getStudent.body.Student.net_id
      console.log("This is the student net_id: " + net_id)
      expect(net_id).toBe('pokemon678')
    }, TIMEOUT)


    test("Test addStudent", async () => {
      const req = {
        net_id: 'pokemon8910',
        student_name: 'pickachu',
        major: 'electrical engineering',
        email: 'pika@uw.edu',
        password: '123',
      };
      const addResponse = await request(app).post("/addStudent").send(req);
      console.log(addResponse.body.message)
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon8910'});
      var net_id = getStudent.body.Student.net_id
      console.log("This is the student net_id: " + net_id)
      expect(net_id).toBe('pokemon8910')
      await request(app).post("/removeStudent").send({'net_id' : req.net_id});
    }, TIMEOUT)



    test("Test updateStudent", async () => {
      const updateResponse = await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'major' : 'computer engineering'});
      console.log("This is the student:  " + updateResponse.body.Student);

      const addResponse = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var major = addResponse.body.Student.major
      console.log(major)

      expect(major).toBe('computer engineering')

      await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'email' : 'pokemon678@uw.edu', 'student_name' : 'azaan', 'password' : '123', 'major' : 'electrical engineering'});
    }, TIMEOUT)



    //These are the tests for the professor endpoints

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
      console.log(addResponse.body.message)
      const getResponse = await request(app).post("/getProfessor").send({'net_id' : '678'});
      var professors = getResponse.body.Professor.professor_name
      console.log('This is the professors name: ' + professors)
      expect(professors).toBe('x')

      var removeResponse = await request(app).post("/removeProfessor").send({'net_id' : '678'});
    }, TIMEOUT)




    test("Test updateProfessor", async () => {
      const updateResponse = await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'cat'});
      console.log(updateResponse.body.Professor);
      const addResponse = await request(app).post("/getProfessor").send({'net_id' : '123'});
      var professor = addResponse.body.Professor.professor_name
      console.log(professor)

      expect(professor).toBe('cat');

      await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'x', 'email' : '123@uw.edu', 'password' : 'pass123', 'department' : 'math', 'tenure' : '0', 'rating' : '4'});
    }, TIMEOUT)


    /*
    These are the endpoint tests for advisers
    */
    test("Test addAdviser", async () => {
      const req = {
        net_id: '345',
        adviser_name: 'x',
        department: 'y',
        email: 'z'
      };
      const addResponse = await request(app).post("/addAdviser").send(req);
      console.log(addResponse.body.message)

      const getResponse = await request(app).post("/getAdviser").send({'net_id' : '345'});
      var adviser = getResponse.body.Adviser.adviser_name
      console.log('This is the Adviser name: ' + adviser)
      expect(adviser).toBe('x')

      var removeResponse = await request(app).post("/removeAdviser").send({'net_id' : '345'});
    }, TIMEOUT)


    test("Test updateAdviser", async () => {
      const updateResponse = await request(app).post("/updateAdviser").send({'net_id' : '456', 'adviser_name' : 'cat'});
      console.log(updateResponse.body.Adviser);
      const addResponse = await request(app).post("/getAdviser").send({'net_id' : '456'});
      var adviser = addResponse.body.Adviser.adviser_name
      console.log(adviser)
      expect(adviser).toBe('cat');

      await request(app).post("/updateAdviser").send({'net_id' : '456', 'adviser_name' : 'x', 'email' : '456@uw.edu', 'password' : 'pass456', 'department' : 'math'});
    }, TIMEOUT)


    test("Test addSection", async () => {
      const req = {
        section_id: '157',
        ta: 'x',
        co_ta: 'y',
        section_times: 'z',
        class_id: 'w'
      };
      const addSection = await request(app).post("/addSection").send(req);
      console.log(addSection.body.message)

      const getResponse = await request(app).post("/getSection").send({'section_id' : '157'});
      console.log(getResponse.body.message)
      var ta = getResponse.body.Section.ta
      console.log('This is the ta name: ' + ta)
      expect(ta).toBe('x')

      var removeResponse = await request(app).post("/removeSection").send({'section_id' : '157'});
    }, TIMEOUT)


    test("Test updateSection", async () => {
      const updateResponse = await request(app).post("/updateSection").send({'section_id' : '331', 'ta' : 'cat'});
      console.log(updateResponse.body.Section);
      const addResponse = await request(app).post("/getSection").send({'section_id' : '331'});
      var ta = addResponse.body.Section.ta
      console.log(ta)
      expect(ta).toBe('cat');

      await request(app).post("/updateSection").send({'section_id' : '331', 'ta' : 'x'});
    }, TIMEOUT)

    test("Test addRegistration", async () => {
      const req = {
        net_id: 'pokemon678',
        class_id: 'cse331',
      }
      const req2 = {
        net_id: 'pokemon678',
        class_id: 'cse312',
      }
      const addResponse = await request(app).post("/addRegistration").send(req);
      console.log(addResponse.body.message);
      const getResponse = await request(app).post("/getRegistration").send({'net_id' : 'pokemon678'});
      console.log(getResponse.body.message);
      var classes = getResponse.body.Registration;
      console.log('This is the class: ' + classes);
      var found = false
      classes.forEach(function(element) {
        if (element.class_id == 'cse331') {
          found = true
        }
      });
      expect(found).toBe(true)

      // const addResponse2 = await request(app).post("/addRegistration").send(req2);
      // console.log(addResponse2.body.message);
      // const getResponse2 = await request(app).post("/getRegistration").send({'net_id' : 'pokemon678'});
      // console.log(getResponse2.body.message);
      // var classes2 = getResponse2.body.Registration[1].class_id
      // console.log('This is the class: ' + classes2)
      // var test_list = ['cse331', 'cse312']
      // expect(classes2).toBe(test_list)
    }, TIMEOUT)


    test("Test login successful", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon678', 'password' : '123'});
      console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('Logged in successfully')
    }, TIMEOUT)

    test("Test login wrong password", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon678', 'password' : 'pass123'});
      console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('Could not log in: Invalid password')
    }, TIMEOUT)

    test("Test login wrong net_id", async () => {
      const loginResponse = await request(app).post("/login").send({'net_id' : 'pokemon789', 'password' : '123'});
      console.log(loginResponse.body.message);
      expect(loginResponse.body.message).toBe('Could not log in: Invalid net_id')
    }, TIMEOUT)



    // These are the tests for the student endpoints
    test("Test getAddCode", async () => {
      const req = {
        add_id: '1',
        net_id: 'pika',
        JobType: 'Adviser',
        add_code: '123',
        class: 'CSE 333'
      };
      console.log(req);
      const addAddCode = await request(app).post("/addAddCode").send(req);
      console.log(addAddCode.body.message)

      const getAddCode = await request(app).post("/getAddCode").send({'class' : 'CSE 333'});
      console.log(getAddCode.body.AddCodes);

      // We should probably be testing a bit more than just the job type
      // it might be best to get something such as the addCode or the class for example,
      // class would make sense since you would want to make sure that the class that you got
      // is the class that you wanted
      var add_code = getAddCode.body.AddCodes[0].JobType
      expect(add_code).toBe('Adviser');
      const removeAddCode = await request(app).post("/removeAddCode").send({'add_id' : '1'});
    }, TIMEOUT)

    // These are the tests for the student endpoints
    test("Test addAddCode", async () => {
      const req = {
        add_id: '2',
        net_id: 'pika',
        JobType: 'Adviser',
        add_code: '123',
        class: 'CSE 403'
      };
      console.log(req);
      const addAddCode = await request(app).post("/addAddCode").send(req);
      console.log(addAddCode.body.message)

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

    // Here we will be adding test for the messaging servies in which users can use
    test("Test getMessages", async () => {
      const req = {
        net_id_sender: 'sender',
        JobType_sender: 'professor',
        net_id_reciever: 'reciever',
        JobType_reciever: 'student',
        message: 'Add code is 12345'
      };
      console.log(req);
      const addAddCode = await request(app).post("/addMessages").send(req);
      console.log(addAddCode.body.message)

      const getAddCode = await request(app).post("/getMessages").send({'net_id_sender' : 'sender', 'net_id_reciever': 'reciever'});
      console.log(getAddCode.body.Messages);

      expect(getAddCode.body.Messages[0].net_id_sender).toBe('sender');
    }, TIMEOUT);


    // Here we will be adding test for the messaging servies in which users can use
    test("Test addMessages", async () => {
      const req = {
        net_id_sender: 'sender',
        JobType_sender: 'professor',
        net_id_reciever: 'reciever',
        JobType_reciever: 'student',
        message: 'Add code is 12345'
      };
      console.log(req);
      const addAddCode = await request(app).post("/addMessages").send(req);
      console.log(addAddCode.body.message)

      const getAddCode = await request(app).post("/getMessages").send({'net_id_sender' : 'sender', 'net_id_reciever': 'reciever'});
      console.log(getAddCode.body.Messages);

      let found = false;
      getAddCode.body.Messages.forEach(element => {
        if (element.message == 'Add code is 12345') {
          found = true
        }
      })

      expect(found).toBe(true);

      const removeAddCode = await request(app).post("/removeMessages").send({'net_id_sender' : 'sender', 'net_id_reciever': 'reciever'});
    }, TIMEOUT);
  });

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




