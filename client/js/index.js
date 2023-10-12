import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

socket.on("chat message", ({ message }) => {
  messages.insertAdjacentHTML("beforeend", `<li>${message}</li>`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", { message: input.value });
    input.value = "";
  }
});
