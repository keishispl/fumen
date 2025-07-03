let menuClosed = true;
setTimeout(() => {
     document.getElementById("sidebar").style.display = "block";
}, 50)

/**
 * Toggles the menu on and off.
 * @param {boolean} [bool] - Optional boolean that can be used to toggle the menu on or off. If not provided, the function will toggle the menu depending on the current state.
 */
function menuToggle(bool) {
     function toggleOn() {
          document.getElementById("main").classList.remove("menu-closed");
          document.getElementById("menu-button").style.right = "300px";
          document.getElementById("sidebar-wrap").style.opacity = 1;
          document.getElementById("sidebar-wrap").style.zIndex = 4;
          menuClosed = false;
     }
     function toggleOff() {
          document.getElementById("main").classList.add("menu-closed");
          document.getElementById("menu-button").style.right = "10px";
          document.getElementById("sidebar-wrap").style.opacity = 0;
          document.getElementById("sidebar-wrap").style.zIndex = -1;
          menuClosed = true;
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

window.addEventListener("click", (e) => {
     if (!document.getElementById('menu-button').contains(e.target) && !document.getElementById('sidebar').contains(e.target) && !document.getElementById('settings-wrap').contains(e.target) && !document.getElementById('settings').contains(e.target)) {
          menuToggle(false);
     }
})


window.addEventListener("keyup", function (e) {
     var focus = false;

     // Check if the focus is on any of the input fields
     ["song", "artist", "source", "genre"].forEach(item => {
          if (document.getElementById("input-" + item).contains(document.activeElement)) {
               focus = true;
               return;
          }
     })

     if (focus) {
          return;
     }

     if (document.getElementById("settings").style.opacity === "0") {
          if (e.key === "m") {
               menuToggle();
          } else if (e.key === "Escape") {
               menuToggle(false);
          }
     }
});

menuToggle(false);
