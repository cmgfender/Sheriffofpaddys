document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/proxy?service=uptimekuma");
    if (!response.ok) {
      throw new Error(`Network response was not OK: ${response.status}`);
    }

    const data = await response.json();
    const uptimeContainer = document.getElementById("uptimekuma-status");
    uptimeContainer.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error("Error fetching UptimeKuma data:", err);
    const uptimeContainer = document.getElementById("uptimekuma-status");
    uptimeContainer.textContent = "Error fetching uptime data.";
  }
});