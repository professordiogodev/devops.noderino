const express = require("express")
require("dotenv").config()

const app = express()
const desiredPath = process.env.DESIRED_PATH || "/"
const port = process.env.PORT || 8080
const number = process.env.NUMBER || 0

// Normalize path to always have a leading slash and no double slashes
const normalizedPath = "/" + desiredPath.replace(/^\/+/, "")

app.get(normalizedPath, (req, res) => {
  res.send(`<h1>Hello from ${desiredPath} number ${number}!</h1>`)
})

app.get("/healthcheck", (req, res) => {
  res.status(200).send("It works!")
})

app.use((req, res) => {
  res.status(404).send("<h1>404 - Not Found</h1>")
})

const server = app.listen(port, () => {
  console.log(`Server ${number} listening on http://localhost:${port}${normalizedPath}`)
})

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...")
  server.close(() => process.exit(0))
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...")
  server.close(() => process.exit(0))
})
