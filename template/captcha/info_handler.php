<?php
file_put_contents(__DIR__ . '/debug_info.txt', "info.php hit: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
// Set content type to prevent browser warnings
header('Content-Type: text/html');

// Log directory path (based on user's relative path)
$log_file = __DIR__ . '/../../logs/info.txt';

// Function to safely get the user's IP address (from original file)
function getUserIP()
{
  if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
    $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
  }
  $client = @$_SERVER['HTTP_CLIENT_IP'];
  $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
  $remote = $_SERVER['REMOTE_ADDR'];

  if (filter_var($client, FILTER_VALIDATE_IP)) {
    $ip = $client;
  } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
    $ip = $forward;
  } else {
    $ip = $remote;
  }
  return $ip;
}

// Extract POST data - accept individual fields
$ptf = $_POST['Ptf'] ?? 'N/A';
$brw = $_POST['Brw'] ?? 'N/A';
$cc = $_POST['Cc'] ?? 'N/A';
$ram = $_POST['Ram'] ?? 'N/A';
$ven = $_POST['Ven'] ?? 'N/A';
$ren = $_POST['Ren'] ?? 'N/A';
$ht = $_POST['Ht'] ?? 'N/A';
$wd = $_POST['Wd'] ?? 'N/A';
$os = $_POST['Os'] ?? 'N/A';
$lang = $_POST['Language'] ?? 'N/A';
$cookie = $_POST['Cookies'] ?? 'N/A';
$tz = $_POST['Timezone'] ?? 'N/A';

$ip = getUserIP();
$timestamp = date('Y-m-d H:i:s');

// Construct data array
$data = array(
  'timestamp' => $timestamp,
  'ip' => $ip,
  'platform' => $ptf,
  'browser' => $brw,
  'cores' => $cc,
  'ram' => $ram,
  'vendor' => $ven,
  'render' => $ren,
  'ht' => $ht,
  'wd' => $wd,
  'os' => $os,
  'language' => $lang,
  'cookies' => $cookie,
  'timezone' => $tz
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