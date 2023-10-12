import express from "express"
import dotenv from "dotenv"

const app = express()
dotenv.config()

const PORT = process.env.PORT ?? 3000

app.use(express.static('client'))

// API
app.get("/api/", (req, res) => {
  res.send("<h2>Api</h2>")
})

app.listen(PORT, () => {
  console.log(`🚀 Server running in port: ${PORT}`)
})
