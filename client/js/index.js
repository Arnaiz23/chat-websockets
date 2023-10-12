const input = document.getElementById("inputLogin")
const form = document.getElementById("formLogin")

const chatUrl = "http://localhost:3000/chat.html"

if(localStorage.getItem("username")) {
  location.href = chatUrl
}

form.addEventListener("submit", (e) => {
  e.preventDefault()

  if (input.value) {
    localStorage.setItem("username", input.value)
    location.href = chatUrl
  }
})
