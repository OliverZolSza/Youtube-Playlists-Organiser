<?php
header('Content-Type: application/x-www-form-urlencoded');

$directoryPath = 'playlists';
$lineToRemove = urldecode($_POST['index']);
$fileName = urldecode($_POST['fileName']);

$response = '';

if (is_dir($directoryPath)) {
    $filePath = $directoryPath . '/' . $fileName;

    if (is_file($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES);
        if (isset($lines[$lineToRemove])) {
            $lines[$lineToRemove] = "";
            //unset($lines[$lineToRemove]);
            $lines = array_values($lines);
            $result = file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
            //MAKE SURE PLAYLIST FILES HAVE CORRECT PERMISSIONS
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
