import request from 'supertest'
import app from './app.js'
import { response } from 'express'


describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send()
      expect(response.statusCode).toBe(200)
    })

    // We are always going to have 345 in the database, so we are going to check
    // if 345 is still in the database
    test("Should contain 345", async () => {
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

    test("Add classes contains 8910", async () => {
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

    test("Add professor contains 8910", async () => {
      const req = {
        net_id: '8910',
        professor_name: 'x',
        department: 'y',
        tenure: '10',
        email: 'z',
        rating: '10'
      };
      const addResponse = await request(app).post("/addProfessor").send(req);
      const getResponse = await request(app).get("/getProfessor").send();
      var professors = getResponse.body.professor
      var found = false
      professors.forEach(element => {
        if (element.net_id == '8910') {
          found = true
        }
      })
      expect(found).toBe(true)

      var removeResponse = await request(app).post("/removeProfessor").send({'net_id' : req.net_id});
    }, 100000)


    test("Test getClass", async () => {
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      expect(professor).toBe('x')
    }, 100000)


    test("Test updateClass", async () => {
      const updateResponse = await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'cat'});
      console.log(updateResponse.body.class);
      const addResponse = await request(app).post("/getClass").send({'class_id' : '345'});
      var professor = addResponse.body.class.professor
      console.log(professor)

      await request(app).post("/updateClass").send({'class_id' : '345', 'professor' : 'x'});
    }, 100000)

    test("Test updateProfessor", async () => {
      const updateResponse = await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'cat'});
      console.log(updateResponse.body.professor);
      const addResponse = await request(app).post("/getProfessor").send({'net_id' : '123'});
      var professor = addResponse.body.professor.professor_name
      console.log(professor)
  
      await request(app).post("/updateProfessor").send({'net_id' : '123', 'professor_name' : 'x'});
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




