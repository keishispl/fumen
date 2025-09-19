// Set the search value
var search = document.getElementById("search");
var urlparam = new URLSearchParams(window.location.search);
search.value = urlparam.get("search") ?? "";

/**
 * Write a list of songs to the page.
 * @param {Song[]} songs - The songs to write to the page
 */
function writeSongs(songs) {
     songs.forEach(song => {
          var div = document.createElement("div");
          document.getElementById("charts").appendChild(div);

          var link = document.createElement("a");
          link.href = "song/?id=" + song.id;
          link.style.zIndex = 1;
          div.appendChild(link);

          var id = document.createElement("h3");
          id.textContent = "#" + song.id;
          id.className = "id";
          div.appendChild(id);

          var div2 = document.createElement("div");
          div.appendChild(div2);

          var img = document.createElement("img");
          img.src = song.image;
          img.draggable = false;
          img.width = 75;
          img.height = 75;
          div2.appendChild(img);

          var div3 = document.createElement("div");
          div3.classList = "scrollable-div";
          div2.appendChild(div3);

          var yori = document.createElement("h3");
          yori.textContent = song.yori ?? "";
          yori.classList = "scrollable";
          div3.appendChild(yori);

          var name = document.createElement("h1");
          name.textContent = song.name;
          name.classList = "scrollable";
          div3.appendChild(name);

          var composer = document.createElement("h2");
          composer.textContent = writeComposers(song.composer);
          composer.classList = "scrollable";
          div3.appendChild(composer);

          var vocal = document.createElement("h2");
          vocal.textContent = writeVocals(song.vocal);
          vocal.classList = "scrollable";
          div3.appendChild(vocal);

          // Animate
          animateBox([yori, name, composer, vocal], div3.clientWidth);
     })
}

/**
 * Updates the search query string parameter and rewrites the songs list
 * with results matching the search query.
 */
function filterSearch() {
     // Update URL
     var urlparam = new URLSearchParams(window.location.search);
     urlparam.delete("search");

     if (search.value === "") {
          history.pushState(null, null, ".");
     } else {
          urlparam.set("search", search.value);
          history.pushState(null, null, "?" + urlparam.toString());
     }

     // Filter songs by search
     var ssongs = getSongs().filter(song =>
          `#${song.id}`.toLowerCase().includes(search.value.toLowerCase()) ||
          kataToHira(song.name).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(writeComposers(song.composer)).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.vocal.join("、").replaceAll(", ", "、")).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.yori).toLowerCase().includes(kataToHira(search.value).toLowerCase())
     );

     // Rewrite HTML
     document.getElementById("charts").innerHTML = "";
     writeSongs(ssongs);
}

// Filter on input
search.addEventListener("input", () => {
     filterSearch();
})

// Animate on resize
window.addEventListener("resize", () => {
     var items = [];
     document.getElementById("charts").querySelectorAll(".scrollable").forEach(item => items.push(item));
     animateBox(items, document.querySelector(".scrollable-div").clientWidth);
})

// Filter on load
filterSearch();