<?php

$response = '';
$directoryPath = 'playlists';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fileName = $_POST['fileName'];
    $textData = $_POST['text'];

    
    if (is_dir($directoryPath)) {
        $filePath = $directoryPath . '/' . $fileName;

        if (is_file($filePath)) {
            $response = 'ERROR';
        } else {
            if (touch($filePath)) {
                if (is_file($filePath)) {
                    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    array_push($lines, $textData);
                    $lines = array_values($lines);
                    $result = file_put_contents($filePath, implode(PHP_EOL, $lines) . PHP_EOL);
                    $response = 'SUCCESS';
                } else {
                    $response = 'ERROR';
                }
            } else {
                $response = 'ERROR';
            }
        }
    } else {
        echo 'ERROR';
    }
} else {
    $reponse = "ERROR";
}


echo $reponse;

?>