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
 * Sets the document title to "Loading..." and waits for 100ms
 * before setting it to the desired title.
 * This is used to create a loading animation for the page.
 */
document.title = 'Loading...';

setTimeout(() => {
     document.title = '圭紫の太鼓の達人創作譜面';

     /**
      * Listens for resize events on the window and reloads the page when the window is resized.
      * This is used to create a responsive design for the page.
      */
     window.addEventListener('resize', () => {
          location.reload();
     });

     /**
      * Checks if the window width is less than 1132px
      * and if so, sets the loading text to "ページがモバイルデバイスでサポートされていません".
      * This is used to prevent the page from loading on mobile devices.
      */
     if (window.innerWidth < 1132) {
          document.getElementById('loading').textContent = 'ページがモバイルデバイスでサポートされていません';
          return;
     }

     /**
      * Creates a header row in the table with specified column titles.
      * Each column title is bold and centered, and can optionally have a CSS class applied for styling.
      * @param {string} colorClass - Optional CSS class to apply to each table cell in the header row.
      */
     function setTableTitle(colorClass) {
          /**
           * Creates a table cell element with specified text, styling, and optional CSS class.
           * The cell is bold and centered, and is appended to the given row.
           * @param {HTMLElement} row - The table row to append the cell to.
           * @param {string} text - The text content for the cell.
           * @param {string} colorClass - Optional CSS class to apply to the cell for styling.
           */
          function createTableCell(row, text, colorClass) {
               const cell = document.createElement('td');
               cell.style.fontWeight = 'bold';
               cell.style.textAlign = 'center';
               cell.textContent = text;
               cell.id = "カテゴリー/" + colorClass + "_" + (text ? text : "ダウンロード");
               if (colorClass) {
                    cell.classList.add(colorClass);
               }
               row.appendChild(cell);
          }

          const tableBody = document.getElementById('table-body');
          const row = document.createElement('tr');
          tableBody.appendChild(row);

          ['楽曲', 'アーティスト', 'ソース', 'BPM', '持続時間', '難易度／コンボ', ''].forEach(header => createTableCell(row, header, colorClass));
     }

     /**
      * Sets the text content of a table cell.
      * @param {string} genre - Genre of the song.
      * @param {string} type - Type of the table cell.
      * @param {string} text - Text content of the table cell.
      */
     function setTableCell(genre, type, text) {
          document.getElementById("カテゴリー/" + genre + "_" + type).textContent = text;
     }

     /**
      * Set of genres that have been loaded.
      * Used to prevent genres from being loaded more than once.
      */
     const loadedGenres = new Set();

     /**
      * Loop through the array of genres and fetch the corresponding JSON data from the server.
      * For each genre, loop through the array of songs and add them to the table.
      * If the genre has not been loaded before, add a header row to the table with the genre name.
      */
     ['jpop', 'anime', 'vocaloid', 'touhou', 'game'].forEach(genre => {
          jsonFromFile(genre).forEach(song => {
               /**
                * If the genre has not been loaded before, add a header row to the table with the genre name.
                * Set the text content of the header cell to the genre name, and set its colspan to 7.
                * Set the font weight of the header cell to bold and center its text.
                * Add the genre name to the set of loaded genres to prevent it from being loaded again.
                */
               if (!loadedGenres.has(genre)) {
                    loadedGenres.add(genre);
                    const tableBody = document.getElementById('table-body');
                    const row = document.createElement('tr');
                    tableBody.appendChild(row);
                    const cell = document.createElement('td');
                    row.appendChild(cell);
                    cell.textContent = genreLabels[genre];
                    cell.style.fontWeight = 'bold';
                    cell.style.textAlign = 'center';
                    cell.classList.add(genre);
                    cell.setAttribute('colspan', '7');

                    setTableTitle(genre);
               }
               /**
                * Parse the song object and add it to the table.
                * @param {object} song - The song object to parse.
                * @param {string} genre - The genre of the song.
                */
               parseSong(song, genre);
          });
     });

     // Custom parameters
     setTableCell('anime', 'ソース', 'TVアニメ・映画');
     setTableCell('touhou', 'アーティスト', 'サークル');
     setTableCell('touhou', 'ソース', '原作');
     setTableCell('game', 'ソース', 'ゲーム');


     // Removes the loading element from the DOM.
     document.getElementById('loading').remove();

     /**
      * If the background setting is enabled, add the 'tint' class to the 'obj' element.
      * This is used to apply a tint effect to the element.
      */
     if (bgSetting) {
          document.body.classList.add('tint');
     }

     /**
      * Array of element IDs whose 'hidden' class will be removed.
      * This will make the elements visible on the page.
      */
     ['table-body', 'bg-toggle', 'source', 'logotext', 'sidebar', 'btn2'].forEach(id => {
          document.getElementById(id).classList.remove('hidden');
     });
}, Math.floor(Math.random() * 700) + 100);
