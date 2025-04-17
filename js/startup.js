document.title = 'Loading...'

setTimeout(() => {
     document.title = '圭紫の太鼓の達人創作譜面'
     document.getElementById("loading").remove()
     if (bgSetting === true) {
          document.getElementById("obj").classList.add("tint")
     }

     const showObjects = [
          "table",
          "bg-toggle",
          "source",
          "logotext"
     ]
     for (var i = 0; i < showObjects.length; i++) {
          document.getElementById(showObjects[i]).classList.remove("hidden")
     }

     const genreToLoad = [
          "jpop",
          "anime",
          "vocaloid",
          "touhou",
          "game"
     ]

     var index = 1

     var length = genreToLoad.length
     for (var i = 0; i < length; i++) {
          jsonFromFile(genreToLoad[i]).forEach((song) =>
               parseSong(song, genreToLoad[i], index),
               index += 1
          )
     }
}, Math.floor(Math.random() * (800 - 100)) + 100)