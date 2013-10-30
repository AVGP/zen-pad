var App = (function() {
  var self = {};

  //Adding listeners
  document.getElementById("open").addEventListener("click", function() {
    chrome.fileSystem.chooseEntry({}, function(fileEntry) {
      fileEntry.file(function(file){
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("content").innerHTML = e.target.result;
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
      
        var blob = new Blob([document.getElementById("content").innerText], {type: 'text/plain'});
        fileWriter.write(blob);
      }, function(err) {
        console.log("shit", err);
      });
    });
  });

  // return the instance
  return self;
})();
