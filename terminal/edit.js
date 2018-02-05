var editElement = '<div id="editWrapper"><textarea id="editArea" rows="20" cols="80" spellcheck="false"></textarea></div>'
var editing = false;
var currentFileName = ""
var files = {}
var editFunctions = [
    'edit',
    'close',
    'save',
    'rm',
    'cat',
]

var lastTitle = document.title

//files are stored as objects with keys (filenames) and values (innerHTML)

if (localStorage.getItem("textFiles")) {
    files = JSON.parse(localStorage.getItem("textFiles"))
}

//add an escape listener to get back to the input line
$(document).keyup(function(e) {
     if (e.keyCode == 27 && editing) { // escape
        document.getElementById("input").focus();
    }
});

var edit = {
    main: function(args) {
        //make sure there's no window open already
        if (editing){
            render("Can't open two files at once, friend.")
            return
        }
        //make sure there's a filename
        if (args[0] == "" || args.length == 0) {
            render("Usage: edit [filename]")
            return
        }

        var fileName = args[0];

        //open the editor window
        $("#terminal").append(editElement);
        currentFileName = fileName;
        //open it if it exists
        if (files[fileName]) {
            document.getElementById("editArea").value = files[fileName]
        }
        document.getElementById("editArea").focus();
        editing = true;
        files[currentFileName] = editArea.value;
        localStorage.setItem("textFiles", JSON.stringify(files))

        //update the tab title
        document.title += "/" + fileName
        setCloseConfirm(true);
    },
    helpText: 'Creates or opens a local file for editing.'
}

var save = {
    main: function() {
        if(!editing) {
            render("No file open to save.")
            return
        }
        files[currentFileName] = editArea.value;
        localStorage.setItem("textFiles", JSON.stringify(files))
        render(currentFileName + " saved at "+getTime()+".")
    },
    helpText: 'Saves an open file.'
}

var close = {
    main: function() {
        var editArea = document.getElementById("editArea");
        if (!editing) {
            render("No file open.")
            return
        }
        editing = false;
        files[currentFileName] = editArea.value;
        localStorage.setItem("textFiles", JSON.stringify(files))
        $("#editWrapper").remove();
    	document.title = lastTitle
        setCloseConfirm(false)
    },
    helpText: 'Saves and closes an open file.'
}

var rm = {
    main: function(fileName) {
        if (fileName === "") {
            render("Usage: rm [filename]")
            return
        }

        if (files.hasOwnProperty(fileName)) {
            delete files[fileName]
            render(fileName + " deleted.")
            if (editing) {
                $("#editWrapper").remove()
    			$("#input").unbind("keydown.vim");
                editing = false;
                document.title = lastTitle
            }
        } else {
            render(fileName + " doesn't exist.")
        }
        localStorage.setItem("textFiles", JSON.stringify(files))
        setCloseConfirm(false)
    },
    helpText: 'Deletes and/or closes a file. Irreversible.'
}

var cat = {
    main: function(fileName) {
        if (fileName === "") {
            render("Usage: cat [filename]")
            return
        }

        if (files.hasOwnProperty(fileName)) {
            render(files[fileName])
            return
        }

        render("No file named '" + fileName + "'.")
    },
    helpText: 'Renders the contents of a file to the terminal.'
}  
