export default async function handler(req, res) {
    const { service } = req.query;

    // Set CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "https://www.sheriffofpaddys.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight (OPTIONS) request
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // API URLs for Sonarr and Radarr
    const SONARR_API = "https://sonarr.sheriffofpaddys.com/api/v3/calendar?apikey=7134e36b80f644aaa872f2bbd4fc1c22";
    const RADARR_API = "https://radarr.sheriffofpaddys.com/api/v3/calendar?apikey=54af0e9ea31d4b47b28c2984d0f7846c";

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
        const contentType = response.headers.get("content-type");

        // Ensure the response is JSON
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Received non-JSON response:", await response.text());
            return res.status(500).json({ error: "API returned an invalid response (not JSON)" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("API Fetch Error:", error);
        return res.status(500).json({ error: error.message || "Failed to fetch data" });
    }
}