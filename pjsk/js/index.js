var search = document.getElementById("search");

var urlparam = new URLSearchParams(window.location.search);
search.value = urlparam.get("search") ?? "";

function writeSongs(songs) {
     songs.forEach(song => {
          var div = document.createElement("div");
          document.getElementById("charts").appendChild(div);

          var a = document.createElement("a");
          a.href = "song/?id=" + song.id;
          a.style.zIndex = 1;
          div.appendChild(a);

          var id = document.createElement("p");
          id.textContent = "#" + song.id;
          id.style.fontSize = "12px";
          div.appendChild(id);

          var div2 = document.createElement("div");
          div.appendChild(div2);
          var img = document.createElement("img");
          img.src = "https://cc-cdn.sevenc7c.com/" + song.image;
          img.draggable = false;
          img.width = 75;
          img.height = 75;
          div2.appendChild(img);

          var div3 = document.createElement("div");
          div2.appendChild(div3);

          var p = document.createElement("p");
          p.textContent = song.yori ?? "";
          p.style.fontSize = "12px";
          div3.appendChild(p);

          var h3 = document.createElement("h3");
          h3.textContent = song.name;
          div3.appendChild(h3);

          var p2 = document.createElement("p");
          p2.textContent = writeComposers(song.composer);
          div3.appendChild(p2);

          var p3 = document.createElement("p");
          p3.textContent = writeVocals(song.vocal);
          div3.appendChild(p3);

          animateBox([p, h3, p2, p3], div3.clientWidth);
     })
}

function filterSearch() {
     var urlparam = new URLSearchParams(window.location.search);
     urlparam.delete("search");

     if (search.value === "") {
          history.pushState(null, null, ".");
     } else {
          urlparam.set("search", search.value);
          history.pushState(null, null, "?" + urlparam.toString());
     }

     var ssongs = getSongs().filter(song =>
          `#${song.id}`.toLowerCase().includes(search.value.toLowerCase()) ||
          kataToHira(song.name).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(writeComposers(song.composer)).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.vocal.join("、").replaceAll(", ", "、")).toLowerCase().includes(kataToHira(search.value).toLowerCase()) ||
          kataToHira(song.yori).toLowerCase().includes(kataToHira(search.value).toLowerCase())
     );

     document.getElementById("charts").innerHTML = "";
     writeSongs(ssongs);
}

search.addEventListener("input", () => {
     filterSearch();
})

window.addEventListener("resize", () => {
     filterSearch();
})

filterSearch();