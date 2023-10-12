import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"

const socket = io()

const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("messages")

socket.on("chat message", ({ message, date, username }) => {
  const messageDate = new Date(date).toLocaleString()
  let classItem = ""

  if (username === localStorage.getItem("username")) {
    classItem = "own-message"
  } 

  messages.insertAdjacentHTML(
    "beforeend",
    `<li class="${classItem}">
      <p>${message}</p>
      <div class="metadata-message">
        <small>${messageDate}</small>
        <small>${username}</small>
      </div>
    </li>`
  )
  messages.scrollTop = messages.scrollHeight
})

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const username = localStorage.getItem("username")

  if (input.value) {
    const date = new Date()
    socket.emit("chat message", { message: input.value, date, username })
    input.value = ""
  }
})
