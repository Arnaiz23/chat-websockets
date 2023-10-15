import express from "express"
import dotenv from "dotenv"
import { Server } from "socket.io"
import { createServer } from "node:http"
import logger from "morgan"

const app = express()
const server = createServer(app)
const io = new Server(server)
dotenv.config()

const PORT = process.env.PORT ?? 3000

const activeUsers = []

io.on("connection", async (socket) => {
  const connectedUser = socket.handshake.auth.username
  activeUsers.push(connectedUser)
  console.log(activeUsers)
  io.emit("user connected", { username: connectedUser, activeUsers })

  socket.on("disconnect", () => {
    const disconnectedUser = socket.handshake.auth.username
    const index = activeUsers.findIndex((user) => user === disconnectedUser)
    activeUsers.splice(index, 1)
    io.emit("user disconnected", { username: disconnectedUser, activeUsers })
  })

  socket.on("chat message", async ({ message, date, username }) => {
    io.emit("chat message", { message, date, username })
  })
})

app.use(express.static("client"))
app.use(logger("dev"))

// API
app.get("/api/", (req, res) => {
  res.send("<h2>Api</h2>")
})

server.listen(PORT, () => {
  console.log(`🚀 Server running in port: ${PORT}`)
})
