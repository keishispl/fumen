var pageRange = getCookie("page-range", 12);
document.getElementById("page-range").value = parseInt(pageRange);

document.getElementById("page-amount").textContent = document.getElementById("page-range").value;
document.getElementById("page-range").addEventListener("input", () => {
     document.getElementById("page-amount").textContent = document.getElementById("page-range").value;
     if (document.getElementById("page-range").value.length === 1) {
          document.getElementById("page-amount").style.paddingLeft = "0.82rem";
     } else {
          document.getElementById("page-amount").style.paddingLeft = "0";
     }
     document.cookie = "page-range=" + document.getElementById("page-range").value + ";";
     pageRange = document.getElementById("page-range").value;
     chartsSetup(songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)));
})

document.getElementById("close-settings").addEventListener("click", () => {
     document.getElementById("settings-wrap").style.opacity = 0;
     document.getElementById("settings-wrap").style.zIndex = -1;
     document.getElementById("settings").style.opacity = 0;
     document.getElementById("settings").style.zIndex = -1;
})

document.getElementById("settings-wrap").addEventListener("click", () => {
     document.getElementById("settings-wrap").style.opacity = 0;
     document.getElementById("settings-wrap").style.zIndex = -1;
     document.getElementById("settings").style.opacity = 0;
     document.getElementById("settings").style.zIndex = -1;
})

document.getElementById("open-settings").addEventListener("click", () => {
     document.getElementById("settings-wrap").style.opacity = 1;
     document.getElementById("settings-wrap").style.zIndex = 9;
     document.getElementById("settings").style.opacity = 1;
     document.getElementById("settings").style.zIndex = 10;
})

/**
 * An array of songs
 * @type {Song[]}
 */
var songs = getSongs()[0];
var songDivs = [];
var loading = 0;

var searchFilters = ["song", "artist", "vocal", "source", "genre", "sort"];

/**
 * Returns the URL parameters as an array of strings.
 * The array contains the 'song', 'artist', 'source', and 'genre' parameters in order.
 * If a parameter is not present in the URL, the corresponding element in the array will be null.
 * @returns {[string, string, string, string]} - An array of the URL parameters.
 */
function getURLParams() {
     var urlparam = new URLSearchParams(window.location.search);

     var obj = [];
     searchFilters.forEach(filter => {
          obj.push(urlparam.get(filter));
     })

     return obj;
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
          document.getElementById("input-" + searchFilters[index]).value = param;

          if (searchFilters[index] === "genre" && !Object.keys(genreLabels).includes(param)) {
               document.getElementById("input-genre").value = "";

               var urlparam = new URLSearchParams(window.location.search);
               urlparam.delete('genre');

               if (urlparam.toString() === "") {
                    history.pushState(null, null, ".");
               } else {
                    history.pushState(null, null, "?" + urlparam.toString());
               }
          }
          if (searchFilters[index] === "sort" && !["", "0", "1", "2", "3", "4"].includes(param)) {
               document.getElementById("input-sort").value = "";

               var urlparam = new URLSearchParams(window.location.search);
               urlparam.delete('sort');

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
               if (searchFilters[index] === "song") {
                    _songs = _songs.filter(song => kataToHira(song.song).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (searchFilters[index] === "artist") {
                    _songs = _songs.filter(song => kataToHira(writeArtists(song)).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (searchFilters[index] === "vocal") {
                    _songs = _songs.filter(song => kataToHira(writeVocals(song)).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (searchFilters[index] === "source") {
                    _songs = _songs.filter(song => kataToHira(writeSources(song)).toLowerCase().includes(kataToHira(param).toLowerCase()));
               }
               if (searchFilters[index] === "genre") {
                    _songs = _songs.filter(song => song.genre == param);
               }
               if (searchFilters[index] === "sort") {
                    if (param === "") {
                         _songs = _songs.sort((a, b) => new Date(b.date.release) - new Date(a.date.release) || `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "0") {
                         _songs = _songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "1") {
                         _songs = _songs.sort((a, b) => `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "2") {
                         _songs = _songs.sort((a, b) => `${writeArtists(a)}`.localeCompare(`${writeArtists(b)}`) || `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "3") {
                         _songs = _songs.sort((a, b) => `${writeVocals(a)}`.localeCompare(`${writeVocals(b)}`) || `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "4") {
                         _songs = _songs.sort((a, b) => `${writeSources(a)}`.localeCompare(`${writeSources(b)}`) || `${a.song}`.localeCompare(`${b.song}`));
                    }
                    if (param === "5") {
                         _songs = _songs.sort((a, b) => `${genreLabels[a.genre]}`.localeCompare(`${genreLabels[b.genre]}`) || `${a.song}`.localeCompare(`${b.song}`));
                    }
               }
          }
     });

     document.getElementById("charts-loading").style.opacity = 1;
     document.getElementById("charts-loading").style.zIndex = 3;

     document.getElementById("song-amount").textContent = "??件の結果";

     var div = document.createElement("div");
     div.id = "placeholder-div";
     div.className = "song-list";
     document.getElementById("song-lists").appendChild(div);

     loading++;

     var amount = 0;

     // Generate song divs
     setTimeout(() => {
          if (loading > 1) {
               loading--;
               return;
          }
          loading--;

          document.getElementById("charts-loading").style.opacity = 0;
          document.getElementById("charts-loading").style.zIndex = -1;

          document.getElementById("placeholder-div").remove();

          _songs.forEach(song => {
               if (number >= pageRange || number < 0) {
                    number = 0;

                    var div = document.createElement("div");
                    div.id = "song-list-" + songDivs.length;
                    div.className = "song-list";

                    songDivs.push(div.id);
                    document.getElementById("song-lists").appendChild(div);
               }

               number++;
               amount++;

               var block = document.getElementById(songDivs[songDivs.length - 1]);

               block.appendChild(writeBox(song, "chart/"));

               animationBox(block.querySelectorAll(".song-text"));
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
     }, Math.floor(Math.random() * (1500 - 500 + 1)) + 500);
}

// Search
document.getElementById("input-search").addEventListener("click", () => {
     var urlparam = new URLSearchParams(window.location.search);
     searchFilters.forEach(filter => {
          var param = document.getElementById("input-" + filter).value;
          urlparam.delete(filter);
          param === "" ? param = null : urlparam.set(filter, param);
     })

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
