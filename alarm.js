const Now = document.querySelector("#current");
const hrs = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const type = document.querySelector("#am-pm");
const alarmButton = document.querySelector("#submit-btn");
const container = document.querySelector("#alarms-container");
window.addEventListener("DOMContentLoaded", (event) => {
  menu(1, 12, hrs);
  menu(0, 59, minutes);
  menu(0, 59, seconds);
  setInterval(getTime, 1000);
  fetchAllAlarm();
});

// Event Listener added to Set Alarm Button
alarmButton.addEventListener("click", Input);


function menu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  Now.innerHTML = time;

  return time;
}


function Input(e) {
  e.preventDefault();
  const hourValue = hrs.value;
  const minuteValue = minutes.value;
  const secondValue = seconds.value;
  const amPmValue = type.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  SetAlarm(alarmTime);
}

function convertToTime(hrs, mins, secs, AmPm) {
  return  `${parseInt(hrs)}:${mins}:${secs} ${AmPm}`;
}


function SetAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    // console.log("time",time);
    // console.log("gettime" ,getTime());
    //checking alarm set time and current time is euqal or not , if yes alert willl be poppedup
    if (time === getTime()) {
      alert("Alarm Ringing");
      console.log("uth jaoo");
    }
    //else runnning
    console.log("running");
  }, 500);

  domAlarm(time, alarm);
  if (!fetching) {
    //saveed alarm
    saveAlarm(time);
  }
}

function domAlarm(time, intervalId) {
  const alarm = document.createElement("div");
  //adding class in new div
  alarm.classList.add("alarm", "mb", "d-flex");

  //addding class in new div
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn alarm-delete" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".alarm-delete");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  container.prepend(alarm);
}

function prevAlarms() {
  let alarms = [];

  //getting all alarms from local storage
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
//returning  all previous alarm 
  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  //saving curr alarm plus previous alarm
  const settingAlarm = prevAlarms();

  //pushing current set alarm into stack
  settingAlarm.push(time);

  //saving every aalrm in localstorage
  localStorage.setItem("alarms", JSON.stringify(settingAlarm));
}

// Fetching alarms from local storage
function fetchAllAlarm() {
  const settingAlarm = prevAlarms();
  settingAlarm.forEach((time) => {
    SetAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const item = event.target;
  clearInterval(intervalId);
  const alarm = item.parentElement;
  console.log(time);
  
 //sending alarm time which we want to delete from localstorage and call delete method
  deleteAlarmFromLocal(time);

  //removing 
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = prevAlarms();

  const index = alarms.indexOf(time);

  //checking time of alarm and deleting from localstorage
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}