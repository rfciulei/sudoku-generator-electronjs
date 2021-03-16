// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//TO-DO : hide loader when finished
window.api.receive("fromMain", (data) => {
  // console.log("Received " + JSON.stringify(data));
  if (data === "finished") {
    console.log("[FINISHED] : a.exe ");
  }
  // document.getElementsByClassName("loaderRoot").innerHTML = "";
});
document.getElementById("btnGo").addEventListener("click", go, false);
function go() {
  let data = {
    numberOfPuzzles: document.getElementById("numberOfPuzzles").value,
    perPage: document.getElementById("perPage").value,
    difficulty: document.getElementById("difficulty").value,
    solutions: document.getElementById("solutions").checked,
  };

  window.api.send("toMain", data);

  let loaderHTML = `<div class="loader">
<div class="loading_1"></div>
</div>`;

  document.getElementById("loaderRoot").innerHTML = loaderHTML;
}
