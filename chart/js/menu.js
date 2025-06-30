let menuClosed = true;

/**
 * Toggles the menu on and off.
 * @param {boolean} [bool] - Optional boolean that can be used to toggle the menu on or off. If not provided, the function will toggle the menu depending on the current state.
 */
function menuToggle(bool) {
     function toggleOn() {
          document.getElementById("main").classList.remove("menu-closed");
          document.getElementById("menu-button").style.right = "310px";
          document.getElementById("sidebar-wrap").style.opacity = 1;
          document.getElementById("sidebar-wrap").style.zIndex = 4;
          menuClosed = false;

          setTimeout(() => {
               if (document.getElementById("main") && document.getElementById("main").clientWidth <= 880) {
                    document.getElementById("list-big-wrap").classList.add("list-fix");
               }
          }, 200);
     }
     function toggleOff() {
          document.getElementById("main").classList.add("menu-closed");
          document.getElementById("menu-button").style.right = "10px";
          document.getElementById("sidebar-wrap").style.opacity = 0;
          document.getElementById("sidebar-wrap").style.zIndex = -1;
          menuClosed = true;

          setTimeout(() => {
               if (document.getElementById("main") && document.getElementById("main").clientWidth > 880) {
                    document.getElementById("list-big-wrap").classList.remove("list-fix");
               }
          }, 200);
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
document.getElementById('menu-button').addEventListener('click', () => {
     menuToggle();
});
window.addEventListener("keyup", function (e) {
     if (e.key === "m") {
          menuToggle();
     } else if (e.key === "Escape") {
          menuToggle(false);
     }
});

menuToggle(false);
