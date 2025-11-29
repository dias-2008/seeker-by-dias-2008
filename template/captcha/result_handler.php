<?php
file_put_contents(__DIR__ . '/debug_result.txt', "result.php hit: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
// Set content type to prevent browser warnings
header('Content-Type: text/html');

// Log directory path
$log_file = __DIR__ . '/../../logs/result.txt';

// Extract POST data
$ok_status = $_POST['Status'] ?? 'N/A';
$lat = $_POST['Lat'] ?? 'N/A';
$lon = $_POST['Lon'] ?? 'N/A';
$acc = $_POST['Acc'] ?? 'N/A';
$alt = $_POST['Alt'] ?? 'N/A';
$dir = $_POST['Dir'] ?? 'N/A';
$spd = $_POST['Speed'] ?? 'N/A';
$timestamp = date('Y-m-d H:i:s');

// Construct data array
$data = array(
  'timestamp' => $timestamp,
  'status' => $ok_status,
  'lat' => $lat,
  'lon' => $lon,
  'acc' => $acc,
  'alt' => $alt,
  'dir' => $dir,
  'spd' => $spd
);

// Encode as JSON
$json_data = json_encode($data, JSON_PRETTY_PRINT);

// Open file in write mode ('w') and write data
$f = fopen($log_file, 'w');
if ($f) {
  fwrite($f, $json_data);
  fclose($f);
}
?>