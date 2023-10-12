import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"

const socket = io()

const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("messages")

socket.on("chat message", ({ message, date }) => {
  const messageDate = new Date(date).toLocaleString()

  messages.insertAdjacentHTML("beforeend", `<li><p>${message}</p><small>${messageDate}</small></li>`)
  messages.scrollTop = messages.scrollHeight
})

form.addEventListener("submit", (e) => {
  e.preventDefault()

  if (input.value) {
    const date = new Date()
    socket.emit("chat message", { message: input.value, date })
    input.value = ""
  }
})
