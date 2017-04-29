$("#terminal").click(function() {
    if (!editing) $("#input").focus();
})

//bind paste inputs for non-styled text
document.getElementById("input").addEventListener('paste', handlePaste);

function handlePaste(e) {
    var clipboardData, pastedData;
    e.stopPropagation();
    e.preventDefault();
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('text');
    $('#input').html(pastedData);
}

$(document).ready(function() {
    print(getTime())
    weather()
    init()
})

function getTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var pm = false;
    if (m < 10) m = "0" + m;
    if (h >= 13) {
        h -= 12;
        pm = true;
    } else if (h < 1) {
        h += 12
    }
    return h + ":" + m + (pm ? " PM" : " AM")
}

var userName;
var userMachine;

function getName() {
    if (!localStorage.getItem('userName')) {
        userName = "guest"
    } else {
        userName = localStorage.getItem('userName')
    }
    return userName;
}

function setName(name) {
    if(name == "") {
        print("usage: name [newname]")
        return;
    }
    localStorage.setItem("userName", name)
    userName = name
    document.getElementById('prompt').innerHTML = getName() + '@' + getMachine() +':$&nbsp;'
    print("Set userName to " + userName + ".")
}

function getMachine() {
    if (!localStorage.getItem('userMachine')) {
        userMachine = "start"
    } else {
        userMachine = localStorage.getItem('userMachine')
    }
    return userMachine;
}

function setMachine(str) {
    if(str == "") {
        print("usage: machine [newname]")
        return;
    }
    localStorage.setItem("userMachine", str)
    userMachine = str
    document.getElementById('prompt').innerHTML = getName() + '@' + getMachine() +':$&nbsp;'
    print("Set userMachine to " + userMachine + ".")
}

function init() {
    input = document.getElementById("input");
    input.addEventListener("keydown", function(a){
        var key = a.keyCode;
        if(key == 13){ //enter
            a.preventDefault();
            handle(input.value);
            inputIndex = 0;
        } else if (key === 38) { //up arrow
            document.getElementById("input").innerHTML = lastInputs[inputIndex];
            inputIndex < lastInputs.length-1 ? inputIndex++ : true;
        } else if (key === 40) { //down arrow
            inputIndex > 0 ? inputIndex-- : true;
            if (inputIndex > 0) {
                inputIndex--;
                document.getElementById("input").innerHTML = lastInputs[inputIndex];
            } else {
                document.getElementById("input").innerHTML = "";
            }

        } else if (key === 9) { //tab
            if(!editing) {
                a.preventDefault();
                autocomplete(document.getElementById("input").innerHTML);
            }
        }
    });
    getName();
    getMachine();
    document.getElementById('prompt').innerHTML = getName() + '@' + getMachine() +':$&nbsp;'
    $("#input").focus();
}


function handle(text) {
    var input = $("#input").html();
    $("#input").html("");
    appendLastInput(input);
    addInput(input);

    if (input == "") return;

    //intercepting the function here to search
    if (searchString(input)) {
        print("Searching for " + input.slice(0, input.length-3) + "...")
        return;
    }

    var firstWord = input;
    firstWord = firstWord.split(" ")[0];
    var args = input;
    args = args.split(" ");
    args.shift();

    if (terminalFunctions.indexOf(firstWord) > -1) {
        //call it as a function
        window[firstWord](args);
    } else {
        //outside programs just need to have this function
        if (hook(input.split(" ")[0], args) != true) {
            print("Command " + "'" + input + "' not found. Type 'ls' for all commands.")
        }
    }

    document.getElementById('input').scrollIntoView();
}

function appendLastInput(text) {
    var inputBlobPre = '<p class="prompt">' + getName() + '@' + getMachine() +':$&nbsp;</p><pre class="input-old">'
    var inputBlobSuf = '</pre></br>'
    $(inputBlobPre + text + inputBlobSuf).insertBefore("#prompt");
}

function print(text) {

    //you can use multiple args with commas if you're lazy
    var finalText = ""
    var args = arguments;

    for (var a in args) {
        finalText += args[a] + " "
    }

    var pre = '<pre class="output">'
    var suf = '</pre>'

    $(pre + finalText + suf).insertBefore("#prompt");
}

//for fancy rendering
function fancyRender(text, color, size) {
    var pre = '<pre class="output" style="'
    if (color == undefined) {
        color = "inherit"
    }
    if (size == undefined) {
        //scale the font with whatever the currently defined prompt is
        size = $("#prompt").css("font-size")
    }
    pre += "color:" + color + "; "
    pre += "font-size:" + size + 'pt;"'

    pre += ">"
    var suf = '</pre>'
    $(pre + text + suf).insertBefore("#prompt");
}

//====================  TERMINAL FUNCTIONS  ========================
var terminalFunctions = [
    "about",
    "clear",
    "echo",
    "help",
    "history",
    "ls",
    "name",
    "machine",
    "re",
    "render",
    'search'];

function clear(input) {
    var data = '<p id="prompt" class="prompt">' + getName() + '@' + getMachine() + ':$&nbsp;</p><pre id="input" contenteditable="true" autofocus="true" spellcheck="false"></pre>'
    document.getElementById("terminal").innerHTML = data;
    init();
}

function about(input) {
    print("Features include tab autocompletion, a file editor, custom web searches and history, searchable with arrow keys.")
}

function history(input) {
    //print in descending order, without printing the history command
    for (var h=lastInputs.length-1; h>=0; h--) print(lastInputs[h]);
}

function help(input) {
    //add some kind of help for various functions (like rendering)
    fancyRender("general", "lightgray")
    var printStr = ""
    for (var i=0; i<terminalFunctions.length; i++) {
        printStr +=  "> " +(terminalFunctions[i]) + " ";
    }
    print(printStr)

    fancyRender("commands", "lightgray")
    printStr = ""
        if (typeof hookCommands != "undefined" && hookCommands.length > 0) {
        for (var i=0; i<hookCommands.length; i++) {
            printStr +=  "> " +(hookCommands[i]) + " ";
        }
        print(printStr)
    }

    printStr = ""
    if (typeof bookmarks != "undefined" && bookmarks.length > 0) {
        fancyRender("bookmarks", "lightgray")
        renderBookmarks();
    }

    printStr = ""
    if (typeof fileFunctions != "undefined" && fileFunctions.length > 0) {
        fancyRender("i/o", "lightgray")
        for (var i=0; i<fileFunctions.length; i++) {
            printStr +=  "> " +(fileFunctions[i]) + " ";
        }
    }
    print(printStr)

    printStr = ""
    if (!$.isEmptyObject(files)) {
        fancyRender("files", "lightgray")
        for(var prop in files) {
            printStr +=  "> " +(prop) + " "
        }
        print(printStr)
    }
}

function ls(input) {
    //horrible. converts input to a string by adding an empty string.
    if(input.slice(input.length - 2, input.length) + "" === "-b") {
        fancyRender("bookmarks", "lightgray")
        renderBookmarks();
        return;
    }
    if(input.slice(input.length - 2, input.length) + "" === "-c") {
        fancyRender("commands", "lightgray")
        if (typeof hookCommands != "undefined" && hookCommands.length > 0) {
            for (var i=0; i<hookCommands.length; i++) {
                print(hookCommands[i]);
            }
        }
        return;
    }

    if(input.slice(input.length - 2, input.length) + "" === "-f") {
        if ($.isEmptyObject(files)) {
            print("No files here.")
            return
        }
        fancyRender("files", "lightgray")
        for(var prop in files) {
            print(prop)
        }
        return;
    }
    help(input)
}

function echo(args) {
    if (args.length == 0) {
        print("usage: echo [text]")
        return
    }
    var printStr = args.join(" ")
    //greentexting
    if(printStr.indexOf("&gt;") === 0 ||
        printStr.indexOf(">") === 0) {
        printStr = cssColor(printStr, "#789922")
    }
    print(printStr);
}

function re(s) {
    location.reload();
}

function render(args) {
    var usage = "usage: render [text]; [color] [size]"
    if (args.length === 0) {
        print(usage)
        return
    }
    args = args.join(" ").split("; ")
    if (args.length === 1) {
        print(usage)
    }
    var cssVars = args[1].split(" ")
    if (args.length != 2) {
        print(usage)
        return
    }
    fancyRender(args[0], cssVars[0], cssVars[1]);
}

function search(s) {
    print("Usage: [query] -x")
    print("x is a switch for: ")
    print("a:   amazon")
    print("i:   g-images")
    print("g:   google")
    print("m:   wolfram alpha")
    print("v:   vimeo")
    print("w:   wikipedia")
    print("y:   youtube")
}

//====================  HISTORY  ===================================
//keep duplicates from being added, change "" to &nbsp;
var lastInputs = []
var inputIndex = 0;

if (localStorage.getItem("history")) {
    lastInputs = JSON.parse(localStorage.getItem("history"))
}

//adds to the beginning of the array
function addInput(str) {
    if (str === "" || /^[ ]+$/.test(str)) {
        return;
    }
    if (lastInputs[0] === str){ return};
    if (lastInputs.length > 0) {
        if (lastInputs[lastInputs.length - 1] != str) lastInputs.unshift(str)
    } else lastInputs.unshift(str);
    localStorage.setItem("history", JSON.stringify(lastInputs))
}

//====================  TAB AUTO-COMPLETION ========================
function autocomplete(string) {
    //first search term commands, then maybe hooked commands
    for (var i=0; i<terminalFunctions.length; i++) {
        if (terminalFunctions[i].indexOf(string) === 0) {
            document.getElementById("input").innerHTML = terminalFunctions[i];
            return
        }
    }
    //if hook commands exist
    if (typeof hookCommands != "undefined" && hookCommands.length > 0   ) {
        for (var i=0; i<hookCommands.length; i++) {
            if (hookCommands[i].indexOf(string) === 0) {
                document.getElementById("input").innerHTML = hookCommands[i];
                return
            }
        }
    }
    if (typeof bookmarks != "undefined" && bookmarks.length > 0) {
        for (var i=0; i<bookmarks.length; i++) {
            if(bookmarks[i][0].indexOf(string) === 0) {
                document.getElementById("input").innerHTML = bookmarks[i][0];
                return
            }
        }
    }
    if (typeof fileFunctions != "undefined" && fileFunctions.length > 0   ) {
        for (var i=0; i<fileFunctions.length; i++) {
            if (fileFunctions[i].indexOf(string) === 0) {
                document.getElementById("input").innerHTML = fileFunctions[i];
                return
            }
        }
    }
    //autocompleting based on filenames
    console.log(string)
    var tempCommand = string.split(" ")[0];
    if (fileFunctions.indexOf(tempCommand) >= 0
            && string.split(" ").length > 1) {
        var beginName = string.split(" ")[1];
        Object.keys(files).forEach(function(key, index) {
            if (key.indexOf(beginName) === 0)   {
                document.getElementById("input").innerHTML = tempCommand + " " + key
                return
            }
        })
    }

    //looking through history
    for (var i=0; i<lastInputs.length; i++) {
        if (lastInputs[i].indexOf(string) === 0) {
            document.getElementById("input").innerHTML = lastInputs[i];
            return
        }
    }
}

//====================  SEARCHING ==================================
function searchString(query) {
    var original = query;
    var modifier = query.substr(query.length-2);
    query = query.slice(0, query.length-3); //remove " -x"
    switch (modifier) {
        case "-a":
            window.location = "http://www.smile.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=" +
            query.replace(" ", "+");
            return true;
        case "-y":
            window.location =
                "https://www.youtube.com/results?search_query=" +
                query.replace(" ", "+");
            return true;
        case "-w":
            window.location =
                "https://en.wikipedia.org/w/index.php?search=" +
                query.replace(" ", "%20");
            return true;
        case "-m":
            window.location =
            "http://www.wolframalpha.com/input/?i=" +
            query.replace("+", "%2B");
            return true;
        case "-v":
            window.location =
            "https://vimeo.com/search?q=" +
            query.replace(" ", "+");
            return true;
        case "-g":
            window.location =
            "https://www.google.com/#q=" +
            query.replace(" ", "+")
            return true
        case "-i":
            window.location =
            "https://www.google.com/search?tbm=isch&q=" +
            query.replace(" ", "+")
            return true
    }
    return false;
}

//====================  HELPER FUNCTIONS  ==========================
function randRange(n) {
  return Math.ceil(Math.random() * n);
}

function rollDie(args) {
    print(randRange(Number(args.substr(1))));
}

//returns a span with the color of a string, good for chaining with print()
function cssColor(string, colorName) {
    return "<span style='color:" + colorName + "'>" + string + "</span>"
}

function renderBookmarks() {
    var outputstr = ""
    for (var i=0; i<bookmarks.length; i++) {
        outputstr += '> <a href="' + bookmarks[i][1] + '">' + bookmarks[i][0] + '</a> '
    }
    print(outputstr)
}
