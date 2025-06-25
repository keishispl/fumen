/**
 * An array of songs
 * @type {Song[]}
 */
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

/**
 * Sorts the songs array by date of update or release, and then iterates it to generate the list of charts.
 * @returns {void}
 */
function chartsSetup() {
     document.getElementById("song-list").innerHTML = "";

     songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)).forEach(song => {
          document.getElementById("song-list").appendChild(writeBox(song, "chart/"));
     });
}

setTimeout(() => {
     chartsSetup();
}, 500);
