const express = require("express")
const morgan = require("morgan")

const app = express()

const desiredPath = process.env.DESIRED_PATH || "/"
const port = process.env.PORT || 80
const number = process.env.NUMBER || 0

// Morgan middleware for access logs
app.use(morgan("combined"))

app.get(desiredPath, (req, res) => {
    res.send(`<h1>Hello from ${desiredPath} number ${number}!</h1>`)
})

app.get("/healthcheck", (req, res) => {
    res.status(200).send("It works!")
})

// Custom log every 5 seconds
setInterval(() => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ⏱️ Server ${number} still running...`)
}, 5000)

app.listen(port, () => {
    console.log(`🚀 Server ${number} listening on ${port} at path ${desiredPath}`)
})
