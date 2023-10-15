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
const usersListBtn = document.getElementById("user-list-button")
const usersListModal = document.getElementById("users-list")
const usersActiveNumber = document.getElementById("users-active-number")
const usersActiveListMax = document.getElementById("users-active-list-max")
const usersActiveList = document.getElementById("users-active-list")

const alertTemplate = ({ username, text }) => `
  <div class="alert" id="alert-${username}">
    <h4>The user ${username} ${text}</h4>
  </div>
`

socket.on("chat message", ({ message, date, username }) => {
  const messageDate = new Date(date).toLocaleString()
  let classItem = ""

  if (username === localStorage.getItem("username")) {
    classItem = "own-message"
  } else {
    const sound = new Audio("../public/alert.mp3")
    sound.play()
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

socket.on("user disconnected", ({ username, activeUsers }) => {
  body.insertAdjacentHTML(
    "beforeend",
    alertTemplate({ username, text: "disconnected" }),
  )
  const alert = document.getElementById(`alert-${username}`)
  setTimeout(() => {
    alert.remove()
  }, 1000)

  localStorage.setItem("active-users", activeUsers)

  usersActiveNumber.innerHTML = activeUsers.length
  renderActiveList(usersActiveListMax)
})

socket.on("user connected", ({ username, activeUsers }) => {
  localStorage.setItem("active-users", activeUsers)
  usersActiveNumber.innerHTML = activeUsers.length
  renderActiveList(usersActiveListMax)

  if (username === localStorage.getItem("username")) return

  body.insertAdjacentHTML(
    "beforeend",
    alertTemplate({ username, text: "connected" }),
  )

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

function getActiveUsers() {
  const activeUsers = localStorage.getItem("active-users")
  const activeUsersArray = activeUsers.split(",")
  return activeUsersArray
}

function renderActiveList(element) {
  element.innerHTML = ""
  const activeUsers = getActiveUsers()
  activeUsers.map((username) =>
    element.insertAdjacentHTML("beforeend", `<li>${username}</li>`),
  )
}

renderActiveList(usersActiveListMax)

const activeUsers = getActiveUsers()
usersActiveNumber.innerHTML = activeUsers.length

usersListBtn.addEventListener("click", () => {
  renderActiveList(usersActiveList)
  usersListModal.classList.toggle("user-modal-active")
})

body.addEventListener("click", (e) => {
  // TODO: the if not working well
  if (
    (usersListBtn.contains(e.target) || usersListModal.contains(e.target)) &&
    !usersListModal.classList.contains("user-modal-active")
  ){
    usersListModal.classList.remove("user-modal-active")
    console.log("click outside button, modal and the modal don't have class")
  } else {
    console.log("click inside button, modal or the modal have class")
  }
})
