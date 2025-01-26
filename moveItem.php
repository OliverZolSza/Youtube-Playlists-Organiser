<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $directoryPath = 'playlists';
    $moveToIndex = $_POST['moveto'];
    $moveIndex = $_POST['move'];
    if ($moveToIndex - $moveIndex == 1) {
        $moveToIndex -= 1;
    }
    $fileName = $_POST['fileName'];

    $response = '';

    if (is_dir($directoryPath)) {
        $filePath = $directoryPath . '/' . $fileName;

        if (is_file($filePath)) {
            $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if (isset($lines[$moveIndex])) {
                $value = $lines[$moveIndex];
                unset($lines[$moveIndex]);
                $lines = array_values($lines);
                array_splice($lines, $moveToIndex, 0, $value);
                $lines = array_values($lines);
                $result = file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
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
} else {
    echo "Please submit the form with POST.";
}

?>