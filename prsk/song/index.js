const songs = getSongs();

const songId = new URLSearchParams(window.location.search).get("id");
var ssong = songs.find(song => song.id === songId);

if (!ssong) {
     document.title = "404 | プロセカ創作譜面";

     document.getElementById("id").textContent = "";
     document.getElementById("yori-wrap").remove();
     document.getElementById("youtube-wrap").remove();

     document.getElementById("song-image").style.animation = "loading 1.75s infinite ease-in-out";
     document.getElementById("song-name").textContent = "404エラー";
     document.getElementById("song-composer").textContent = "不明な譜面";
     document.getElementById("song-vocal").textContent = "( ˶°ㅁ°)!!";

     document.getElementById("song-length").remove();
     document.getElementById("song-bpm").remove();
     document.getElementById("song-combo").remove();

     document.getElementById("song-buttons").innerHTML = `<a class="btn" href="../">ホームに戻る</a></p>`;
} else {
     document.title = ssong.name + " | プロセカ創作譜面";

     document.getElementById("id").textContent = "#" + songId;
     document.getElementById("yori").textContent = ssong.yori;
     animateBox([document.getElementById("yori")], 235);
     if (document.getElementById("yori-wrap").offsetWidth > 220) {
          document.getElementById("youtube-wrap").style.top = "75px";
     }

     document.getElementById("youtube").addEventListener("click", () => {
          document.getElementById("video-overlay").style.display = "block";
          document.getElementById("video").src = "https://www.youtube.com/embed/" + ssong.youtube;
     });

     document.getElementById("video-close").addEventListener("click", () => {
          document.getElementById("video-overlay").style.display = "none";
          document.getElementById("video").src = "";
     });

     document.getElementById("song-image").src = "https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + ssong.image;
     document.getElementById("song-audio").src = "https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + ssong.audio;
     document.getElementById("song-name").textContent = ssong.name;
     document.getElementById("song-composer").textContent = writeComposers(ssong.composer);
     document.getElementById("song-vocal").textContent = writeVocals(ssong.vocal);

     document.getElementById("song-length").textContent = ssong.info.duration.replace(":", "分") + ("s", "秒");
     document.getElementById("song-bpm").textContent = ssong.info.bpm + " BPM";

     document.getElementById("song-combo").style.opacity = 0;
     document.getElementById("song-combo").style.cursor = "default";

     for (const child of document.getElementById("song-info").children) {
          animateBox([child], 300);
     }

     var items = [];

     ssong.difficulties.forEach(diff => {
          if (diff.data == null) {
               return
          }

          const div = document.createElement("div");

          const circle = document.createElement("div");
          circle.className = diff.type;

          const level = document.createElement("p");
          level.textContent = diff.data.level;
          circle.appendChild(level);

          div.appendChild(circle);

          const text = document.createElement("h1");
          text.textContent = diff.type.toUpperCase();
          text.className = diff.type;
          div.appendChild(text);

          document.getElementById("song-charts").appendChild(div);

          document.getElementById("song-buttons").querySelectorAll("a").forEach(p => {
               p.style.cursor = "default";
               p.style.opacity = 0;
          });

          if (diff.data) {
               circle.addEventListener("click", () => {
                    var contain = false;
                    if (circle.classList.contains("active")) {
                         contain = true;
                    }

                    document.getElementById("song-combo").style.opacity = 0;
                    document.getElementById("song-combo").style.cursor = "default";

                    document.getElementById("sonolus").removeAttribute("href");
                    document.getElementById("song-buttons").querySelectorAll("a").forEach(p => {
                         p.style.cursor = "default";
                         p.style.opacity = 0;
                    });

                    document.getElementById("song-charts").querySelectorAll("div").forEach(div => {
                         for (const child of div.children) {
                              child.classList.remove("active");
                         }
                    })

                    if (contain) return;

                    circle.classList.add("active");
                    text.classList.add("active");

                    document.getElementById("song-combo").textContent = diff.data.combo + "コンボ";
                    document.getElementById("song-combo").style.opacity = 1;
                    document.getElementById("song-combo").style.cursor = "auto";

                    document.getElementById("song-buttons").querySelectorAll("a").forEach(p => {
                         p.style.cursor = "pointer";
                         p.style.opacity = 1;
                    });
                    document.getElementById("sonolus").href = "https://open.sonolus.com/untitledcharts.com/levels/UnCh-" + diff.data.id;
               })
          }
     })
}