import express from "express"
import dotenv from "dotenv"
import { Server } from "socket.io"
import { createServer } from 'node:http'
import logger from "morgan"

const app = express()
const server = createServer(app)
const io = new Server(server)
dotenv.config()

const PORT = process.env.PORT ?? 3000

io.on("connection", async (socket) => {
  console.log(`user connected: ${socket.id}`)

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`)
  })

  socket.on("chat message", async ({message}) => {
    io.emit("chat message", { message })
  })
})

app.use(express.static("client"))
app.use(logger('dev'))

// API
app.get("/api/", (req, res) => {
  res.send("<h2>Api</h2>")
})

server.listen(PORT, () => {
  console.log(`🚀 Server running in port: ${PORT}`)
})
