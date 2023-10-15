import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
// import { Toaster, toast } from 'https://cdn.jsdelivr.net/npm/sonner@1.0.3/+esm'

const socket = io({
  auth: {
    username: localStorage.getItem("username"),
  },
})

const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("messages")
const logout = document.getElementById("logout-button")
const body = document.querySelector("body")

const alertTemplate = (username) => `
  <div class="alert" id="alert-${username}">
    <h4>The user ${username} connect</h4>
  </div>
`

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
    </li>`,
  )
  messages.scrollTop = messages.scrollHeight
})

socket.on("user disconnected", ({ username }) => {
  body.insertAdjacentHTML("beforeend", alertTemplate(username))
  const alert = document.getElementById(`alert-${username}`)
  setTimeout(() => {
    alert.remove()
  }, 1000)
})

socket.on("user connected", ({ username }) => {
  if (username === localStorage.getItem("username")) return

  body.insertAdjacentHTML("beforeend", alertTemplate(username))

  const alert = document.getElementById(`alert-${username}`)
  setTimeout(() => {
    alert.remove()
  }, 1000)
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

logout.addEventListener("click", () => {
  if (localStorage.getItem("username")) {
    localStorage.removeItem("username")
    location.href = "http://localhost:3000"
  }
})
