<?php
file_put_contents(__DIR__ . '/debug_photo.txt', "photo_handler.php hit\n", FILE_APPEND);

$data = $_POST['Photo'];
$index = $_POST['PhotoIndex'];
$timestamp = date('Y-m-d_H-i-s');

if (!empty($data)) {
    $dir = __DIR__ . '/../../db/photos/';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }

    list($type, $data) = explode(';', $data);
    list(, $data) = explode(',', $data);
    $data = base64_decode($data);

    $filename = $dir . 'cam_' . $timestamp . '_' . $index . '.jpg';
    file_put_contents($filename, $data);

    $log_file = __DIR__ . '/../../logs/photo.txt';
    file_put_contents($log_file, "Photo Saved : " . basename($filename) . "\n", FILE_APPEND);
}
?>