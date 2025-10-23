/**
 * @typedef song
 * @property {string} id - The ID of the song
 * @property {string} name - The name of the song
 * @property {string} yori - The source of the song
 * @property {Array.<string>} composer - The composer(s) of the song
 * @property {Array.<string>} vocal - The vocalist(s) of the song
 * @property {Object.<string,string|Array.<string>>} info - The information of the song
 * @property {Object.<string,string|Object.<string,number|string>|null>} difficulties - The data of the charts
 * @property {string} youtube - The YouTube link of the song
 */

/**
 * Difficulties of the charts.
 * @type {Array.<string>}
 */
const chartLabels = ["easy", "normal", "hard", "expert", "master", "append"];

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
     request.open("GET", `https://raw.githubusercontent.com/keishispl/fumen-res/refs/heads/main/prsk/${file}.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}

/**
 * Constructs a string representation of the composer(s) for a given song.
 * Combines the composer names, replacing commas with full-width katakana commas.
 * 
 * @param {object} composer - The composer information.
 * @returns {string} A formatted string of the composer(s).
 */
function writeComposers(composer) {
     return composer.join("、").replaceAll(", ", "、");
}

/**
 * Constructs a string representation of the vocalist(s) for a given song.
 * Combines the vocalist names, replacing commas with full-width katakana commas.
 * If the vocalist is not present, returns "Inst. ver.".
 * 
 * @param {object} vocal - The vocalist information.
 * @returns {string} A formatted string of the vocalist(s).
 */
function writeVocals(vocal) {
     if (vocal === null) return "Inst. ver.";

     return "Vo. " + vocal.join("、").replaceAll(", ", "、");
}

/**
 * Add a CSS animation to each element in the given array of elements that are too wide.
 * The animation will scroll the element from right to left, and repeat indefinitely.
 * The duration of the animation is proportional to the width of the element.
 * @param {HTMLCollectionOf<Element>} box - The array of elements to animate.
 */
function animateBox(box, size) {
     const setWidth = size;

     box.forEach(detail => {
          if (detail.clientWidth > setWidth) {
               detail.classList.add("scroll-text");

               const width = detail.clientWidth;
               const distance = width + setWidth;
               const duration = 12.5 * distance;

               detail.style.animationDuration = `${duration}ms`;
          } else {
               detail.classList.remove("scroll-text");
               detail.style.animationDuration = "";
          }
     })
}

/**
 * Fetches song data from a remote JSON file and returns it as an array.
 * Each element in the array represents a song with its associated metadata,
 * including ID, name, source, composer(s), vocalist(s), additional info, 
 * chart difficulties, and YouTube link.
 *
 * @returns {Array.<Object>} An array of song objects containing metadata.
 */
function getSongs() {
     var songs = [];

     // Load songs into the array
     try {
          jsonFromFile("data").forEach(song => {
               songs.push({
                    id: song["id"],
                    name: song["name"],
                    yori: song["yori"],
                    composer: song["composer"],
                    vocal: song["vocal"],
                    info: song["info"],
                    difficulties: song["difficulties"],
                    image: song["image"],
                    youtube: song["youtube"]
               });
          })
     } catch (e) {
          console.error(e);
     };

     return songs;
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
function getCookie(name, defaultValue) {
     name += "=";
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