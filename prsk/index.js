// Set the search value
var search = document.getElementById("search");
var urlparam = new URLSearchParams(window.location.search);
search.value = urlparam.get("search") ?? "";
document.getElementById("filter-source").value = urlparam.get("source") ?? "";

var difficultyFilter = ["master", "append"];

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

          var div4 = document.createElement("div");
          div.appendChild(div4);

          var img = document.createElement("img");
          img.src = "https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + song.image;
          img.draggable = false;
          img.width = 100;
          img.height = 100;
          div4.appendChild(img);

          var div2 = document.createElement("div");
          div4.appendChild(div2);

          var exdiv = document.createElement("div");
          exdiv.classList = "exdiv";
          div.appendChild(exdiv);

          exdiv.style.setProperty("--background-image", "url(https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + song.image + ")");

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
          history.pushState(null, null, "." + (urlparam.toString() ? "?" + urlparam.toString() : ""));
     } else {
          urlparam.set("search", search.value);
          history.pushState(null, null, "?" + urlparam.toString());
     }

     // Update filter source
     urlparam.delete("source");
     if (document.getElementById("filter-source").value !== "") {
          urlparam.set("source", document.getElementById("filter-source").value);
          history.pushState(null, null, "?" + urlparam.toString());
     } else {
          history.pushState(null, null, "." + (urlparam.toString() ? "?" + urlparam.toString() : ""));
     }

     difficultyFilter.forEach(type => {
          urlparam.delete(type + "-ari");
          if (document.getElementById("filter-ari-" + type).checked) {
               urlparam.set(type + "-ari", "1");
               history.pushState(null, null, "?" + urlparam.toString());
          } else {
               history.pushState(null, null, "." + (urlparam.toString() ? "?" + urlparam.toString() : ""));
          }
     });

     // Filter songs by search
     var ssongs = getSongs().filter(song =>
          `#${song.id}`.toLowerCase().includes(search.value.toLowerCase()) ||
          kataToHira(song.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(writeComposers(song.composer)).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.vocal.join("、").replaceAll(", ", "、")).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.yori).toLowerCase().includes(kataToHira(search.value).toLowerCase())
     );

     if (document.getElementById("filter-source").value !== "") {
          ssongs = ssongs.filter(song => {
               var yori = song.yori;
               if (yori.includes("アニメ")) yori = "アニメ";
               return kataToHira(yori).toLowerCase().includes(kataToHira(document.getElementById("filter-source").value).toLowerCase());
          })
     }
     difficultyFilter.forEach(type => {
          if (document.getElementById("filter-ari-" + type).checked) {
               ssongs = ssongs.filter(song => {
                    var has = false;
                    song.difficulties.forEach(diff => {
                         if (diff.type === type) {
                              if (diff.data !== null) {
                                   has = true;
                              } 
                         }
                    });
                    return has;
               })
          }
     });

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

// filter button
document.getElementById("search-filter").addEventListener("click", () => {
     document.getElementById("filter-search").value = document.getElementById("search").value;
     document.getElementById("filter-overlay").style.display = "block";
});

["filter-close", "filter-close-button"].forEach(id => {
     document.getElementById(id).addEventListener("click", () => {
          document.getElementById("filter-overlay").style.display = "none";
     });
});

document.getElementById("filter-search").addEventListener("input", () => {
     document.getElementById("search").value = document.getElementById("filter-search").value;
     filterSearch();
});

document.getElementById("filter-clear-search").addEventListener("click", (e) => {
     document.getElementById("filter-search").value = "";
     document.getElementById("search").value = "";
     document.getElementById("filter-search").focus();
     filterSearch();
});

document.getElementById("filter-clear-source").addEventListener("click", () => {
     document.getElementById("filter-source").value = "";
     document.getElementById("filter-source").focus();
     filterSearch();
});

var yoris = [];
getSongs().forEach(song => {
     var yori = song.yori;
     if (yori.includes("アニメ")) yori = "アニメ";
     var has = false;
     yoris.forEach(oyori => {
          if (kataToHira(oyori).toLowerCase() == kataToHira(yori).toLowerCase()) has = true;
     });
     if (!has) yoris.push(yori);
})

function resetYori() {
     document.getElementById("filter-source-list").innerHTML = "";

     yoris.sort().forEach(yori => {
          var option = document.createElement("a");
          option.textContent = yori;
          document.getElementById("filter-source-list").appendChild(option);

          option.addEventListener("click", () => {
               document.getElementById("filter-source").value = yori;
               document.getElementById("filter-source").focus();
               filterSearch();
          });
     });
}

document.getElementById("filter-source").addEventListener("input", () => {
     var source = document.getElementById("filter-source").value;
     document.getElementById("filter-source-list").innerHTML = "";

     yoris.forEach(yori => {
          if (!kataToHira(yori).toLowerCase().includes(kataToHira(source).toLowerCase())) return;

          var option = document.createElement("a");
          option.textContent = yori;
          document.getElementById("filter-source-list").appendChild(option);

          option.addEventListener("click", () => {
               document.getElementById("filter-source").value = yori;
               document.getElementById("filter-source").focus();
               resetYori();
               filterSearch();
          });
     });

     filterSearch();
});

resetYori();

difficultyFilter.forEach(id => {
     var wrap = document.createElement("div");
     wrap.className = "checkbox-wrap";
     document.getElementById("filter-difficulty").appendChild(wrap);

     var checkbox = document.createElement("input");
     checkbox.type = "checkbox";
     checkbox.id = "filter-ari-" + id;
     wrap.appendChild(checkbox);

     var label = document.createElement("label");
     label.htmlFor = "filter-ari-" + id;
     label.textContent = id.toUpperCase() + "譜面あり";
     wrap.appendChild(label);

     var urlparam = new URLSearchParams(window.location.search);
     if (urlparam.get(id + "-ari") === "1") {
          checkbox.checked = true;
     }

     checkbox.addEventListener("change", () => {
          filterSearch();
     });
});

document.getElementById("filter-reset-all").addEventListener("click", () => {
     document.getElementById("filter-search").value = "";
     document.getElementById("search").value = "";
     document.getElementById("filter-source").value = "";
     difficultyFilter.forEach(id => {
          document.getElementById("filter-ari-" + id).checked = false;
     });
     filterSearch();
})

// Filter on load
filterSearch();