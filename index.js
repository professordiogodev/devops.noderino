const app = require("express")()
require("dotenv").config()

const desiredPath = process.env.DESIRED_PATH || "/"
const port = process.env.PORT || 8080
const number = process.env.NUMBER || 0

app.get(desiredPath, (req, res) => {
    setTimeout(() => {
        res.send(`<h1>(Slow) Hello from ${desiredPath} number ${number}!</h1>`)
    }, 6000) // 6000 ms = 6 seconds
})

app.get("/healthcheck", (req, res) => {
    setTimeout(() => {
        res.status(200).send("It slowly works!")
    }, 6000) // 6000 ms = 6 seconds
})

app.listen(port, () => {
    console.log(`🚀 Server ${number} listening on ${port} at path ${desiredPath}`)
})
