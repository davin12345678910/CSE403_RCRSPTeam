import request from 'supertest'
import app from './app.js'



describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send()
      expect(response.statusCode).toBe(200)
    })

    test("Should contain 345", async () => {
      const addResponse = await request(app).post("/getClasses").send()
      var classes = addResponse.body.class

      setTimeout(() => {

      }, 7000000);

      var found = false
      classes.forEach(element => {
        if (element.class_id == '345') {
          found = true
        }
      })
      expect(found).toBe(true)
    })
  })
})