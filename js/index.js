/**
 * An array of songs
 * @type {Song[]}
 */
var songs = getSongs()[0];
var songDivs = [];

/**
 * Returns the URL parameters as an array of strings.
 * The array contains the 'song', 'artist', 'source', and 'genre' parameters in order.
 * If a parameter is not present in the URL, the corresponding element in the array will be null.
 * @returns {[string, string, string, string]} - An array of the URL parameters.
 */
function getURLParams() {
     var urlparam = new URLSearchParams(window.location.search);

     var song = urlparam.get('song');
     var artist = urlparam.get('artist');
     var source = urlparam.get('source');
     var genre = urlparam.get('genre');

     return [song, artist, source, genre];
}

// Add genre options
Object.keys(genreLabels).forEach(genre => {
     var option = document.createElement("option");
     option.value = genre;
     option.textContent = genreLabels[genre];
     document.getElementById("input-genre").appendChild(option);
})

// Set input values
getURLParams().forEach((param, index) => {
     if (param) {
          document.getElementById("input-" + ["song", "artist", "source", "genre"][index]).value = param;

          if (index == 3 && !Object.keys(genreLabels).includes(param)) {
               document.getElementById("input-genre").value = "";

               var urlparam = new URLSearchParams(window.location.search);
               urlparam.delete('genre');

               if (urlparam.toString() === "") {
                    history.pushState(null, null, ".");
               } else {
                    history.pushState(null, null, "?" + urlparam.toString());
               }
          }
     }
})

/**
 * Compares the given page number with the current page number and updates the page display style and button active status accordingly.
 * @param {string[]} div - An array of div IDs of the pages to compare.
 * @param {number} current - The current page number.
 * @returns {void}
 */
function comparePages(div, current) {
     for (let i = 0; i < div.length; i++) {
          try {
               if (i == current) {
                    document.getElementById(div[i]).style.display = "flex";
                    document.getElementById("song-button-" + i).classList.add("active");
               } else {
                    document.getElementById(div[i]).style.display = "none";
                    document.getElementById("song-button-" + i).classList.remove("active");
               }
          } catch (e) { }
     }
}

/**
 * Sorts the songs array by date of update or release, and then iterates it to generate the list of charts.
 * @returns {void}
 */
function chartsSetup(_songs) {
     // Reset
     document.getElementById("song-lists").innerHTML = "";
     document.getElementById("song-navigate").innerHTML = "";

     var songDivs = [];
     var number = -1;

     // Filter songs
     getURLParams().forEach((param, index) => {
          if (param) {
               if (index == 0) {
                    _songs = _songs.filter(song => kataToHira(song.song).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (index == 1) {
                    _songs = _songs.filter(song => kataToHira(writeArtists(song)).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (index == 2) {
                    _songs = _songs.filter(song => kataToHira(writeSources(song)).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (index == 3) {
                    _songs = _songs.filter(song => song.genre == param);
               }
          }
     });

     var amount = 0;

     // Generate song divs
     _songs.forEach(song => {
          if (number >= 10 || number < 0) {
               number = 0;

               var div = document.createElement("div");
               div.id = "song-list-" + songDivs.length;
               div.className = "song-list";

               songDivs.push(div.id);
               document.getElementById("song-lists").appendChild(div);
          }

          number++;
          amount++;

          document.getElementById(songDivs[songDivs.length - 1]).appendChild(writeBox(song, "chart/"));
     });

     // Generate song amount
     document.getElementById("song-amount").textContent = amount + "件の結果";

     if (amount == 0) {
          var div = document.createElement("div");
          div.id = "song-list-" + songDivs.length;
          div.className = "song-list";

          songDivs.push(div.id);
          document.getElementById("song-lists").appendChild(div);
     } else {
          // Navigate pages
          for (let i = 0; i < songDivs.length; i++) {
               var button = document.createElement("button");
               button.id = "song-button-" + i;
               button.className = "song-button";
               button.innerHTML = i + 1;

               document.getElementById("song-navigate").appendChild(button);

               button.addEventListener("click", () => {
                    comparePages(songDivs, i);
               });
          }
     }

     comparePages(songDivs, 0);
}

// Search
document.getElementById("input-search").addEventListener("click", () => {
     var song = document.getElementById("input-song").value;
     var artist = document.getElementById("input-artist").value;
     var source = document.getElementById("input-source").value;
     var genre = document.getElementById("input-genre").value;

     var urlparam = new URLSearchParams(window.location.search);

     urlparam.delete('song');
     urlparam.delete('artist');
     urlparam.delete('source');
     urlparam.delete('genre');

     song === "" ? song = null : urlparam.set('song', song);
     artist === "" ? artist = null : urlparam.set('artist', artist);
     source === "" ? source = null : urlparam.set('source', source);
     genre === "" ? genre = null : urlparam.set('genre', genre);

     if (urlparam.toString() === "") {
          history.pushState(null, null, ".");
     } else {
          history.pushState(null, null, "?" + urlparam.toString());
     }

     chartsSetup(songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)));
})

setTimeout(() => {
     chartsSetup(songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)));
}, 500);
