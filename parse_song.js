function parseSong(song, genre) {
     const tableBody = document.getElementById("table-body");
     const row = document.createElement("tr");

     genreList = [
          "jpop",
          "anime",
          "vocaloid",
          "touhou",
          "variety",
          "game"
     ]

     if (genreList.includes(genre)) row.className = genre;

     tableBody.appendChild(row);

     Object.keys(song).forEach((key) => {
          if (song[key] == song.link) return;

          const cell = document.createElement("td");

          if (song[key] != song.chart) cell.style.cssText = "text-align:center;";

          row.appendChild(cell);

          switch (key) {
               case "song":
                    if (song.link) {
                         cell.innerHTML = `<a href="https://www.youtube.com/watch?v=${song.link}" class="hiddenlink" target="_blank">${song[key].join(`<br>`)}</a>`;
                    } else {
                         cell.innerHTML = song[key].join(`<br>`);
                    }
                    break;
               case "artist":
                    cell.innerHTML = song[key].join(`<br>`);
                    break;
               case "source":
                    cell.innerHTML = song[key].join(`<br>`);
                    break;
               case "chart":
                    if (song.chart.kantan) {
                         kantan = `<div><img class="icon" src="difficulty/kantan.png" alt="かんたん" data-scanned="true">: ☆${song.chart.kantan.join(` / `)} コンボ</div>`
                    } else kantan = `<div><img class="icon" src="difficulty/kantan.png" alt="かんたん" data-scanned="true">: -</div>`;

                    if (song.chart.futsuu) {
                         futsuu = `<div><img class="icon" src="difficulty/futsuu.png" alt="ふつう" data-scanned="true">: ☆${song.chart.futsuu.join(` / `)} コンボ</div>`
                    } else futsuu = `<div><img class="icon" src="difficulty/futsuu.png" alt="ふつう" data-scanned="true">: -</div>`;

                    if (song.chart.muzukashii) {
                         muzukashii = `<div><img class="icon" src="difficulty/muzukashii.png" alt="むずかしい" data-scanned="true">: ☆${song.chart.muzukashii.join(` / `)} コンボ</div>`
                    } else muzukashii = `<div><img class="icon" src="difficulty/muzukashii.png" alt="むずかしい" data-scanned="true">: -</div>`;

                    if (song.chart.oni) {
                         oni = `<div><img class="icon" src="difficulty/oni.png" alt="おに" data-scanned="true">: ☆${song.chart.oni.join(` / `)} コンボ</div>`
                    } else oni = `<div><img class="icon" src="difficulty/oni.png" alt="おに" data-scanned="true">: -</div>`;

                    if (song.chart.ura) {
                         ura = `<div><img class="icon" src="difficulty/ura.png" alt="うら" data-scanned="true">: ☆${song.chart.ura.join(` / `)} コンボ</div>`
                    } else ura = "";

                    cell.innerHTML = kantan + futsuu + muzukashii + oni + ura;
                    break;
               case "":
                    if (`${song[key]}` === "" || `${song[key]}` === "true") {
                         cell.innerHTML = `-`;
                    } else {
                         cell.innerHTML = `<a href="https://drive.google.com/drive/folders/${song[key]}/" class="hiddenlink" target="_blank"><i class="fa-solid fa-download"></i></a>`;
                    }
                    break;
               default:
                    cell.innerHTML = song[key];
          }
     });
};