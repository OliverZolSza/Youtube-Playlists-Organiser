<?php
header('Content-Type: application/x-www-form-urlencoded');

$directoryPath = 'playlists';
$fileName = urldecode($_POST['fileName']);

$response = [];

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            $response = 'SUCCESS';
        } else {
            $response = 'ERROR';
        }
    } else {
        $response = 'ERROR';
    }

    echo $response;
} else {
    echo 'ERROR';
}
?>