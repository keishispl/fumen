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
                    cell.innerHTML = value ? value.join(`<br>`) : "-";
                    cell.id = `${id}_アーティスト`;
                    break;
               case "source":
                    // Add the source to the table.
                    cell.innerHTML = value ? value.join(`<br>`) : "-";
                    cell.id = `${id}_ソース`;
                    break;
          }
     });

     const cell = document.createElement("td");
     cell.textContent = genreLabels[genre];
     row.appendChild(cell);
};
