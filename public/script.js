let calendar;
let allEvents = [];
let isFetching = false;

function formatDateString(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "Unknown Date";
  return d.toLocaleString();
}

document.addEventListener("DOMContentLoaded", function() {
  const calendarEl = document.getElementById("calendar");
  const errorMessage = document.getElementById("errorMessage");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const eventModal = document.getElementById("eventModal");
  const modalClose = document.getElementById("modalClose");
  const themeToggle = document.getElementById("themeToggle");

  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

  // Show or hide the loading spinner
  function setLoading(state) {
    loadingOverlay.style.display = state ? "flex" : "none";
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

      if (!Array.isArray(sonarrResponse) || !Array.isArray(radarrResponse)) {
        throw new Error("API response is not an array");
      }

      const sonarrEvents = sonarrResponse.map(show => {
        const seriesTitle = show.seriesTitle || (show.series && show.series.title) || show.title || "Unknown Title";
        const hasFile = show.hasFile === true;
        return {
          id: `sonarr-${show.id || Math.random()}`,
          title: `${seriesTitle} - S${show.seasonNumber}E${show.episodeNumber}`,
          start: show.airDateUtc,
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

      const radarrEvents = radarrResponse.map(movie => {
        const hasFile = movie.hasFile === true;
        return {
          id: `radarr-${movie.id || Math.random()}`,
          title: movie.title,
          start: movie.digitalRelease,
          color: hasFile ? "green" : "#E91E63",
          extendedProps: {
            type: "movie",
            originalRelease: movie.inCinemas,
            hasFile: hasFile,
            overview: movie.overview || "No overview available"
          }
        };
      });

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
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === eventModal) {
      closeModal();
    }
  });

  function openModalForEvent(event) {
    document.getElementById("modalTitle").textContent = event.title;
    document.getElementById("modalDate").textContent = formatDateString(event.start);

    const type = event.extendedProps.type || "N/A";
    const hasFileText = event.extendedProps.hasFile ? "Yes" : "No";
    const overview = event.extendedProps.overview || "No overview available";

    document.getElementById("modalAdditional").innerHTML = `
      <strong>Type:</strong> ${type}<br>
      <strong>Has File:</strong> ${hasFileText}<br>
      <strong>Overview:</strong> ${overview}
    `;
    eventModal.classList.add("show");
  }

  function closeModal() {
    eventModal.classList.remove("show");
  }
});

// Filter events by search query
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

// Check login password via API
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
      document.getElementById("loginOverlay").style.display = "none";
      document.getElementById("mainContainer").classList.add("show");
    } else {
      loginError.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    loginError.textContent = 'Something went wrong. Try again.';
    loginError.style.display = 'block';
  }
}