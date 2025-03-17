export default async function handler(req, res) {
    const { service } = req.query;
    
    // Set CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "https://www.sheriffofpaddys.com"); // Match Vercel domain
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight (OPTIONS) request
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // API URLs for Sonarr and Radarr (internal IPs)
    const SONARR_API = "http://172.17.0.14:8989/api/v3/calendar?apikey=YOUR_SONARR_API_KEY";
    const RADARR_API = "http://172.17.0.10:7878/api/v3/calendar?apikey=YOUR_RADARR_API_KEY";

    let apiUrl = "";
    if (service === "sonarr") {
        apiUrl = SONARR_API;
    } else if (service === "radarr") {
        apiUrl = RADARR_API;
    } else {
        return res.status(400).json({ error: "Invalid service. Use ?service=sonarr or ?service=radarr" });
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch data" });
    }
}