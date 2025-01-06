// Plex Server Configuration
const PLEX_URL = "https://108.4.212.114:32400"; // Plex server URL
const PLEX_TOKEN = "yvrB6w9_AfPEsvbjS4KL"; // Replace this with your actual Plex token

// Radarr Configuration
const SERVER_IP = "108.4.212.114"; // Server IP for Radarr and Sonarr
const RADARR_PORT = "7878"; // Default Radarr port
const RADARR_API_KEY = "5c6b0e2559344f8ba928b16bdb599a40"; // Radarr API key

// Sonarr Configuration
const SONARR_PORT = "8989"; // Default Sonarr ports
const SONARR_API_KEY = "ce6baebf009e427183f39a5bc554e384"; // Sonarr API key


/*****************************************************
 * PLEX SERVER STATUS with Active Streams
 *****************************************************/
async function updatePlexStatus() {
  const plexStatusElement = document.getElementById("plex-status");
  if (!plexStatusElement) {
    console.warn("No #plex-status element found. Skipping Plex status update.");
    return;
  }

  try {
    const response = await fetch(`https://108.4.212.114:32400/status/sessions?X-Plex-Token=${PLEX_TOKEN}`, {
      method: "GET",
      mode: "cors",
    });

    console.log("Plex Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch Plex status. HTTP Status: ${response.status}`);
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const mediaContainer = xmlDoc.querySelector("MediaContainer");
    const streamCount = parseInt(mediaContainer?.getAttribute("size") || "0", 10);

    plexStatusElement.innerHTML =
      streamCount > 0
        ? `Status: <span style="color: #4caf50;">Online</span> – Active Streams: <span style="color: #4caf50;">${streamCount}</span>`
        : `Status: <span style="color: #4caf50;">Online</span> – No Active Streams`;
  } catch (error) {
    console.error("Error fetching Plex status:", error);
    plexStatusElement.innerHTML = 'Status: <span style="color: #f44336;">Offline</span>';
  }
}

/*****************************************************
 * RADARR UPCOMING MOVIES
 *****************************************************/
async function fetchRadarrMovies() {
  const radarrList = document.getElementById("radarr-list");
  if (!radarrList) {
    console.warn("No #radarr-list element found. Skipping Radarr update.");
    return;
  }

  try {
    const today = new Date().toISOString();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const endDate = nextMonth.toISOString();

    const response = await fetch(`https://108.4.212.114:7878/api/v3/calendar?apikey=5c6b0e2559344f8ba928b16bdb599a40&start=${today}&end=${endDate}`);
    console.log("Radarr Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch Radarr movies. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    radarrList.innerHTML = ""; // Clear placeholder

    if (data.length === 0) {
      radarrList.textContent = "No upcoming movies found.";
      return;
    }

    data.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = `${movie.title} (Releases: ${new Date(movie.physicalRelease).toLocaleDateString()})`;
      radarrList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching Radarr movies:", error);
    radarrList.textContent = "Error loading movies.";
  }
}

/*****************************************************
 * SONARR UPCOMING SHOWS
 *****************************************************/
async function fetchSonarrShows() {
  const sonarrList = document.getElementById("sonarr-list");
  if (!sonarrList) {
    console.warn("No #sonarr-list element found. Skipping Sonarr update.");
    return;
  }

  try {
    const today = new Date().toISOString();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const endDate = nextMonth.toISOString();

    const response = await fetch(`https://108.4.212.114:8989/api/v3/calendar?apikey=ce6baebf009e427183f39a5bc554e384&start=${today}&end=${endDate}`);
    console.log("Sonarr Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch Sonarr shows. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    sonarrList.innerHTML = ""; // Clear placeholder

    if (data.length === 0) {
      sonarrList.textContent = "No upcoming shows found.";
      return;
    }

    data.forEach(show => {
      const li = document.createElement("li");
      li.textContent = `${show.series.title} S${show.seasonNumber}E${show.episodeNumber} - ${show.title} (Airs: ${new Date(show.airDateUtc).toLocaleDateString()})`;
      sonarrList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching Sonarr shows:", error);
    sonarrList.textContent = "Error loading shows.";
  }
}

/*****************************************************
 * INITIALIZATION
 *****************************************************/
updatePlexStatus();
fetchRadarrMovies();
fetchSonarrShows();