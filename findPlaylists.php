<?php
header('Content-Type: application/json');

$directoryPath = 'playlists';
$response = [];

if (is_dir($directoryPath)) {
    $files = scandir($directoryPath);

    $response = $files;

    echo json_encode(['fileNames' => $response]);
} else {
    echo json_encode(['error' => 'Directory not found.']);
}
?>