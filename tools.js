// Plex Server Configuration
const PLEX_URL = "http://108.4.212.114:32400"; // Plex server URL
const PLEX_TOKEN = "your-plex-token"; // Replace this with your actual Plex token

// Radarr Configuration
const SERVER_IP = "108.4.212.114"; // Server IP for Radarr and Sonarr
const RADARR_PORT = "7878"; // Default Radarr port
const RADARR_API_KEY = "5c6b0e2559344f8ba928b16bdb599a40"; // Radarr API key

// Sonarr Configuration
const SONARR_PORT = "8989"; // Default Sonarr port
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
    const response = await fetch(`${PLEX_URL}/status/sessions?X-Plex-Token=${PLEX_TOKEN}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    console.log('Plex Response Status:', response.status);

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
    plexStatusElement.innerHTML =
      'Status: <span style="color: #f44336;">Offline</span>';
  }
}

/*****************************************************
 * RADARR UPCOMING MOVIES
 *****************************************************/
async function fetchRadarrMovies() {
  try {
    const response = await fetch(`http://${SERVER_IP}:${RADARR_PORT}/api/v3/calendar?apikey=${RADARR_API_KEY}`);
    console.log('Radarr Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch Radarr movies. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    const radarrList = document.getElementById("radarr-list");

    radarrList.innerHTML = ""; // Clear placeholder
    data.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = `${movie.title} (Releases: ${new Date(movie.physicalRelease).toLocaleDateString()})`;
      radarrList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching Radarr movies:", error);
    document.getElementById("radarr-list").textContent = "Error loading movies.";
  }
}

/*****************************************************
 * SONARR UPCOMING SHOWS
 *****************************************************/
async function fetchSonarrShows() {
  try {
    const response = await fetch(`http://${SERVER_IP}:${SONARR_PORT}/api/v3/calendar?apikey=${SONARR_API_KEY}`);
    console.log('Sonarr Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch Sonarr shows. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    const sonarrList = document.getElementById("sonarr-list");

    sonarrList.innerHTML = ""; // Clear placeholder
    data.forEach(show => {
      const li = document.createElement("li");
      li.textContent = `${show.series.title} S${show.seasonNumber}E${show.episodeNumber} - ${show.title} (Airs: ${new Date(show.airDateUtc).toLocaleDateString()})`;
      sonarrList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching Sonarr shows:", error);
    document.getElementById("sonarr-list").textContent = "Error loading shows.";
  }
}