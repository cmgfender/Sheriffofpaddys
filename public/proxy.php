<?php
// Get the requested service from the URL
$service = isset($_GET['service']) ? $_GET['service'] : '';

// Set correct CORS headers
header("Access-Control-Allow-Origin: https://sheriffofpaddys.com");  // Use your main domain
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

// API URLs
$sonarr_url = "http://172.17.0.14:8989/api/v3/calendar?apikey=YOUR_SONARR_API_KEY";
$radarr_url = "http://172.17.0.10:7878/api/v3/calendar?apikey=YOUR_RADARR_API_KEY";

// Choose API based on service parameter
if ($service === "sonarr") {
    $api_url = $sonarr_url;
} elseif ($service === "radarr") {
    $api_url = $radarr_url;
} else {
    echo json_encode(["error" => "Invalid service specified. Use ?service=sonarr or ?service=radarr"]);
    exit;
}

// Fetch API Data
$options = [
    "http" => [
        "header" => "User-Agent: PHP Proxy"
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($api_url, false, $context);

// Ensure proper response headers
if ($response === FALSE) {
    echo json_encode(["error" => "Failed to fetch data"]);
} else {
    echo $response;
}
?>