/**
 * Fetches and parses a JSON file from a remote URL.
 * Synchronously sends a GET request to retrieve JSON data from the specified file path
 * on the GitHub repository and parses the response into a JavaScript object.
 *
 * @param {string} file - The name of the JSON file to fetch (without the .json extension).
 * @returns {object} The parsed JSON object from the response.
 */
function jsonFromFile(file) {
     var request = new XMLHttpRequest();
     request.open("GET", `https://raw.githubusercontent.com/keishispl/taikofumen-res/refs/heads/main/${file}.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}