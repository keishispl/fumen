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
     document.getElementById("video-close-button").addEventListener("click", () => {
          document.getElementById("video-overlay").style.display = "none";
          document.getElementById("video").src = "";
     });

     document.getElementById("chart-close").addEventListener("click", () => {
          document.getElementById("chart-overlay").style.display = "none";
     });
     document.getElementById("chart-close-button").addEventListener("click", () => {
          document.getElementById("chart-overlay").style.display = "none";
     });

     document.getElementById("song-image").src = "https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + ssong.image;
     document.getElementById("song-audio").src = "https://ba14959b4680d4b81463a1d708c63691.untitledcharts.com/f60ee519b7474d5fc22ad87d03ebf0169f8965a1d8a067d2618be9798b494e08/" + ssong.audio;
     document.getElementById("song-name").textContent = ssong.name;
     document.getElementById("song-composer").textContent = writeComposers(ssong.composer);
     document.getElementById("song-vocal").textContent = writeVocals(ssong.vocal);

     document.getElementById("chart-length").textContent = ssong.info.duration.replace(":", "分") + ("s", "秒");
     document.getElementById("chart-bpm").textContent = ssong.info.bpm + " BPM";

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

          if (diff.data) {
               circle.addEventListener("click", () => {
                    document.getElementById("chart-level").textContent = diff.type.toUpperCase() + " " + diff.data.level;
                    document.getElementById("chart-combo").textContent = diff.data.combo + "コンボ";

                    document.getElementById("chart-qr").src = "https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&qzone=1&data=sonolus://untitledcharts.com/levels/UnCh-" + diff.data.id;
                    document.getElementById("chart-link").href = "sonolus://untitledcharts.com/levels/UnCh-" + diff.data.id;
                    document.getElementById("chart-link").innerHTML = "sonolus://untitledcharts.com/levels/UnCh-" + diff.data.id + " <i class=\"fa-solid fa-up-right-from-square\"></i>";

                    document.getElementById("chart-overlay").style.display = "block";
               })
          }
     })
}