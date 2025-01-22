<?php
header('Content-Type: application/x-www-form-urlencoded');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$directoryPath = 'playlists';
$lineToRemove = urldecode($_POST['index']);
$fileName = urldecode($_POST['fileName']);

$response = [];

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (is_file($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (isset($lines[$lineToRemove])) {
            unset($lines[$lineToRemove]);
            $lines = array_values($lines);
            $result = file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
            //MAKE SURE PLAYLIST FILES HAVE CORRECT PERMISSIONS
            $response = 'SUCCESS? ' . var_export($result, true);
        } else {
            $response = 'ERROR: ' . isset($lines[$lineToRemove]);
        }
    } else {
        $response = 'ERROR: ' . $filePath;
    }

    echo $response;
} else {
    echo 'Directory not found.';
}
?>
