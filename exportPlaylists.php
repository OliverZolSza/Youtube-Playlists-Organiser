<?php
$sourceDir = 'playlists';
$destDir = 'export';

// Check if source directory exists
if (!is_dir($sourceDir)) {
    die("Source directory does not exist.");
}

// Create destination directory if it doesn't exist
if (!is_dir($destDir)) {
    mkdir($destDir, 0755, true);
}

if ($handle = opendir($sourceDir)) {
    while (false !== ($file = readdir($handle))) {
        // Skip the current and parent directory entries
        if ($file != '.' && $file != '..') {
            $sourceFile = $sourceDir . '/' . $file;
            $destFile = $destDir . '/' . $file;

            if (is_file($sourceFile)) {
                if (copy($sourceFile, $destFile)) {
                    echo "Copied: $file\n";
                } else {
                    echo "Failed to copy: $file\n";
                }
            }
        }
    }
    closedir($handle);
} else {
    die("Failed to open source directory.");
}
?>
