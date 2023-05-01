import request from 'supertest'
import app from './app.js'


describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send()
      expect(response.statusCode).toBe(200)
    })

    test("should respond should be happy", async () => {
      const response = await request(app).post("/users").send()
      expect(response.body.name).toBe("happy")
    })
  })
})