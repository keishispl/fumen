/**
 * An array of songs
 * @type {Song[]}
 */
var songs = getSongs()[0];
var songDivs = [];

function comparePages(div, current) {
     for (let i = 0; i < div.length; i++) {
          if (i == current) {
               document.getElementById(div[i]).style.display = "flex";
               document.getElementById("song-button-" + i).classList.add("active");
          } else {
               document.getElementById(div[i]).style.display = "none";
               document.getElementById("song-button-" + i).classList.remove("active");
          }
     }
}

/**
 * Sorts the songs array by date of update or release, and then iterates it to generate the list of charts.
 * @returns {void}
 */
function chartsSetup() {
     document.getElementById("song-lists").innerHTML = "";
     document.getElementById("song-navigate").innerHTML = "";

     var songDivs = [];
     var number = -1;

     songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)).forEach(song => {
          if (number >= 10 || number < 0) {
               number = 0;

               var div = document.createElement("div");
               div.id = "song-list-" + songDivs.length;
               div.className = "song-list";

               songDivs.push(div.id);
               document.getElementById("song-lists").appendChild(div);
          }

          number++;

          document.getElementById(songDivs[songDivs.length - 1]).appendChild(writeBox(song, "chart/"));
     });

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

     comparePages(songDivs, 0);
}

setTimeout(() => {
     chartsSetup();
}, 500);
