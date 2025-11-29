document.addEventListener("keyup", function(event) {
     if (event.key == "ArrowRight") {
          document.getElementById("scrollable").scrollBy({
               left: window.innerWidth,
               behavior: 'smooth'
          });
     } else if (event.key == "ArrowLeft") {
          document.getElementById("scrollable").scrollBy({
               left: -window.innerWidth,
               behavior: 'smooth'
          });
     }
})