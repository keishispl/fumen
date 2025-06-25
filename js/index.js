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

setTimeout(() => {
     const tableBody = document.getElementById('table-body');
     const row = document.createElement('tr');
     tableBody.appendChild(row);

     ['楽曲', 'アーティスト', 'ソース', 'ジャンル'].forEach(header => {
          const cell = document.createElement('td');
          cell.style.fontWeight = 'bold';
          cell.style.textAlign = 'center';
          cell.textContent = header;
          row.appendChild(cell);
     });

     songs.sort((a, b) => new Date(b.date.update ?? b.date.release) - new Date(a.date.update ?? a.date.release) || `${a.song}`.localeCompare(`${b.song}`)).forEach(song => {
          /**
           * Parse a song object and add it to the table.
           * @param {object} song - The song object to parse.
           * @param {string} genre - The genre of the song.
           * @param {number} number - The id of the song.
           */
          function parseSong(song, genre, number) {
               const tableBody = document.getElementById("table-body");
               const row = document.createElement("tr");

               // Add a class to the row based on the genre.
               // This is used to color the row based on the genre.
               row.className = genre;
               row.style.height = "100px";

               // Add the row to the table body.
               tableBody.appendChild(row);

               const id = song.song.join("^").replace(" ", "-");

               // Loop through the song object and add the values to the table.
               Object.entries(song).forEach(([key, value]) => {
                    if (!["song", "artist", "source"].includes(key)) return;

                    const cell = document.createElement("td");

                    // Add the cell to the row.
                    row.appendChild(cell);

                    // Switch based on the key of the song object.
                    switch (key) {
                         case "song":
                              // If the song has a link, add a link to the table.
                              // Otherwise, just add the song name to the table.
                              if (song.link) {
                                   cell.innerHTML = `<a href="./chart/?genre=${genre}&id=${number}" class="hiddenlink" tabindex="-1">${value.join(`<br>`)}</a>`;
                              } else {
                                   cell.innerHTML = value.join(`<br>`);
                              }
                              cell.id = `${id}_楽曲`;
                              break;
                         case "artist":
                              // Add the artist to the table.
                              cell.innerHTML = writeArtists(song);
                              cell.id = `${id}_アーティスト`;
                              break;
                         case "source":
                              // Add the source to the table.
                              cell.innerHTML = writeSources(song);
                              cell.id = `${id}_ソース`;
                              break;
                    }
               });

               const cell = document.createElement("td");
               cell.textContent = genreLabels[genre];
               row.appendChild(cell);
          };

          parseSong(song, song.genre, song.id);
     });
}, 500);
