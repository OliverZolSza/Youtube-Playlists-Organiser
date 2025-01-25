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

function convertYoutubeUrl (youtubeUrl) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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

    const newButton = document.getElementById("new-icon");
    newButton.onclick = function(){
        newItem(fileName);
    };

    for (let i = 0; i < embedURLs.length; i++) {
        const currentURL = embedURLs[i];
        const videoDIV = document.createElement("div")
        videoDIV.className = "video";
        videosDIV.appendChild(videoDIV);
        const currentVideoDIV = document.getElementsByClassName("video")[i];

        const leftElement = document.createElement("div");
        leftElement.className = "left";
        currentVideoDIV.appendChild(leftElement);
        const rightElement = document.createElement("div");
        rightElement.className = "right";
        currentVideoDIV.appendChild(rightElement);

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

        //  div.delete
        const deleteDIV = document.createElement("div");
        deleteDIV.className = "delete";
        rightElement.appendChild(deleteDIV);
        const deleteIMG = document.createElement("img");
        deleteIMG.src = "/img/rubbish can.svg";
        deleteIMG.alt = "DEL"
        deleteDIV.appendChild(deleteIMG);

        //  div.move
        const moveDIV = document.createElement("div");
        moveDIV.className = "move";
        rightElement.appendChild(moveDIV);
        const moveIMG = document.createElement("img");
        moveIMG.src = "/img/move.svg";
        moveIMG.alt = "≡"
        moveDIV.appendChild(moveIMG);
    }
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

async function createItem(fileName, URL) {
    await (function () {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/addItem.php', true);
            
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
    
            let data = "fileName=" + encodeURIComponent(fileName) + "&url=" + encodeURIComponent(URL);
            
            xhr.send(data);
        });
    })()
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            document.body.innerHTML = '';
            const errorMessage = document.createElement('div');
            errorMessage.innerText = error;
            document.body.appendChild(errorMessage);
        });
}

async function newItem(fileName){
    let input;

    do {
        input = prompt("URL: ", "");

        if (input === null) {
            // Cancel
            break;
        }

    } while (input === "")
        
    if (input !== null) {
        // OK
        await createItem(fileName, input)
        location.reload();
    } else {
        return;
    }
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