// Configuration
const SERVER_IP = "108.4.212.114"; // Replace if needed
const RADARR_PORT = 7878; // Default Radarr port
const SONARR_PORT = 8989; // Default Sonarr port
const RADARR_API_KEY = "5c6b0e2559344f8ba928b16bdb599a40";
const SONARR_API_KEY = "ce6baebf009e427183f39a5bc554e384";
const PLEX_URL = "https://192-168-68-50.820699f2276e43b99e6e530a900c4ca0.plex.direct:32400";
const PLEX_TOKEN = "xmq2Ucn2L3fGrZy1SoJq";

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
    });

    if (!response.ok) {
      throw new Error("Unable to reach Plex server.");
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const mediaContainer = xmlDoc.querySelector("MediaContainer");
    const streamCount = parseInt(mediaContainer?.getAttribute("size") || "0", 10);

    if (streamCount > 0) {
      plexStatusElement.innerHTML = `
        Status: <span style="color: #4caf50;">Online</span> – 
        Active Streams: <span style="color: #4caf50;">${streamCount}</span>`;
    } else {
      plexStatusElement.innerHTML = `
        Status: <span style="color: #4caf50;">Online</span> – 
        No Active Streams`;
    }
  } catch (error) {
    console.error("Error fetching Plex status:", error);
    plexStatusElement.innerHTML = 'Status: <span style="color: #f44336;">Offline</span>';
  }
}

/*****************************************************
 * RADARR UPCOMING MOVIES
 *****************************************************/
async function fetchRadarrMovies() {
  try {
    const response = await fetch(`http://${SERVER_IP}:${RADARR_PORT}/api/v3/calendar?apikey=${RADARR_API_KEY}`);
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
    const data = await response.json();
    const sonarrList = document.getElementById("sonarr-list");

    sonarrList.innerHTML = ""; // Clear placeholder
    data.forEach(show => {
      const li = document.createElement("li");
      li.textContent = `
        ${show.series.title} S${show.seasonNumber}E${show.episodeNumber} - 
        ${show.title} (Airs: ${new Date(show.airDateUtc).toLocaleDateString()})`;
      sonarrList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching Sonarr shows:", error);
    document.getElementById("sonarr-list").textContent = "Error loading shows.";
  }
}

/*****************************************************
 * INIT
 *****************************************************/
updatePlexStatus();
fetchRadarrMovies();
fetchSonarrShows();