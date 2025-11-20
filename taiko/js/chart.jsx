/**
 * An array of songs
 * @type {Song[]}
 */
var songs = getSongs()[0];
var genreCount = getSongs()[1];

// Sort the array
songs = songs.sort((a, b) => new Date(b.date.release) - new Date(a.date.release) || `${a.song}`.localeCompare(`${b.song}`));

/**
 * The genre ID of the page
 * @type {string}
 */
const genre = new URL(window.location.href).searchParams.get('genre');

/**
 * The song ID of the page
 * @type {string}
 */
const id = new URL(window.location.href).searchParams.get('id');

// Check if the song is valid 
if (!id || !genre || id.includes(".") || `${parseInt(id)}` !== id || id < 0 || !Object.keys(genreLabels).includes(genre) || id >= genreCount[genre]) {
     document.title = "404 | 太鼓の達人創作譜面";
     document.querySelector("main").remove();
     document.querySelector("footer").remove();

     var header = document.createElement("header");
     document.body.appendChild(header);

     header.innerHTML = `
          <h2 style="font-size: 32px; letter-spacing: 12px; margin: 0; line-height: 1em; font-weight: normal; font-style: normal; padding-top: 50px; padding-bottom: 25px;">(｡•́︿•̀｡)</h2>
          <h1 style="font-size: 80px; letter-spacing: 10px; margin: 5px 0 10px 0; line-height: 1em;">404 エラー</h1>
          <p style="font-size: 32px; letter-spacing: 10px; font-style: italic;">譜面が見つかりません</p>
          <a class="btn" style="font-size: 24px; padding: 10px 20px;" href="../">ホームに戻る</a>
     `;
} else {
     /**
      * The song object
      * @type {Song}
      */
     const song = songs.find(s => s.id == parseInt(id) && s.genre == genre);

     // Update the song details
     document.title = song.song + " | 太鼓の達人創作譜面";
     document.getElementById("title").textContent = song.song;
     document.getElementById("genre").textContent = genreLabels[song.genre];
     document.getElementById("genre").className = song.genre;
     document.getElementById("artist").textContent = writeArtists(song);
     document.getElementById("vocal").textContent = writeVocals(song).replace("ボーカル：", "");
     if (writeVocals(song) === "Instrument Ver.") document.getElementById("vocal").style.color = "red";
     document.getElementById("source").textContent = writeSources(song);
     if (writeSources(song) === "") document.getElementById("source").style.display = "none";
     document.getElementById("duration").textContent = song.duration.replace("m", "分").replace("s", "秒").replace(" ", "");
     document.getElementById("bpm").textContent = song.bpm + " BPM";
     document.getElementById("date").textContent = song.date.release.replaceAll("/", "-") + (song.date.update ? " (更新:" + song.date.update.replaceAll("/", "-") + ")" : "");
     document.getElementById("video").src = `https://www.youtube.com/embed/${song.link}`;
     document.getElementById("download").href = `https://drive.google.com/drive/folders/${song.download}`;

     document.getElementById("source-link").href = `../?source=${writeSources(song)}`;
     document.getElementById("genre-link").href = `../?genre=${song.genre}`;

     // Generate the difficulty list
     var charts = [];
     Object.keys(song.chart).forEach(chart => {
          if (song.chart[chart] !== null) {
               charts.push(<div className={chart}>
                    <img src={`../difficulty/${chart}.png`} draggable={false} />
                    <h3>{chartLabels[chart]}</h3>
                    <p>☆{song.chart[chart][0]}</p>
                    <p>{song.chart[chart][1]} コンボ</p>
               </div>);
          }
     });
     ReactDOM.render(<div id="chart-list">{charts}</div>, document.getElementById("charts"));

     // Generate the relevant songs list for the source
     var list = [];
     songs.filter(s => writeSources(s) == writeSources(song) && s.song !== song.song).slice(0, 5).forEach(s => {
          list.push(writeBox(s));
     })
     if (list.length == 0 || writeSources(song) === "") {
          document.getElementById("source-same").style.display = "none";
     } else {
          ReactDOM.render(<div id="source-list">{list}</div>, document.getElementById("source-list"));
     }

     // Generate the relevant songs list for the genre
     var list = [];
     songs.filter(s => s.genre == genre && s.song !== song.song).slice(0, 5).forEach(s => {
          list.push(writeBox(s));
     })
     ReactDOM.render(<div id="song-list">{list}</div>, document.getElementById("song-list"));
}
