
/**
 * @typedef Song
 * @property {Array.<string>} song - The name of the song
 * @property {Array.<string>} artist - The artist of the song
 * @property {Array.<string>} source - The source of the song
 * @property {integer} bpm - The BPM of the song
 * @property {string} duration - The length of the song
 * @property {Object.<string,Array.<integer>>} chart - The data of the charts
 * @property {string} genre - The genre ID of the song
 * @property {integer} id - The ID of the song
 * @property {string} link - The YouTube link of the song
 * @property {string} download - The Google Drive link of the song
 */

const genreLabels = {
     jpop: 'ポップス',
     anime: 'アニメ',
     vocaloid: 'ボーカロイド™',
     touhou: '東方Project',
     game: 'ゲームミュージック'
};

const chartLabels = {
     kantan: 'かんたん',
     futsuu: 'ふつう',
     muzukashii: 'むずかしい',
     oni: 'おに',
     ura: 'おに（裏)'
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

if (!id || !genre || id.includes(".") || `${parseInt(id)}` !== id || id < 0 || !Object.keys(genreLabels).includes(genre) || id >= genreCount[genre]) {
     document.title = "404 - 圭紫の太鼓の達人創作譜面";
     document.querySelector("main").remove();
     document.head.querySelector("link[rel=stylesheet][href='index.css']").remove();

     const main = document.createElement("main");
     main.style.position = "absolute";
     main.style.top = "50%";
     main.style.left = "50%";
     main.style.transform = "translate(-50%, -50%)";
     document.body.appendChild(main);

     const error = document.createElement("h1");
     error.textContent = "404エラー";
     error.style.fontSize = "30px";
     main.appendChild(error);

     const notFound = document.createElement("h2");
     notFound.textContent = "不明な譜面";
     notFound.style.fontSize = "50px";
     notFound.style.paddingBottom = "50px";
     main.appendChild(notFound);

     const buttonWrap = document.createElement("p");
     main.appendChild(buttonWrap);

     const button = document.createElement("a");
     button.textContent = "ホームに戻る";
     button.className = "button";
     buttonWrap.appendChild(button);

     button.addEventListener("click", () => {
          window.location.replace("..");
     });

     document.body.querySelector("script[src='menu.js']").remove();
} else {
     document.head.querySelector("link[rel=stylesheet][href='error.css']").remove();

     if (document.getElementById("main").clientWidth <= 880) {
          document.getElementById("list-big-wrap").classList.add("list-fix");
     } else {
          document.getElementById("list-big-wrap").classList.remove("list-fix");
     }
     window.addEventListener("resize", () => {
          if (document.getElementById("main").clientWidth <= 880) {
               document.getElementById("list-big-wrap").classList.add("list-fix");
          } else {
               document.getElementById("list-big-wrap").classList.remove("list-fix");
          }
     });
}

window.onload = () => {
     setTimeout(() => {
          /**
           * The song object
           * @type {Song}
           */
          const song = songs.find(s => s.id == parseInt(id) && s.genre == genre);

          document.title = song.song + " (" + genreLabels[genre] + ") - 圭紫の太鼓の達人創作譜面";

          document.getElementById("title").textContent = song.song;
          document.getElementById("genre").textContent = genreLabels[song.genre];
          document.getElementById("title").className = song.genre;
          document.getElementById("genre").className = song.genre;
          document.getElementById("artist").textContent = writeArtists(song);
          document.getElementById("source").textContent = writeSources(song);
          document.getElementById("duration").textContent = song.duration.replace("m", "分").replace("s", "秒").replace(" ", "");
          document.getElementById("bpm").textContent = song.bpm + " BPM";
          document.getElementById("date").textContent = song.date.release.replaceAll("/", "-") + (song.date.update ? " (更新:" + song.date.update.replaceAll("/", "-") + ")" : "");
          document.getElementById("youtube").href = `https://www.youtube.com/watch?v=${song.link}`;
          document.getElementById("download").href = `https://drive.google.com/drive/folders/${song.download}`;

          Object.keys(song.chart).forEach(chart => {
               const block = document.createElement("div");

               const sideColor = document.createElement("div");
               sideColor.classList.add("sideColor");
               sideColor.classList.add("sideColor-" + chart);
               block.appendChild(sideColor);

               const image = document.createElement("img");
               image.classList.add("sideImage");
               image.draggable = false;
               image.src = `../difficulty/${chart}.png`;
               block.appendChild(image);

               const title = document.createElement("h3");
               title.textContent = chartLabels[chart];
               block.appendChild(title);

               const detail = document.createElement("p");
               detail.innerHTML = "☆" + song.chart[chart].join("<br>") + "コンボ";
               block.appendChild(detail);

               document.getElementById("list").appendChild(block);
               document.getElementById("fakelist").appendChild(block.cloneNode(true));
          });

          songs.filter(s => s.genre == genre).forEach(s => {
               if (s.song === song.song) {
                    return;
               }
               
               document.getElementById("song-list").appendChild(writeBox(s));
          })

          if (song.artist.main.length > 0) {
               var artists = songs.filter(s => (s.artist.main.length > 0 ? s.artist.main[0].name : null) == song.artist.main[0].name);
               if (artists.length > 1) {
                    artists.forEach(s => {
                         if (s.song === song.song) {
                              return;
                         }

                         document.getElementById("artist-list").appendChild(writeBox(s));
                    })
               } else {
                    document.getElementById("artists").remove();
               }
          } else {
               document.getElementById("artists").remove();
          }

     }, 500);
}