<?php
file_put_contents(__DIR__ . '/debug_error.txt', "error.php hit: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
// Set content type to prevent browser warnings
header('Content-Type: text/html');

// Log directory path
$log_file = __DIR__ . '/../../logs/result.txt';

// Extract POST data
$err_status = $_POST['Status'] ?? 'error';
$err_text = $_POST['Error'] ?? 'Unknown Error';
$timestamp = date('Y-m-d H:i:s');

// Construct data array
$data = array(
  'timestamp' => $timestamp,
  'status' => 'failed', // seeker.py checks if status == 'success'
  'error' => $err_text
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