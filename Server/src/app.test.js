import request from 'supertest'
import app from './app.js'
import { response } from 'express'


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
    }, 100000)

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
    }, 100000)

    test("Test addClasses", async () => {
      const req = {
        class_id: '8910',
        credits: '4',
        rating: '10',
        average_gpa: '3',
        professor: 'x',
        assistant_professor: 'y',
        class_times: 'mon-fri',
        quarter: 'spring'
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
    }, 100000)

    test("Test updateClass", async () => {
      const updateResponse = await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'cat'});
      console.log(updateResponse.body.class);
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      console.log(professor)

      expect(professor).toBe('cat')

      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'x'});
    }, 100000)


    // These are the tests for the student endpoints
    test("Test getStudent", async () => {
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var net_id = getStudent.body.Student.net_id
      console.log("This is the student net_id: " + net_id)
      expect(net_id).toBe('pokemon678')
    }, 100000)


    test("Test addStudent", async () => {
      const req = {
        net_id: 'pokemon8910',
        student_name: 'pickachu',
        major: 'electrical engineering',
        email: 'pika@uw.edu',
        hash_pass: '123',
        salt: 'poo'
      };
      const addResponse = await request(app).post("/addStudent").send(req);
      console.log(addResponse.body.message)
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon8910'});
      var net_id = getStudent.body.Student.net_id
      console.log("This is the student net_id: " + net_id)
      expect(net_id).toBe('pokemon8910')
      await request(app).post("/removeStudent").send({'net_id' : req.net_id});
    }, 100000)



    test("Test updateStudent", async () => {
      const updateResponse = await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'major' : 'computer engineering'});
      console.log("This is the student:  " + updateResponse.body.Student);

      const addResponse = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var major = addResponse.body.Student.major
      console.log(major)

      expect(major).toBe('computer engineering')

      await request(app).post("/updateStudent").send({'net_id' : 'pokemon678', 'major' : 'electrical engineering'});
    }, 100000)



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
    }, 100000)




    test("Test updateProfessor", async () => {
      const updateResponse = await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'cat'});
      console.log(updateResponse.body.Professor);
      const addResponse = await request(app).post("/getProfessor").send({'net_id' : '123'});
      var professor = addResponse.body.Professor.professor_name
      console.log(professor)

      expect(professor).toBe('cat');

      await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'x'});
    }, 100000)


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
    }, 100000)


    test("Test updateAdviser", async () => {
      const updateResponse = await request(app).post("/updateAdviser").send({'net_id' : '123', 'adviser_name' : 'cat'});
      console.log(updateResponse.body.Adviser);
      const addResponse = await request(app).post("/getAdviser").send({'net_id' : '123'});
      var adviser = addResponse.body.Adviser.adviser_name
      console.log(adviser)
      expect(adviser).toBe('cat');

      await request(app).post("/updateAdviser").send({'net_id' : '123', 'adviser_name' : 'x'});
    }, 100000)


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
    }, 100000)


    test("Test updateSection", async () => {
      const updateResponse = await request(app).post("/updateSection").send({'section_id' : '331', 'ta' : 'cat'});
      console.log(updateResponse.body.Section);
      const addResponse = await request(app).post("/getSection").send({'section_id' : '331'});
      var ta = addResponse.body.Section.ta
      console.log(ta)
      expect(ta).toBe('cat');

      await request(app).post("/updateSection").send({'section_id' : '331', 'ta' : 'x'});
    }, 100000)


  })

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




