/**
 * Object that maps genre names to their corresponding labels.
 * Used to set the text content of the genre labels in the table.
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
 * An array of songs
 * @type {Song[]}
 */
var songs = [];
var genreCount = {};

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

function chartsSetup() {
     document.getElementById("song-list").innerHTML = "";

     songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)).forEach(song => {
          document.getElementById("song-list").appendChild(writeBox(song, "chart/"));
     });
}

setTimeout(() => {
     chartsSetup();
}, 500);
