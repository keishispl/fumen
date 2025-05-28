/**
 * Parse a song object and add it to the table.
 * @param {object} song - The song object to parse.
 * @param {string} genre - The genre of the song.
 */
function parseSong(song, genre) {
     const tableBody = document.getElementById("table-body");
     const row = document.createElement("tr");

     // Add a class to the row based on the genre.
     // This is used to color the row based on the genre.
     row.className = genre;

     // Add the row to the table body.
     tableBody.appendChild(row);

     const id = song.song.join("^").replace(" ", "-");

     // Loop through the song object and add the values to the table.
     Object.entries(song).forEach(([key, value]) => {
          if (value === song.link) return;

          const cell = document.createElement("td");

          // Add the cell to the row.
          row.appendChild(cell);

          // Switch based on the key of the song object.
          switch (key) {
               case "song":
                    // If the song has a link, add a link to the table.
                    // Otherwise, just add the song name to the table.
                    if (song.link) {
                         cell.innerHTML = `<a href="https://www.youtube.com/watch?v=${song.link}" class="hiddenlink" target="_blank" tabindex="-1">${value.join(`<br>`)}</a>`;
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
               case "bpm":
                    // Add the BPM to the table.
                    cell.innerHTML = value ? value : "?";
                    cell.id = `${id}_BPM`;
                    break;
               case "length":
                    // Add the length to the table.
                    cell.innerHTML = value ? value : "?";
                    cell.id = `${id}_持続時間`;
                    break;
               case "chart":
                    // Add the difficulties to the table.
                    const difficulties = [
                         { name: "kantan", icon: "difficulty/kantan.png" },
                         { name: "futsuu", icon: "difficulty/futsuu.png" },
                         { name: "muzukashii", icon: "difficulty/muzukashii.png" },
                         { name: "oni", icon: "difficulty/oni.png" },
                         { name: "ura", icon: "difficulty/ura.png" },
                    ];

                    cell.id = `${id}_難易度／コンボ`;
                    cell.classList.add("難易度／コンボ");

                    cell.innerHTML = difficulties.map(difficulty => {
                         if (value[difficulty.name]) {
                              // If the difficulty is specified, add the difficulty to the table.
                              return `<div id="${id}_難易度／コンボ-${difficulty.name}"><img class="icon" src="${difficulty.icon}" draggable="false">: ☆${value[difficulty.name].join(` / `)} コンボ</div>`;
                         } else {
                              if (difficulty.name !== "ura") {
                                   // If the difficulty is not specified, add a dash to the table.
                                   return `<div id="${id}_難易度／コンボ-${difficulty.name}"><img class="icon" src="${difficulty.icon}" draggable="false">: -</div>`;
                              }
                         }
                    }).join("");
                    break;
               case "":
                    // If the value is an empty string or "true", add a dash to the table.
                    if (value === "" || value === "true") {
                         cell.innerHTML = "-";
                    } else {
                         // If the value is a Google Drive folder id, add a link to the table.
                         cell.innerHTML = `<a href="https://drive.google.com/drive/folders/${value}/" class="hiddenlink" target="_blank" tabindex="-1"><i class="fa-solid fa-download"></i></a>`;
                    }
                    cell.id = `${id}_ダウンロード`;
                    break;
               default:
                    // Add the value to the table.
                    cell.innerHTML = value;
          }
     });
};
