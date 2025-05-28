var lineLength = 30;
var text = "";

for (var i = 0; i < lineLength; i++) {
     text += "_";
};

var lines = document.querySelectorAll('.line');
for (var i = 0; i < lines.length; i++) {
     lines[i].innerHTML = text;
};

const list = document.getElementById('jumplist');
['jpop', 'anime', 'vocaloid', 'touhou', 'game'].forEach(genre => {
     const link = document.createElement('p');
     link.innerHTML = genreLabels[genre];
     link.style.cursor = 'pointer';
     link.tabIndex = 1;
     link.id = "jump-" + genre;
     list.appendChild(link);

     link.addEventListener('click', () => {
          document.querySelector("." + genre).scrollIntoView({ behavior: 'smooth' });
     });
});

let menuClosed = true;

function menuToggle(bool) {
     function toggleOn() {
          document.body.classList.remove("menu-closed");
          document.getElementById("btn2").style.left = "310px";
          document.getElementById("bg-toggle").style.left = "307px";
          menuClosed = false;
          ['jpop', 'anime', 'vocaloid', 'touhou', 'game'].forEach(genre => {
               document.getElementById("jump-" + genre).tabIndex = 1;
          })
     }
     function toggleOff() {
          document.body.classList.add("menu-closed");
          document.getElementById("btn2").style.left = "10px";
          document.getElementById("bg-toggle").style.left = "7px";
          menuClosed = true;
          ['jpop', 'anime', 'vocaloid', 'touhou', 'game'].forEach(genre => {
               document.getElementById("jump-" + genre).tabIndex = -1;
          })
     }
     
     if (typeof bool !== 'undefined') {
          if (bool) {
               toggleOn();
          } else {
               toggleOff();
          }
     } else {
          if (menuClosed) {
               toggleOn();
          } else {
               toggleOff();
          }
     }
}

document.getElementById('btn2').addEventListener('click', () => {
     menuToggle();
});
window.addEventListener("keyup", function (e) {
     if (e.key === "m") {
          menuToggle();
     }
});

window.addEventListener("keyup", function (e) {
     if (e.key === "Escape") {
          menuToggle(false);
     }
});

menuToggle(false);