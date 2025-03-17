export default async function handler(req, res) {
    console.log("🔹 API function started. Request query:", req.query);

    const { service } = req.query;

    // Validate service parameter
    if (!service) {
        console.error("❌ Missing service parameter");
        return res.status(400).json({ error: "Missing service parameter. Use ?service=sonarr or ?service=radarr" });
    }

    console.log(`🔹 Fetching data for: ${service}`);

    // API URLs for Sonarr and Radarr
    const SONARR_API = "https://sonarr.sheriffofpaddys.com/api/v3/calendar?apikey=7134e36b80f644aaa872f2bbd4fc1c22";
    const RADARR_API = "https://radarr.sheriffofpaddys.com/api/v3/calendar?apikey=54af0e9ea31d4b47b28c2984d0f7846c";

    let apiUrl = "";
    if (service === "sonarr") {
        apiUrl = SONARR_API;
    } else if (service === "radarr") {
        apiUrl = RADARR_API;
    } else {
        console.error("❌ Invalid service type:", service);
        return res.status(400).json({ error: "Invalid service. Use ?service=sonarr or ?service=radarr" });
    }

    console.log(`🔹 Making request to: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, { redirect: "manual" }); // Prevent unexpected redirects
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} - ${errorText}`);
            return res.status(response.status).json({ error: `API Error: ${response.status}`, details: errorText });
        }

        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.error("❌ Non-JSON Response:", textResponse);
            return res.status(500).json({ error: "Invalid response type (not JSON)", response: textResponse });
        }

        const data = await response.json();
        console.log("✅ API response received. Items:", data.length);
        return res.status(200).json(data);
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        return res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
}