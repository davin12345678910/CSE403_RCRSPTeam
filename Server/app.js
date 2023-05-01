import express from 'express'

const app = express()

app.use(express.json())
app.post('/users', async (req, res) => {
  res.send({name : "happy"})
})

export default app