<?php
header('Content-Type: application/json');

$directoryPath = 'playlists';
$lineToRemove = $_POST['index'];
$fileName = $_POST['fileName'];
$response = [];

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (is_file($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (isset($lines[$lineToRemove])) {
            unset($lines[$lineToRemove]);
            $lines = array_values($lines);
            file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
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
