<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$directoryPath = 'playlists';
$data = json_decode(file_get_contents('php://input'), true);
$fileName = $data['fileName'];

$response = [];

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (touch($filePath)) {
        echo json_encode(['success' => 'success']);
    } else {
        echo json_encode(['error' => 'error']);
    }

} else {
    echo json_encode(['error' => 'Directory not found.']);
}
?>