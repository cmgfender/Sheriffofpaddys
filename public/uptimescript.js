// uptimescript.js
document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Call through your proxy to get data from uptime.sheriffofpaddys.com
      const response = await fetch("/api/proxy?service=uptimekuma");
      if (!response.ok) {
        throw new Error(`Network response was not OK: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Grab the container where we’ll display the uptime info
      const uptimeContainer = document.getElementById("uptimekuma-status");
      // Display the JSON or parse it as you wish:
      uptimeContainer.textContent = JSON.stringify(data, null, 2);
  
      // If you want to style or parse data differently, do so here.
      // For instance, loop through monitors, create elements, etc.
      // Example:
      // data.forEach(monitor => {
      //   const monitorItem = document.createElement("div");
      //   monitorItem.textContent = monitor.name + " - " + monitor.status;
      //   uptimeContainer.appendChild(monitorItem);
      // });
    } catch (err) {
      console.error("Error fetching UptimeKuma data:", err);
    }
  });