function jsonFromFile(file) {
     var request = new XMLHttpRequest();
     request.open("GET", `https://raw.githubusercontent.com/keishispl/taikofumen-res/refs/heads/main/${file}.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}