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
     request.open("GET", `https://raw.githubusercontent.com/keishispl/fumen-res/refs/heads/main/taiko/${file}.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}

/**
 * Constructs a string representation of the artists for a given song.
 * Combines the main artists' names, optionally with their alternate names,
 * 
 * @param {object} song - The song object containing artist information.
 * @returns {string} A formatted string of the main artists.
 */
function writeArtists(song) {
     var main = [];
     if (song.artist.main.length > 0) {
          song.artist.main.forEach(artist => {
               main.push(artist.name + (artist.alt ?? ""));
          })
     } else {
          main = ["-"];
     }

     return main.join("、").replaceAll(", ", "、");
}

/**
 * Constructs a string representation of the artists for a given song.
 * Combines the vocal names, optionally with their alternate names,
 * 
 * @param {object} song - The song object containing artist information.
 * @returns {string} A formatted string of the vocal artists.
 */
function writeVocals(song) {
     if (song.artist.vocal === null) return "Instrument Ver.";

     var main = [];
     if (song.artist.vocal.length > 0) {
          song.artist.vocal.forEach(vocal => {
               main.push(vocal.name + (vocal.alt ?? ""));
          })
     } else {
          main = ["-"];
     }

     return "ボーカル：" + main.join("、").replaceAll(", ", "、");
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
          return "";
     }
}

function writeDates(song) {
     return (song.date.release.replaceAll("/", "-") + (song.date.update ? " (更新:" + song.date.update.replaceAll("/", "-") + ")" : ""));
}

/**
 * Generates a song box element given a song object.
 * 
 * @param {object} song - The song object containing song information.
 * @param {string} [href=""] - The base URL to link to each song box.
 * @returns {object} The generated song box element.
 */
function writeBox(song, href = "") {
     return <div className="song-box">
          <a href={`${href}?genre=${song.genre}&id=${song.id}`}></a>
          <h3>{writeSources(song)}</h3>
          <h1>{song.song}</h1>
          <h2>{writeArtists(song)}</h2>
          <h2>{writeVocals(song)}</h2>
          <p className={song.genre}>{genreLabels[song.genre]}</p>
          <p className="date">{writeDates(song)}</p>
     </div>;
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
          var number = jsonFromFile(genre).length - 1;
          try {
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
                    number--;
               })
          } catch (e) {
               console.error(e);
          }
          genreCount[genre] = jsonFromFile(genre).length;
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

/**
 * Retrieves the value of a specified cookie from the document's cookies.
 *
 * @param {string} cname - The name of the cookie to retrieve.
 * @param {string} defaultValue - The default value to return if the cookie is not found.
 * @returns {string} The value of the specified cookie, or the default value if the cookie is not found.
 */
function getCookie(cname, defaultValue) {
     let name = cname + "=";
     let decodedCookie = decodeURIComponent(document.cookie);
     let ca = decodedCookie.split(';');
     for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
               c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
               return c.substring(name.length, c.length);
          }
     }
     return defaultValue;
}