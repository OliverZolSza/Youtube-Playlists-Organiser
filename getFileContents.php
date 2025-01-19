<?php
header('Content-Type: application/json');

$directoryPath = 'playlists';
$response = [];

if (is_dir($directoryPath)) {
    $files = scandir($directoryPath);

    foreach ($files as $file) {
        // Exclude . and ..
        if ($file !== '.' && $file !== '..') {
            $filePath = $directoryPath . '/' . $file;

            if (is_file($filePath)) {
                $content = file_get_contents($filePath);
                $escapedFileName = htmlspecialchars(basename($filePath), ENT_QUOTES, 'UTF-8');
                $response[] = [
                    'file' => $escapedFileName,
                    'content' => $content
                ];
            } else {
                $response[] = [
                    'file' => htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8'),
                    'error' => 'File not found or is not a valid file.'
                ];
            }
        }
    }

    echo json_encode(['files' => $response]);
} else {
    echo json_encode(['error' => 'Directory not found.']);
}
?>
