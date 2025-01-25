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

function loadPlaylist (file, playlistID){
    const fileName = `${file.file}`;

    //  h1 -> Playlist Titles
    const playlistsDIV = document.getElementById("playlists");


    const playlistTitleAndDeleteElementsDIV = document.createElement("div");

    const playlistTitleElement = document.createElement("button");
    playlistTitleElement.type = "submit";
    playlistTitleElement.value = fileName.replace(/\.txt$/, '');
    playlistTitleElement.innerHTML = fileName.replace(/\.txt$/, '');
    playlistTitleElement.onclick = function(){
        setValue(playlistID);
    };
    playlistTitleAndDeleteElementsDIV.appendChild(playlistTitleElement);

    const playlistDeleteElement = document.createElement("div");
    playlistDeleteElement.className = "delete";
    playlistDeleteElement.onclick = function() {
        deletePlaylistOnClick();
    };

    const playlistDeleteImage = document.createElement("img");
    playlistDeleteImage.src = "/img/rubbish can.svg";
    playlistDeleteImage.alt = "DEL";
    playlistDeleteElement.appendChild(playlistDeleteImage);

    playlistTitleAndDeleteElementsDIV.appendChild(playlistDeleteElement);

    playlistsDIV.appendChild(playlistTitleAndDeleteElementsDIV);
}

function setValue (value) {
    document.getElementById("submitValue").value = value;
}

async function createPlaylist(fileName) {
    await (function () {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/createPlaylist.php', true);
            
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
    
            let data = "fileName=" + encodeURIComponent(fileName);
            
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

async function newPlaylist(){
    let input;

    do {
        input = prompt("Playlist name: ", "");

        if (input === null) {
            // Cancel
            break;
        }

    } while (input === "")
        
    if (input !== null) {
        // OK
        await createPlaylist(`${input}.txt`)
        location.reload();
    } else {
        return;
    }
}

async function deletePlaylist (fileName) {
    await (function () {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/deletePlaylist.php', true);
            
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
    
            let data = "fileName=" + encodeURIComponent(fileName);
            
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

async function deletePlaylistOnClick(fileName){
    if (fileName !== null && fileName !== "") {
        // OK
        await deletePlaylist(`${fileName}.txt`)
        location.reload();
    }
}



window.onload = () => {
    fetchFileContents()
        .then(files => {
            for (let id = 0; id < files.length; id++) {
                const file = files[id];
                loadPlaylist(file, id);
            }
        })
        .catch(error => {
            document.body.innerHTML = '';
            const errorMessage = document.createElement('div');
            errorMessage.innerText = error;
            document.body.appendChild(errorMessage);
        });
};