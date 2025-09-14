var pageRange = 6;

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
     ReactDOM.render(<div className="song-list">{div[current]}</div>, document.getElementById("song-lists"));

     if (div.length > 0) {
          renderButtons(div, current, true);
     } else {
          renderButtons(div, current, false)
     }
}

function renderButtons(div, current, display) {
     var buttonElements = [];
     var text = "";
     if (display) {
          var buttons = [];
          var avaliableButtons = Array.from({ length: div.length }, (_, i) => i++);

          function pushButton(index) {
               if (avaliableButtons.includes(index) && index >= 0 && index < div.length) {
                    buttons.push({
                         key: index,
                         element: <button className="btn" onClick={() => comparePages(div, index)}>{index + 1}</button>
                    })
                    avaliableButtons.splice(avaliableButtons.indexOf(index), 1);
               }
          }

          pushButton(current);
          pushButton(current + 1);
          pushButton(current - 1);
          pushButton(0);
          pushButton(div.length - 1);

          buttons.sort((a, b) => a.key - b.key);

          var searchButton = <input type="number" onKeyDown={handleKeyDown} />;
          function handleKeyDown(event) {
               if (event.key === "Enter") {
                    var key = event.target.value;
                    if (key > div.length) key = div.length;
                    if (key < 1) key = 1;
                    comparePages(div, key - 1);
                    event.target.value = "";
               }
          }

          for (var button of buttons) {
               if (button.key === current) {
                    buttonElements.push(searchButton);
               } else {
                    buttonElements.push(button.element);
               }
          }

          text = `${current + 1} / ${div.length}`;
     }

     ReactDOM.render(<div id="navigation">{buttonElements}</div>, document.getElementById("song-navigate"));
     document.getElementById("current-page").textContent = text;
}

/**
 * Sorts the songs array by date of update or release, and then iterates it to generate the list of charts.
 * @returns {void}
 */
function chartsSetup(_songs) {
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

     document.getElementById("song-amount").textContent = "??件の結果";
     document.getElementById("page-amount").textContent = "";

     loading++;

     var amount = 0;

     // Generate song divs
     if (loading > 1) {
          loading--;
          return;
     }
     loading--;

     _songs.forEach(song => {
          if (number >= pageRange || number < 0) {
               number = 0;

               songDivs[songDivs.length] = [];
          }

          number++;
          amount++;

          songDivs[songDivs.length - 1].push(writeBox(song, "chart/"));
     });

     // Generate song amount
     document.getElementById("song-amount").textContent = amount + "件の結果";

     // Generate page amount
     document.getElementById("page-amount").textContent = "全" + songDivs.length + "ページ";

     comparePages(songDivs, 0);
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
