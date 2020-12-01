const socket = io();
const chatForm = document.getElementById("chat-form");
const ChatFormInput = document.getElementById("chat-box-input");
const output = document.getElementsByClassName("output");
const LocationButton = document.getElementById("location-button");
const FormSubmitButton = document.getElementById("form-submit-button");
const $messages = document.getElementById("messages");
const $myLocation = document.getElementById("location");

// Templates
const MessageTemplate = document.getElementById("message-template").innerHTML;
const LocationTemplate = document.getElementById("my-location-template")
  .innerHTML;

//Options

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("NewUser", (str) => {
  console.log("🚀 ~ file: chat.js ~ line 13 ~ socket.on ~ str", { str });
});

function HandleSubmit(e) {
  e.preventDefault();
  FormSubmitButton.setAttribute("disabled", "disabled");
  //   const value = document.getElementById("chat-box").value;
  const value = e.target.elements.message.value;

  socket.emit("newMessage", value, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Message Delivered");
  });
  FormSubmitButton.removeAttribute("disabled");
  ChatFormInput.value = "";
  ChatFormInput.focus();
}

chatForm.addEventListener("submit", HandleSubmit);

LocationButton.addEventListener("click", () => {
  const GeoLocation = navigator.geolocation;
  if (!GeoLocation) alert("Your Browser does not support Geolocation");
  LocationButton.setAttribute("disabled", "disabled");
  GeoLocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
  LocationButton.removeAttribute("disabled");
});

socket.on("message", (message) => {
  const html = Mustache.render(MessageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("LocationMessage", (data) => {
  const html = Mustache.render(LocationTemplate, {
    url: data.url,
    createdAt: moment(data.createdAt).format("h:mm a"),
  });
  $myLocation.insertAdjacentHTML("beforeend", html);
});

socket.emit("join", { username, room });
