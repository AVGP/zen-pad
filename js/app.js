var App = (function() {
  var self = {};
  var navBar = document.querySelector("nav");

  ace.config.set("basePath", "js/ace");

  self.editor = ace.edit("content");
  self.editor.setTheme("ace/theme/monokai");
  self.editor.getSession().setMode("ace/mode/javascript");

  //Hide/Show the menu bar
  document.body.addEventListener("mousemove", function(e) {
    if(e.pageY < 30 && navBar.className === "hidden") navBar.className = "visible";
    else if(e.pageY >= 30 && navBar.className === "visible") navBar.className = "hidden";
  });

  //Adding button event listeners
  document.getElementById("open").addEventListener("click", function() {
    chrome.fileSystem.chooseEntry({}, function(fileEntry) {
      fileEntry.file(function(file){
        var reader = new FileReader();
        reader.onload = function(e) {
          self.editor.setValue(e.target.result);
        };
        reader.readAsText(file);
      });
      
      self.currentFileEntry = fileEntry;
    });    
  });

  document.getElementById("save").addEventListener("click", function() {
    chrome.fileSystem.getWritableEntry(self.currentFileEntry, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function() {
          console.log("Writing DONE");
        };
        fileWriter.onerror = function(err) {
          console.log("err", err, err.toString());
        }
      
        var blob = new Blob([self.editor.getValue()], {type: 'text/plain'});
        fileWriter.write(blob);
      }, function(err) {
        console.log("shit", err);
      });
    });
  });

  // return the instance
  return self;
})();
