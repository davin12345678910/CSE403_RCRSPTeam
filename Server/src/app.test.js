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
    test("Test updateClasses", async () => {
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

      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'x'});
    }, 100000)



    // These are the tests for the student endpoints
    test("Test getStudent", async () => {
      const req = {
        net_id: 'pokemon678',
        student_name: 'pickachu',
        major: 'electrical engineering',
        email: 'pika@uw.edu',
        hash_pass: '123',
        salt: 'poo'
      };
      const addResponse = await request(app).post("/addStudent").send(req);
      console.log(addResponse.body.message)
      const getStudent = await request(app).post("/getStudent").send({'net_id' : 'pokemon678'});
      var net_id = getStudent.body.Student.net_id
      console.log("This is the student net_id: " + net_id)
      expect(net_id).toBe('pokemon678')
      await request(app).post("/removeStudent").send({'net_id' : req.net_id});
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




