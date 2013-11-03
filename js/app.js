var App = (function() {
  var self = {};
  var navBar = document.querySelector("nav");

  var SUPPORTED_MODES = {
    "js"     : "javascript",
    "html"   : "html",
    "css"    : "css",
    "coffee" : "coffee",
    "cs"     : "csharp",
    "go"     : "golang",
    "java"   : "java",
    "json"   : "json",
    "md"     : "markdown",
    "py"     : "python",
    "rb"     : "ruby",
    "sh"     : "sh",
    "sql"    : "sql",
    "xml"    : "xml",
    "yml"    : "yaml"
  };

  ace.config.set("basePath", "js/ace");

  self.editor = ace.edit("content");
  self.editor.setTheme("ace/theme/monokai");
  self.editor.getSession().setMode("ace/mode/javascript");

  //Hide/Show the menu bar
  document.body.addEventListener("mousemove", function(e) {
    if(e.pageY < 30 && navBar.className === "hidden") navBar.className = "visible";
    else if(e.pageY >= 30 && navBar.className === "visible") navBar.className = "hidden";
  });

  //Helper functions
  var setEditorModeForLanguage = function(fileExt) {
    if(SUPPORTED_MODES[fileExt]) {
      self.editor.getSession().setMode("ace/mode/" + SUPPORTED_MODES[fileExt]);
    }
  }
  
  var setEditorModeForFileEntry = function(fileEntry) {
    var extension = fileEntry.name.split('.').pop();
    setEditorModeForLanguage(extension);
  }
  
  var loadFileEntryToEditor = function(fileEntry) {
    fileEntry.file(function(file){
      var reader = new FileReader();
      reader.onload = function(e) {
        self.editor.setValue(e.target.result);
      };
      reader.readAsText(file);
    });

    self.currentFileEntry = fileEntry;
    setEditorModeForFileEntry(fileEntry);
  };

  var saveEditorToFileEntry = function(fileEntry) {
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
  };

  //Adding button event listeners
  document.getElementById("new").addEventListener("click", function() {
    self.currentFileEntry = null;
    self.editor.setValue("");
  });

  document.getElementById("open").addEventListener("click", function() {
    chrome.fileSystem.chooseEntry({}, loadFileEntryToEditor);
  });

  document.getElementById("save").addEventListener("click", function() {
    if(!self.currentFileEntry) {
      chrome.fileSystem.chooseEntry({type: "saveFile"}, function(fileEntry) {
        self.currentFileEntry = fileEntry;
        setEditorModeForFileEntry(fileEntry);
        chrome.fileSystem.getWritableEntry(self.currentFileEntry, saveEditorToFileEntry);
      });
    } else {
      chrome.fileSystem.getWritableEntry(self.currentFileEntry, saveEditorToFileEntry);
    }
  });

  document.getElementById("mode").addEventListener("click", function() {
    if(self.editor.getTheme() == "ace/theme/monokai") { //we are in dark mode
      document.getElementById("mode").className = "off";
      self.editor.setTheme("ace/theme/chrome");
    } else { //we are in light mode
      document.getElementById("mode").className = "on";
      self.editor.setTheme("ace/theme/monokai");
    }
  });

  // return the instance
  return self;
})();
