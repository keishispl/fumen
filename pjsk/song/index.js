const songs = getSongs();

const songId = new URLSearchParams(window.location.search).get("id");
var ssong = songs.find(song => song.id === songId);

if (!ssong) {
     document.title = "404 | プロセカ - 創作譜面";

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
     document.title = ssong.name + " | プロセカ - 創作譜面";

     document.getElementById("id").textContent = "#" + songId;
     document.getElementById("yori").textContent = ssong.yori;
     animateBox([document.getElementById("yori")], 235);
     if (document.getElementById("yori-wrap").offsetWidth > 220) {
          document.getElementById("youtube-wrap").style.top = "75px";
     }

     document.getElementById("youtube").href = "https://www.youtube.com/watch?v=" + ssong.youtube;

     document.getElementById("song-image").src = ssong.image;
     document.getElementById("song-name").textContent = ssong.name;
     document.getElementById("song-composer").textContent = writeComposers(ssong.composer);
     document.getElementById("song-vocal").textContent = writeVocals(ssong.vocal);

     document.getElementById("song-length").textContent = ssong.info.duration.replace(":", "分") + ("s", "秒");
     document.getElementById("song-bpm").textContent = ssong.info.bpm + " BPM";

     document.getElementById("song-combo").style.opacity = 0;
     document.getElementById("song-combo").style.cursor = "default";

     for (const child of document.getElementById("song-info").children) {
          animateBox([child], 335);
     }

     var items = [];

     ssong.difficulties.forEach(diff => {
          const div = document.createElement("div");

          const circle = document.createElement("div");
          circle.className = diff.type;

          const level = document.createElement("p");
          if (diff.data) {
               level.textContent = diff.data.level;
          } else {
               level.textContent = "-";
               if (["easy", "normal", "hard"].includes(diff.type)) {
                    items.push(div);
               }
          }
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
                    document.getElementById("sonolus").href = "https://open.sonolus.com/coconut.sonolus.com/next-sekai/levels/coconut-next-sekai-" + diff.data.id;
               })
          }
     })

     if (items.length === 3) {
          items.forEach(item => item.remove());
     }
}