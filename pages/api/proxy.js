export default async function handler(req, res) {
  console.log("🔹 API function started. Request query:", req.query);

  const { service } = req.query;

  // Validate service parameter
  if (!service) {
    console.error("❌ Missing service parameter");
    return res
      .status(400)
      .json({
        error: "Missing service parameter. Use ?service=sonarr, ?service=radarr, or ?service=uptimekuma",
      });
  }

  console.log(`🔹 Fetching data for: ${service}`);

  // We'll set up start/end only for Sonarr and Radarr
  const today = new Date();

  // 1 month earlier
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const start = oneMonthAgo.toISOString().split("T")[0]; // format: YYYY-MM-DD

  // 3 months later
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const end = threeMonthsLater.toISOString().split("T")[0];

  // Base API URLs
  const SONARR_API_BASE = "https://sonarr.sheriffofpaddys.com/api/v3/calendar";
  const RADARR_API_BASE = "https://radarr.sheriffofpaddys.com/api/v3/calendar";
  const UPTIMEKUMA_API_BASE = "https://uptime.sheriffofpaddys.com/api/v1/monitors";

  let apiUrl = "";
  try {
    if (service === "sonarr") {
      // Sonarr's calendar w/ date range
      apiUrl = `${SONARR_API_BASE}?apikey=7134e36b80f644aaa872f2bbd4fc1c22&start=${start}&end=${end}&includeSeries=true`;
    } else if (service === "radarr") {
      // Radarr's calendar w/ date range
      apiUrl = `${RADARR_API_BASE}?apikey=54af0e9ea31d4b47b28c2984d0f7846c&start=${start}&end=${end}`;
    } else if (service === "uptimekuma") {
      // Uptime Kuma (adjust path/params if needed)
      apiUrl = `${UPTIMEKUMA_API_BASE}?api_key=uk4_XgjEbDIJlwLvNsjSjzHRBAQzFwDj16d1IEUuQIzt`;
    } else {
      console.error("❌ Invalid service type:", service);
      return res.status(400).json({
        error:
          "Invalid service. Use ?service=sonarr or ?service=radarr or ?service=uptimekuma",
      });
    }

    console.log(`🔹 Making request to: ${apiUrl}`);

    const response = await fetch(apiUrl, { redirect: "manual" });
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      return res
        .status(response.status)
        .json({ error: `API Error: ${response.status}`, details: errorText });
    }

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("❌ Non-JSON Response:", textResponse);
      return res.status(500).json({
        error: "Invalid response type (not JSON)",
        response: textResponse,
      });
    }

    const data = await response.json();
    console.log("✅ API response received.", Array.isArray(data) ? `Items: ${data.length}` : data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  }
}