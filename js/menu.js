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
     link.addEventListener('keyup', function (e) {
          if (e.key === "Enter") {
               document.querySelector("." + genre).scrollIntoView({ behavior: 'smooth' });
          }
     });
});

let menuClosed = true;

/**
 * Toggles the menu on and off.
 * @param {boolean} [bool] - Optional boolean that can be used to toggle the menu on or off. If not provided, the function will toggle the menu depending on the current state.
 */
function menuToggle(bool) {
     function toggleOn() {
          document.body.classList.remove("menu-closed");
          document.getElementById("btn2").style.right = "310px";
          document.getElementById("scroll").style.right = "310px";
          menuClosed = false;
          ['jpop', 'anime', 'vocaloid', 'touhou', 'game'].forEach(genre => {
               document.getElementById("jump-" + genre).tabIndex = 1;
          })
     }
     function toggleOff() {
          document.body.classList.add("menu-closed");
          document.getElementById("btn2").style.right = "10px";
          document.getElementById("scroll").style.right = "10px";
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

/**
 * Add an event listener to the btn2 (menu) element.
 * When the user clicks/press enter on the element, toggle the menu.
 */
document.getElementById('btn2').addEventListener('click', () => {
     if (!document.getElementById('loading')) {
          menuToggle();
     }
});
window.addEventListener("keyup", function (e) {
     if (e.key === "m") {
          if (!document.getElementById('loading')) {
               menuToggle();
          }
     } else if (e.key === "Escape") {
          menuToggle(false);
     }
});

menuToggle(false);
