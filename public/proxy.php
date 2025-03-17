<?php
// Allow all domains to access this script
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

// API URLs for Sonarr and Radarr
$sonarr_url = "http://172.17.0.14:8989/api/v3/calendar?apikey=7134e36b80f644aaa872f2bbd4fc1c22";
$radarr_url = "http://172.17.0.10:7878/api/v3/calendar?apikey=54af0e9ea31d4b47b28c2984d0f7846c";

// Determine which service to fetch
$service = isset($_GET['service']) ? $_GET['service'] : '';

if ($service === "sonarr") {
    $api_url = $sonarr_url;
} elseif ($service === "radarr") {
    $api_url = $radarr_url;
} else {
    echo json_encode(["error" => "Invalid service specified. Use ?service=sonarr or ?service=radarr"]);
    exit;
}

// Fetch API Data
$response = file_get_contents($api_url);

// Return API response
echo $response;
?>