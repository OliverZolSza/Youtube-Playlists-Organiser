<?php
header('Content-Type: application/x-www-form-urlencoded');

$directoryPath = 'playlists';
$fileName = urldecode($_POST['fileName']);
$newName = urldecode($_POST['newName']);

$response = [];

if (is_dir($directoryPath)) {
    $oldfilePath = $directoryPath . '/' . $fileName;
    $newFilePath = $directoryPath . '/' . $newName;

    if (rename($oldFilePath, $newFilePath)) {
        $response = 'SUCCESS';
    } else {
        $response = 'ERROR';
    }

    echo $response;
} else {
    echo 'Directory not found.';
}
?>