const app = require("express")()
require("dotenv").config()

const desiredPath = process.env.DESIRED_PATH || "/"
const port = process.env.PORT || 8080
const number = process.env.NUMBER || 0

app.get(desiredPath, (req, res) => {
  res.send(`<h1>Hello from ${desiredPath} number ${number}!</h1>`)
})

app.get("/healthcheck", (req, res) => {
    res.status(200).send("It works!")
})

app.listen(port, () => {
  console.log(`🚀 Server ${number} listening on ${port} at path ${desiredPath}`)
})
