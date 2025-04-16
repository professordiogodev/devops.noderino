const express = require("express")
const morgan = require("morgan")
const fs = require("fs")
const path = require("path")

const app = express()

const desiredPath = process.env.DESIRED_PATH || "/"
const port = process.env.PORT || 80
const number = process.env.NUMBER || 0

// Create a write stream (append mode)
const logStream = fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a" })

// Morgan middleware logs to file
app.use(morgan("combined", { stream: logStream }))

// Route: main response
app.get(desiredPath, (req, res) => {
    res.send(`<h1>Hello from ${desiredPath} number ${number}!</h1>`)
})

// Route: health check
app.get("/healthcheck", (req, res) => {
    res.status(200).send("It works!")
})

// Log every 5 seconds into the file
setInterval(() => {
    const timestamp = new Date().toISOString()
    logStream.write(`[${timestamp}] ⏱️ Server ${number} still running...\n`)
}, 5000)

// Start server
app.listen(port, () => {
    const startMessage = `🚀 Server ${number} listening on ${port} at path ${desiredPath}\n`
    logStream.write(startMessage)
    console.log(startMessage.trim())
})
