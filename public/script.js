let calendar;
let allEvents = [];
let isFetching = false;

// Utility function to format date/time for tooltip or modal
function formatDateString(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "Unknown Date";
  return d.toLocaleString();
}

document.addEventListener("DOMContentLoaded", function() {
  const calendarEl = document.getElementById("calendar");
  const errorMessage = document.getElementById("errorMessage");

  // Show or hide the loading spinner
  function setLoading(state) {
    document.getElementById("loadingOverlay").style.display = state ? "flex" : "none";
  }

  // Initialize FullCalendar
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,listWeek,timeGridDay"
    },
    dayMaxEventRows: 3,
    moreLinkContent: (args) => `+ ${args.num} more`,
    windowResize: function(view) {
      if (window.innerWidth < 600 && view.type !== "listWeek") {
        calendar.changeView("listWeek");
      } else if (window.innerWidth >= 600 && view.type !== "dayGridMonth") {
        calendar.changeView("dayGridMonth");
      }
    },
    eventDidMount: function(info) {
      const tooltipEl = document.createElement("div");
      tooltipEl.classList.add("fc-tooltip");
      const dateStr = formatDateString(info.event.start);
      tooltipEl.innerHTML = `${info.event.title}<br><small>${dateStr}</small>`;
      info.el.appendChild(tooltipEl);
    },
    eventClick: function(info) {
      info.jsEvent.preventDefault();
      openModalForEvent(info.event);
    },
    events: []
  });

  calendar.render();

  // Use your Vercel proxy for data
  const BASE_URL = "https://www.sheriffofpaddys.com/api/proxy";
  const SONARR_PROXY_URL = `${BASE_URL}?service=sonarr`;
  const RADARR_PROXY_URL = `${BASE_URL}?service=radarr`;

  async function fetchReleases() {
    if (isFetching) return;
    isFetching = true;
    setLoading(true);

    try {
      const [sonarrResponse, radarrResponse] = await Promise.all([
        fetch(SONARR_PROXY_URL).then(res => {
          if (!res.ok) throw new Error(`Sonarr API Error: ${res.status}`);
          return res.json();
        }),
        fetch(RADARR_PROXY_URL).then(res => {
          if (!res.ok) throw new Error(`Radarr API Error: ${res.status}`);
          return res.json();
        })
      ]);

      console.log("Sonarr Data:", sonarrResponse);
      console.log("Radarr Data:", radarrResponse);

      if (!Array.isArray(sonarrResponse) || !Array.isArray(radarrResponse)) {
        throw new Error("API response is not an array");
      }

      // Process Sonarr events
      const sonarrEvents = sonarrResponse.map(show => {
        const seriesTitle = show.seriesTitle || (show.series && show.series.title) || show.title || "Unknown Title";
        const hasFile = show.hasFile === true;  // Check Sonarr's hasFile
        return {
          id: `sonarr-${show.id || Math.random()}`,
          title: `${seriesTitle} - S${show.seasonNumber}E${show.episodeNumber}`,
          start: show.airDateUtc,
          // If hasFile is true, color events green, otherwise use your normal Sonarr color
          color: hasFile ? "green" : "#2196F3",
          extendedProps: {
            type: "tv",
            season: show.seasonNumber,
            episode: show.episodeNumber,
            hasFile: hasFile,
            overview: show.overview || "No overview available"
          }
        };
      });

      // Process Radarr events
      const radarrEvents = radarrResponse.map(movie => {
        const hasFile = movie.hasFile === true; // Check Radarr's hasFile
        return {
          id: `radarr-${movie.id || Math.random()}`,
          title: movie.title,
          start: movie.digitalRelease,
          // If hasFile is true, color events green, otherwise use your normal Radarr color
          color: hasFile ? "green" : "#E91E63",
          extendedProps: {
            type: "movie",
            originalRelease: movie.inCinemas,
            hasFile: hasFile,
            overview: movie.overview || "No overview available"
          }
        };
      });

      // Combine and add events
      allEvents = [...sonarrEvents, ...radarrEvents];
      calendar.addEventSource(allEvents);
      calendar.updateSize();
    } catch (error) {
      console.error("Error fetching data:", error);
      errorMessage.style.display = "block";
      errorMessage.textContent = "Failed to load calendar data. Check console for details.";
    } finally {
      setLoading(false);
      isFetching = false;
    }
  }

  fetchReleases();

  // Modal handling for event details
  const eventModal = document.getElementById("eventModal");
  const modalClose = document.getElementById("modalClose");
  modalClose.addEventListener("click", () => {
    eventModal.style.display = "none";
  });

  function openModalForEvent(event) {
    document.getElementById("modalTitle").textContent = event.title;
    document.getElementById("modalDate").textContent = formatDateString(event.start);

    // Display extra details in the modal
    const type = event.extendedProps.type || "N/A";
    const hasFileText = event.extendedProps.hasFile ? "Yes" : "No";
    const overview = event.extendedProps.overview || "No overview available";

    // You can expand these fields further if you like
    document.getElementById("modalAdditional").innerHTML = `
      <strong>Type:</strong> ${type}<br>
      <strong>Has File:</strong> ${hasFileText}<br>
      <strong>Overview:</strong> ${overview}
    `;
    eventModal.style.display = "block";
  }
});

// Function to filter events by search query
function filterEvents() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  calendar.getEventSources().forEach(source => source.remove());
  if (!query) {
    calendar.addEventSource(allEvents);
  } else {
    const filtered = allEvents.filter(evt => evt.title.toLowerCase().includes(query));
    calendar.addEventSource(filtered);
  }
}

// Client-side function to check the password via our API
async function checkPassword() {
  const inputVal = document.getElementById("passwordInput").value.trim();
  const loginError = document.getElementById("loginError");

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: inputVal })
    });

    if (response.ok) {
      // Hide login overlay and show main content
      document.getElementById("loginOverlay").style.display = "none";
      document.getElementById("mainContainer").classList.add("show");
    } else {
      // Incorrect password
      loginError.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    loginError.textContent = 'Something went wrong. Try again.';
    loginError.style.display = 'block';
  }
}