/**
 * @typedef Song
 * @property {Array.<string>} song - The name of the song
 * @property {Object.<string,Object>} artist - The artist of the song
 * @property {Array.<string>} source - The source of the song
 * @property {integer} bpm - The BPM of the song
 * @property {string} duration - The length of the song
 * @property {Object.<string,Array.<integer>>} chart - The data of the charts
 * @property {string} genre - The genre ID of the song
 * @property {integer} id - The ID of the song
 * @property {string} link - The YouTube link of the song
 * @property {string} download - The Google Drive link of the song
 */

/**
 * Object that maps genre names to their corresponding labels.
 * @type {Object.<string,string>}
 */
const genreLabels = {
     jpop: 'ポップス',
     anime: 'アニメ',
     vocaloid: 'ボーカロイド™',
     touhou: '東方Project',
     game: 'ゲームミュージック'
};

/**
 * Object that maps chart difficulty names to their corresponding labels.
 * @type {Object.<string,string>}
 */
const chartLabels = {
     kantan: 'かんたん',
     futsuu: 'ふつう',
     muzukashii: 'むずかしい',
     oni: 'おに',
     ura: 'おに（裏)'
};

var lineLength = 30;
var linetext = "";

for (var i = 0; i < lineLength; i++) {
     linetext += "_";
};

var lines = document.querySelectorAll('.line');
for (var i = 0; i < lines.length; i++) {
     lines[i].innerHTML = linetext;
};

/**
 * Fetches and parses a JSON file from a remote URL.
 * Synchronously sends a GET request to retrieve JSON data from the specified file path
 * on the GitHub repository and parses the response into a JavaScript object.
 *
 * @param {string} file - The name of the JSON file to fetch (without the .json extension).
 * @returns {object} The parsed JSON object from the response.
 */
function jsonFromFile(file) {
     var request = new XMLHttpRequest();
     request.open("GET", `https://raw.githubusercontent.com/keishispl/taikofumen-res/refs/heads/main/${file}.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}

/**
 * Constructs a string representation of the artists for a given song.
 * Combines the main artists' names, optionally with their alternate names,
 * and appends a "feat." prefix followed by any vocal artists if present.
 * 
 * @param {object} song - The song object containing artist information.
 * @returns {string} A formatted string of the main and vocal artists.
 */
function writeArtists(song) {
     var main = [];
     var alt = "";
     if (song.artist.main.length > 0) {
          song.artist.main.forEach(artist => {
               main.push(artist.name + (artist.alt ?? ""));
          })

          if (song.artist.vocal.length > 0) {
               alt = " feat. " + song.artist.vocal.join(", ");
          }
     } else {
          main = ["-"];
     }

     return main.join(", ") + alt;
}

/**
 * Constructs a string representation of the song's source.
 * Returns a formatted string based on the genre type.
 * If the source is not present, returns a hyphen.
 * 
 * @param {object} song - The song object containing source information.
 * @returns {string} A formatted string of the source.
 */
function writeSources(song) {
     if (song.source) {
          var genre = "{obj}";

          if (song.genre === "anime") genre = "アニメ『{obj}』";

          return genre.replace("{obj}", song.source);
     } else {
          return "-";
     }
}

/**
 * Generates a song box element given a song object.
 * 
 * @param {object} song - The song object containing song information.
 * @param {string} [href=""] - The base URL to link to each song box.
 * @returns {object} The generated song box element.
 */
function writeBox(song, href = "") {
     const block = document.createElement("div");

     const link = document.createElement("a");
     link.href = `${href}?genre=${song.genre}&id=${song.id}`;
     link.style = "z-index: 1; color: inherit; text-decoration: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;";
     block.appendChild(link);

     var contain = document.createElement("div");
     contain.className = "song-div";
     block.appendChild(contain);

     const title = document.createElement("h3");
     title.textContent = song.song;
     title.className = "song-text";
     contain.appendChild(title);

     var icons = document.createElement("div");
     icons.className = "icons";
     block.appendChild(icons);

     var contain = document.createElement("div");
     contain.className = "song-text-div";
     block.appendChild(contain);

     icons.innerHTML += `<svg class="icon" fill="currentColor" aria-hidden="true" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7 2.23a1 1 0 0 1 1.3.95V13.5a2.5 2.5 0 1 1-1-2V6.18L8 8.37v7.13a2.5 2.5 0 1 1-1-2V5.37a1 1 0 0 1 .7-.96l7-2.18ZM8 7.32l7-2.19V3.18L8 5.37v1.95ZM5.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6.5-.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="currentColor"></path>
                                   </svg>`

     var detail = document.createElement("p");
     detail.textContent = writeArtists(song);
     detail.className = "song-text";
     contain.appendChild(detail);


     icons.innerHTML += `<br><svg class="icon" fill="currentColor" aria-hidden="true" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589" fill="currentColor"></path>
                                   </svg>`

     var detail = document.createElement("p");
     detail.textContent = writeSources(song);
     detail.className = "song-text";
     detail.style.top = "24px";
     contain.appendChild(detail);


     icons.innerHTML += `<br><svg class="icon ${song.genre}" fill="currentColor" aria-hidden="true" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.35,2.219h-5.934c-0.115,0-0.225,0.045-0.307,0.128l-8.762,8.762c-0.171,0.168-0.171,0.443,0,0.611l5.933,5.934c0.167,0.171,0.443,0.169,0.612,0l8.762-8.763c0.083-0.083,0.128-0.192,0.128-0.307V2.651C17.781,2.414,17.587,2.219,17.35,2.219M16.916,8.405l-8.332,8.332l-5.321-5.321l8.333-8.332h5.32V8.405z M13.891,4.367c-0.957,0-1.729,0.772-1.729,1.729c0,0.957,0.771,1.729,1.729,1.729s1.729-0.772,1.729-1.729C15.619,5.14,14.848,4.367,13.891,4.367 M14.502,6.708c-0.326,0.326-0.896,0.326-1.223,0c-0.338-0.342-0.338-0.882,0-1.224c0.342-0.337,0.881-0.337,1.223,0C14.84,5.826,14.84,6.366,14.502,6.708" fill="currentColor"></path>
                                   </svg>`

     var detail = document.createElement("p");
     detail.textContent = genreLabels[song.genre];
     detail.className = `song-text ${song.genre}`;
     detail.style.top = "48px";
     contain.appendChild(detail);

     return block;
}

/**
 * Loads song data from remote JSON files and returns it as an array and an object.
 * The array contains all song data, and the object contains the count of songs for each genre.
 *
 * @returns {[object, object]} - The array of song data and the object containing the amount of songs in each genre.
 */
function getSongs() {
     var songs = [];
     var genreCount = {};

     // Load songs into the array
     Object.keys(genreLabels).forEach(genre => {
          var number = 0;
          jsonFromFile(genre).sort((a, b) => new Date(b.date.release) - new Date(a.date.release) || `${a.song}`.localeCompare(`${b.song}`)).forEach(song => {
               songs.push({
                    link: song['link'],
                    song: song['song'],
                    artist: song['artist'],
                    source: song['source'],
                    bpm: song['bpm'],
                    duration: song['duration'],
                    chart: song['chart'],
                    download: song[''],
                    genre: genre,
                    id: number,
                    date: song['date']
               });
               number++;
          })
          genreCount[genre] = number;
     });

     return [songs, genreCount];
}

/**
 * Converts all katakana characters in a given string to hiragana characters.
 * @param {string} str - The string to convert.
 * @returns {string} The string with all katakana characters converted to hiragana characters.
 */
function kataToHira(str) {
     return `${str}`.replace(/[\u30a1-\u30f6]/g, function (match) {
          var chr = match.charCodeAt(0) - 0x60;
          return String.fromCharCode(chr);
     });
}