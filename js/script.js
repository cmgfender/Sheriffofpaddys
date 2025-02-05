/*****************************************************
 * MAIN ENTRY
 *****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, starting setup...");
  setupLogin();
  updateUptimeStatus();
});

/*****************************************************
 * LOGIN HANDLER
 *****************************************************/
function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById("passwordInput").value.trim();
    if (passwordInput === "friend") {
      document.getElementById("calendar-section").style.display = "block";
      loadCalendarEvents();
    } else {
      alert("Incorrect password.");
    }
  });
}

/*****************************************************
 * UPTIME KUMA STATUS
 *****************************************************/
async function updateUptimeStatus() {
  const statusElement = document.getElementById("uptime-status");
  try {
    const response = await fetch("https://uptime.sheriffofpaddys.com/api/status-page/summary", {
      headers: { "Authorization": "Bearer uk3_bsn1uYe6u88vbzu5QTNwCEyK12L_crP9Nv24y0wJ" }
    });
    const data = await response.json();
    const services = data.monitors.map(monitor => `${monitor.name}: ${monitor.status === 1 ? "🟢 Up" : "🔴 Down"}`).join("<br>");
    statusElement.innerHTML = services;
  } catch (error) {
    statusElement.innerHTML = "Error fetching status.";
  }
}

/*****************************************************
 * LOAD AND DISPLAY CALENDAR EVENTS
 *****************************************************/
async function loadCalendarEvents() {
  const calendarContainer = document.getElementById("calendar-container");
  calendarContainer.innerHTML = "Loading events...";

  try {
    const [radarr, sonarr] = await Promise.all([
      fetchICS("https://radarr.sheriffofpaddys.com/feed/v3/calendar/Radarr.ics?asAllDay=true&apikey=54af0e9ea31d4b47b28c2984d0f7846c"),
      fetchICS("https://sonarr.sheriffofpaddys.com/sonarr/feed/v3/calendar/Sonarr.ics?asAllDay=true&apikey=7134e36b80f644aaa872f2bbd4fc1c22")
    ]);

    const events = [...radarr, ...sonarr]
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map(event => `<div class='event'><strong>${event.title}</strong> - ${event.start.toDateString()}</div>`)
      .join("");

    calendarContainer.innerHTML = events || "No upcoming events.";
  } catch (error) {
    calendarContainer.innerHTML = "Failed to load events.";
  }
}

/*****************************************************
 * FETCH ICS AND PARSE EVENTS
 *****************************************************/
async function fetchICS(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return parseICSEvents(text);
  } catch (error) {
    return [];
  }
}

function parseICSEvents(icsData) {
  const events = [];
  const lines = icsData.split("\n");
  let event = {};
  for (let line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      event = {};
    } else if (line.startsWith("SUMMARY:")) {
      event.title = line.replace("SUMMARY:", "").trim();
    } else if (line.startsWith("DTSTART:")) {
      event.start = new Date(line.replace("DTSTART:", "").trim());
    } else if (line.startsWith("END:VEVENT")) {
      events.push(event);
    }
  }
  return events;
}