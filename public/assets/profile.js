events();
const data = JSON.parse(localStorage.getItem("userdetails"));

const token = data.token;

if (!data) {
  redirect: window.location.href = "./index.html";
} else {
  let user_details = `
  <h2 style="margin:10px">${data.user.firstname}</h2>
  <p style="text-align: center";> ${data.user.department} </p>`;
  document.getElementById("user").innerHTML = user_details;
}

function events() {
  let imgsrc = "./assets/images/calendar.svg";
  let eventDiv = "";
  fetch("http://localhost:4000/api/event", {
    method: "GET",
    // mode: 'no-cors',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("events", JSON.stringify(data));
      data.forEach(event => {
        const { _id, name, eventType, description, activity, status } = event;
        if (status == "active"){
        eventDiv += `<div class=events>
       
        <span> 
         <i class="fa fa-calendar" style="color: white; margin: 10px;"></i>
        <h3 style="margin:10px;"> ${name}</h3>
        </span>
        <div class="dropdown">
        <button type="button" id="view" class="dropbtn"  style="margin:"10px"> View </button>
        <div class="dropdown-content">
          <p> Event Type: ${eventType}</p>
          <p> Status: ${status}</p>
          <p id = activity> Activity: ${activity}</p>
          <button id="${_id}" class="checkinbtn" onclick="checkin(this)">Checkin</button>
          </div>
          </div>
        
       </div>`;
        }
      });
      document.getElementById("events-container").innerHTML = eventDiv;
    })
    .catch(error => {
      console.log(error);
    });
}
let mainNav = document.getElementById("js-menu");
let event= document.getElementById("events");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function () {
  mainNav.classList.toggle("active");
  event.classList.add("fullwidth");
});
function useranswers() {

}
function logout() {
  localStorage.clear();
  redirect: window.location.href = "./index.html";
}
