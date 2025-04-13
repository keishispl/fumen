const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('bg') === "image" || urlParams.get('bg') === "color") {
     var bgSetting = (urlParams.get('bg') === "image")
     document.cookie = `bg=${urlParams.get('bg')};`
     history.pushState(null, "", location.href.split("?")[0]);
} else {
     function getCookie(cname) {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for (let i = 0; i < ca.length; i++) {
               let c = ca[i];
               while (c.charAt(0) == ' ') {
                    c = c.substring(1);
               }
               if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
               }
          }
          return "image";
     }

     var bgSetting = (getCookie("bg") === "image")
}

if (bgSetting === true) {
     body.classList.add('bg-enabled')
     body.classList.remove('bg-disabled')

     obj.classList.add('tint')
} else {
     body.classList.add('bg-disabled')
     body.classList.remove('bg-enabled')

     obj.classList.remove('tint')
}

document.getElementById(`bg-toggle`).addEventListener('click', () => {
     var body = document.getElementById('body')
     var obj = document.getElementById('obj')
     if (body.classList.contains('bg-enabled')) {
          body.classList.add('bg-disabled')
          body.classList.remove('bg-enabled')

          obj.classList.remove('tint')

          document.cookie = "bg=color;" // false
     } else {
          body.classList.add('bg-enabled')
          body.classList.remove('bg-disabled')

          obj.classList.add('tint')

          document.cookie = "bg=image;"
     }
});