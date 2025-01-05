const SERVER_IP = "108.4.212.114"; // Replace with actual IP if needed
const RADARR_PORT = 7878; // Default Radarr port
const SONARR_PORT = 8989; // Default Sonarr port
const PLEX_PORT = 32400; // Default Plex port

const RADARR_API_KEY = "5c6b0e2559344f8ba928b16bdb599a40";
const SONARR_API_KEY = "ce6baebf009e427183f39a5bc554e384";
const PLEX_TOKEN = "xmq2Ucn2L3fGrZy1SoJq";
const PLEX_SERVER_URL = `https://${SERVER_IP}.820699f2276e43b99e6e530a900c4ca0.plex.direct:${PLEX_PORT}`;

// Fetch upcoming movies from Radarr
fetch(`http://${SERVER_IP}:${RADARR_PORT}/api/v3/calendar?apikey=${RADARR_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const radarrList = document.getElementById("radarr-list");
    radarrList.innerHTML = ""; // Clear placeholder
    data.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = `${movie.title} (Releases: ${new Date(movie.physicalRelease).toLocaleDateString()})`;
      radarrList.appendChild(li);
    });
  })
  .catch(err => console.error("Radarr fetch error:", err));

// Fetch upcoming TV shows from Sonarr
fetch(`http://${SERVER_IP}:${SONARR_PORT}/api/v3/calendar?apikey=${SONARR_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const sonarrList = document.getElementById("sonarr-list");
    sonarrList.innerHTML = ""; // Clear placeholder
    data.forEach(show => {
      const li = document.createElement("li");
      li.textContent = `${show.series.title} S${show.seasonNumber}E${show.episodeNumber} - ${show.title} (Airs: ${new Date(show.airDateUtc).toLocaleDateString()})`;
      sonarrList.appendChild(li);
    });
  })
  .catch(err => console.error("Sonarr fetch error:", err));

// Fetch Plex status
fetch(`${PLEX_SERVER_URL}/status/sessions?X-Plex-Token=${PLEX_TOKEN}`)
  .then(response => response.json())
  .then(data => {
    const plexStatus = document.getElementById("plex-status");
    const plexStreams = document.getElementById("plex-streams");
    const streams = data.MediaContainer.Metadata || [];

    plexStatus.textContent = `Server is online with ${streams.length} active stream(s).`;
    plexStreams.innerHTML = "";

    streams.forEach(stream => {
      const li = document.createElement("li");
      li.textContent = `${stream.title} (${stream.type})`;
      plexStreams.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Plex fetch error:", err);
    document.getElementById("plex-status").textContent = "Error fetching Plex status.";
  });