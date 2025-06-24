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

     /**
      * Loop through the array of genres and fetch the corresponding JSON data from the server.
      * For each genre, loop through the array of songs and add them to the table.
      * If the genre has not been loaded before, add a header row to the table with the genre name.
      */
     Object.keys(genreLabels).forEach(genre => {
          var number = 0;
          jsonFromFile(genre).forEach(song => {
               /**
                * Parse the song object and add it to the table.
                * @param {object} song - The song object to parse.
                * @param {string} genre - The genre of the song.
                */
               parseSong(song, genre, number);

               number++;
          });
     });
}, 500);
