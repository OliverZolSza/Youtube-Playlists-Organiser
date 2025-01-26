<?php
header('Content-Type: application/x-www-form-urlencoded');

$directoryPath = 'playlists';
$fileName = urldecode($_POST['fileName']);

$response = [];

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (touch($filePath)) {
        $response = 'SUCCESS';
    } else {
        $response = 'ERROR';
    }

    echo $response;
} else {
    echo 'Directory not found.';
}
?>