<?php
header('Content-Type: application/x-www-form-urlencoded');

$directoryPath = 'playlists';
$lineToAdd = urldecode($_POST['url']);
$fileName = urldecode($_POST['fileName']);

$response = '';

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (is_file($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        array_push($lines, $lineToAdd);
        $lines = array_values($lines);
        $result = file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
        $response = 'SUCCESS';
    } else {
        $response = 'ERROR';
    }

    echo $response;
} else {
    echo 'Directory not found.';
}
?>
