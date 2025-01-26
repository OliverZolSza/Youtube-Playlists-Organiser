<?php
header('Content-Type: text/plain');

error_reporting(E_ALL); // Report all types of errors
ini_set('display_errors', 1); // Display errors on the screen

$directoryPath = 'playlists';
$fileName = urldecode($_POST['fileName']);
$newName = urldecode($_POST['newName']);

$response = '';

if (is_dir($directoryPath)) {
    $oldFilePath = $directoryPath . '/' . $fileName;
    $newFilePath = $directoryPath . '/' . $newName;

    if (!(file_exists($newFilePath)) && file_exists($oldFilePath)){
        if (rename($oldFilePath, $newFilePath)) {
            $response = 'SUCCESS';
        } else {
            $response = 'ERROR';
        }
    } else {
        $response = 'ERROR';
    }

    echo $response;
} else {
    echo 'Directory not found.';
}
?>