const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('bg') === "image" || urlParams.get('bg') === "color") {
     var bgSetting = (urlParams.get('bg') === "image")
     document.cookie = `bg=${urlParams.get('bg')};`
     history.pushState(null, "", location.href.split("?")[0]);
} else {
     /**
      * Retrieves the value of a specified cookie by name.
      * If the cookie is not found, returns the default value "image".
      *
      * @param {string} cname - The name of the cookie to retrieve.
      * @returns {string} The value of the cookie or "image" if not found.
      */
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

/**
 * If the user has specified a background preference via the URL parameter, use it.
 * Otherwise, use the cookie value or default to "image".
 */
if (bgSetting) {
     document.body.classList.add('bg-enabled');
     document.body.classList.remove('bg-disabled');
     /**
      * The user has specified a background preference of "image".
      * So, add the bg-enabled class to the body.
      */
} else {
     document.body.classList.add('bg-disabled');
     document.body.classList.remove('bg-enabled');
     /**
      * The user has specified a background preference of "color".
      * So, add the bg-disabled class to the body.
      */
}

/**
 * Add an event listener to the bg-toggle element.
 * When the user clicks on the element, toggle the background preference.
 */
document.getElementById('bg-toggle').addEventListener('click', () => {
     if (document.body.classList.contains('bg-enabled')) {
          /**
           * The user has clicked on the bg-toggle element and the background preference is currently set to "image".
           * So, toggle the background preference to "color".
           */
          document.body.classList.replace('bg-enabled', 'bg-disabled');
          document.body.classList.remove('tint');
          document.cookie = 'bg=color;';
     } else {
          /**
           * The user has clicked on the bg-toggle element and the background preference is currently set to "color".
           * So, toggle the background preference to "image".
           */
          document.body.classList.replace('bg-disabled', 'bg-enabled');
          document.body.classList.add('tint');
          document.cookie = 'bg=image;';
     }
});
