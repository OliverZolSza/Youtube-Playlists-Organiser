function fetchFileContents() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/getFileContents.php', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.files);
                }
            } else {
                reject('Error fetching file contents.');
            }
        };
        
        xhr.onerror = function() {
            reject('Request failed.');
        };
        
        xhr.send();
    });
}

function pixelsToVmin(pxValue) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const smallerDimension = Math.min(viewportWidth, viewportHeight);

    const vminValue = (pxValue / smallerDimension) * 100;

    return vminValue;
}

function convertYoutubeUrl (youtubeUrl) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeUrl.match(regex);
    if (match && match[1]) {
        const videoId = match[1];
        return [`https://www.youtube.com/embed/${videoId}`, `https://www.youtube.com/watch?v=${videoId}`];
    } else {
        throw new Error("Invalid YouTube URL");
    }
}

function convertToEmbedUrls (inputURLs) {
    let embedURLs = [];

    for (let i = 0; i < inputURLs.length; i++) {
        const element = inputURLs[i];

        try {
            embedURLs.push(convertYoutubeUrl(element)[0]);
            console.log(embedURLs.at(-1));
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
    return embedURLs;
}

function convertToWatchUrls (inputURLs) {
    let watchURLs = [];

    for (let i = 0; i < inputURLs.length; i++) {
        const element = inputURLs[i];

        try {
            watchURLs.push(convertYoutubeUrl(element)[1]);
            console.log(watchURLs.at(-1));
        } catch (error) {
            console.error(error.message);
            console.log("HERE!");
            return null;
        }
    }
    return watchURLs;
}

function appendVideos (embedURLs = [], watchURLs = [], fileName) {
    const videosDIV = document.getElementById("videos");
    videosDIVoriginalHeight = window.getComputedStyle(videosDIV).height;
    console.log(videosDIVoriginalHeight);
    videosDIV.style.height = `calc(${videosDIVoriginalHeight} + calc( calc(var(--size-multiplier) * 9vmin) * ${embedURLs.length} - 5vmin + ${videosDIVoriginalHeight}) + calc(${embedURLs.length} * 5vmin))`;

    const hiddenFileNameInput = document.createElement("input");
    hiddenFileNameInput.type = "hidden";
    hiddenFileNameInput.name = "fileName";
    hiddenFileNameInput.value = fileName;
    videosDIV.appendChild(hiddenFileNameInput);

    for (let i = 0; i < embedURLs.length; i++) {
        const currentURL = embedURLs[i];
        const videoDIV = document.createElement("div")
        videoDIV.className = "video";
        videoDIV.style.position = "absolute";
        videoDIV.style.top = `calc(${i} * calc(calc(var(--size-multiplier) * 9vmin)) - 5vmin + ${videosDIVoriginalHeight} + calc(${i + 1} * 5vmin))`;
        videosDIV.appendChild(videoDIV);

        // radiobutton to move the video to
        const moveToElement = document.createElement("label");
        moveToElement.className = "moveto";
        moveToElement.style.position = "absolute";
        moveToElement.style.top = `calc(${i} * calc(calc(var(--size-multiplier) * 9vmin)) - 5vmin + ${videosDIVoriginalHeight} + calc(${i + 1} * 5vmin) + 2.5vmin)`;
        videosDIV.appendChild(moveToElement);

        const moveToRadioButton = document.createElement("input");
        moveToRadioButton.type = "radio";
        moveToRadioButton.name = "moveto";
        moveToRadioButton.value = i;
        if (i == 0){
            moveToRadioButton.checked = "1";
        }
        moveToElement.appendChild(moveToRadioButton);

        const moveToIMG = document.createElement("img");
        moveToIMG.src = "/img/move.svg";
        moveToIMG.alt = "≡"
        moveToElement.appendChild(moveToIMG);

        // left and right sections
        const leftElement = document.createElement("div");
        leftElement.className = "left";
        videoDIV.appendChild(leftElement);
        const rightElement = document.createElement("div");
        rightElement.className = "right";
        videoDIV.appendChild(rightElement);

        //  iframe
        const videoElement = document.createElement("iframe");
        videoElement.src = currentURL;
        videoElement.frameBorder = 0;
        videoElement.className = "video-thumbnail";
        videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        videoElement.referrerPolicy = "strict-origin-when-cross-origin";
        videoElement.allowFullscreen = true;
        leftElement.appendChild(videoElement);

        //  h2
        const playlistIndexElement = document.createElement("h2");
        playlistIndexElement.innerHTML = (i + 1).toString();
        rightElement.appendChild(playlistIndexElement);

        //  button.delete
        const deleteElement = document.createElement("button");
        deleteElement.className = "delete";
        deleteElement.onclick = function(event) {
            deleteItem(event, i, fileName);
        };
        rightElement.appendChild(deleteElement);
        const deleteIMG = document.createElement("img");
        deleteIMG.src = "/img/rubbish can.svg";
        deleteIMG.alt = "DEL"
        deleteElement.appendChild(deleteIMG);

        //  button.move
        const moveElement = document.createElement("label");
        moveElement.className = "move";
        rightElement.appendChild(moveElement);

        // radiobutton to select video to move
        const moveRadioButton = document.createElement("input");
        moveRadioButton.type = "radio";
        moveRadioButton.name = "move";
        moveRadioButton.value = i;
        if (i == 0){
            moveRadioButton.checked = "1";
        }
        moveElement.appendChild(moveRadioButton);

        const moveIMG = document.createElement("img");
        moveIMG.src = "/img/move.svg";
        moveIMG.alt = "≡"
        moveElement.appendChild(moveIMG);
    }

    // last radiobutton to move the video to
    const i = embedURLs.length;
    const moveToElement = document.createElement("label");
    moveToElement.className = "moveto";
    moveToElement.style.position = "absolute";
    moveToElement.style.top = `calc(${i} * calc(calc(var(--size-multiplier) * 9vmin)) - 5vmin + ${videosDIVoriginalHeight} + calc(${i + 1} * 5vmin) + 2.5vmin)`;
    videosDIV.appendChild(moveToElement);

    const moveToRadioButton = document.createElement("input");
    moveToRadioButton.type = "radio";
    moveToRadioButton.name = "moveto";
    moveToRadioButton.value = i;
    if (i == 0){
        moveToRadioButton.checked = "1";
    }
    moveToElement.appendChild(moveToRadioButton);

    const moveToIMG = document.createElement("img");
    moveToIMG.src = "/img/move.svg";
    moveToIMG.alt = "≡"
    moveToElement.appendChild(moveToIMG);
}

function loadPlaylist (file){
    const fileName = `${file.file}`;
    const fileContent = `${file.content}`;

    //  h1 -> Playlist Title
    const videosDIV = document.getElementById("videos");
    const playlistTitleElement = document.createElement("h1");
    playlistTitleElement.innerHTML = fileName.replace(/\.txt$/, '');
    videosDIV.appendChild(playlistTitleElement);

    //  title
    document.title = fileName.replace(/\.txt$/, '');
    
    const inputURLs = fileContent.split(/\r\n|\n/).map(line => line.trim()).filter(line => line !== '');
    console.log(inputURLs);
    const embedURLs = convertToEmbedUrls(inputURLs);
    const watchURLs = convertToWatchUrls(inputURLs)
    
    appendVideos(embedURLs, watchURLs, fileName);
}


function deleteItem (event, n, fileName) {

    event.preventDefault();

    (function () {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/delete.php', true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = xhr.responseText;
                    
                    if (response == "ERROR") {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                } else {
                    reject('Error fetching file contents.');
                }
            };
            
            xhr.onerror = function() {
                reject('Request failed.');
            };

            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
            let data = "index=" + encodeURIComponent(n) + "&fileName=" + encodeURIComponent(fileName);

            console.log(data);
            
            xhr.send(data);
        });
    })()
        .then(response => {
            console.log(response);
            const currentVideoElement = document.getElementsByClassName("video")[n];
            const currentDeleteButton = currentVideoElement.getElementsByClassName("delete")[0];
            if (currentDeleteButton) {
                currentDeleteButton.remove();
            }
            const currentMoveButton = currentVideoElement.getElementsByClassName("move")[0];
            if (currentMoveButton) {
                currentMoveButton.remove();
            }
            currentVideoElement.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        })
        .catch(error => {
            console.log(error);
            document.body.innerHTML = '';
            const errorMessage = document.createElement('div');
            errorMessage.innerText = error;
            document.body.appendChild(errorMessage);
        });
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let playlistID = urlParams.get("list");

    fetchFileContents()
        .then(files => {
            loadPlaylist(files[playlistID]);
        })
        .catch(error => {
            document.body.innerHTML = '';
            const errorMessage = document.createElement('div');
            errorMessage.innerText = error;
            document.body.appendChild(errorMessage);
        });
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('videos');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('/moveItem.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            location.reload();
        })
        .catch(response => {
            console.log(response);
        });
    });
});