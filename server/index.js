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

io.on("connection", async (socket) => {
  const connectedUser = socket.handshake.auth.username
  io.emit("user connected", { username: connectedUser })

  socket.on("disconnect", () => {
    const disconnectedUser = socket.handshake.auth.username
    io.emit("user disconnected", { username: disconnectedUser })
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
